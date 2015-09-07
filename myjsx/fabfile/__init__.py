# -*- coding: utf-8 -*-

from fabric.api import *
from fabric.contrib.files import exists

app_name = 'coalink'
app_user = 'coalink'
local_app_dir = './coalink'
local_config_dir = './fabfile'

remote_www_dir = '/webapps/www'
remote_git_dir = '/webapps/git'
remote_app_dir = remote_www_dir + '/' + app_name
remote_nginx_dir = '/etc/nginx/sites-enabled'
remote_supervisor_dir = '/etc/supervisor/conf.d'

env.hosts = ['114.215.97.220']
env.user = app_user


def install_requirements():
    # sudo('apt-get update')
    sudo('apt-get install -y python')
    sudo('apt-get install -y python-pip')
    sudo('apt-get install -y python-virtualenv')
    sudo('apt-get install -y nginx')
    sudo('apt-get install -y gunicorn')
    sudo('apt-get install -y supervisor')
    sudo('apt-get install -y git')
    sudo('apt-get install -y libpq-dev')
    sudo('apt-get install -y python-dev')
    # sudo('apt-get install -y python-mysqldb')
    # sudo('apt-get install -y libmysqlclient-dev')


def configure_database():
    if exists(remote_app_dir + '/env') is False:
        with cd(remote_app_dir):
            run('virtualenv env')

    with cd(remote_app_dir):
        with prefix('source env/bin/activate'):
            with shell_env(FLASK_CONFIG='production',
                           COALINK_DATABASE_URL='postgresql+psycopg2://coalink:Coalink01!@localhost:5432/coalink_db'):
                sudo('python manage.py db upgrade')


def configure_virtualenv():
    if exists(remote_app_dir + '/env') is False:
        with cd(remote_app_dir):
            run('virtualenv env')

    with cd(remote_app_dir):
        if exists(remote_app_dir + '/requirements/production.txt'):
            with prefix('source env/bin/activate'):
                sudo('pip install -r requirements/production.txt')


def configure_nginx():
    """
    1. Remove default nginx config file
    2. Create new config file
    3. Setup new symbolic link
    4. Copy local config to remote config
    5. Restart nginx
    """
    sudo('/etc/init.d/nginx start')
    if exists('/etc/nginx/sites-enabled/default'):
        sudo('rm /etc/nginx/sites-enabled/default')
    if exists('/etc/nginx/sites-enabled/' + app_name) is False:
        sudo('touch /etc/nginx/sites-available/' + app_name)
        sudo('ln -s /etc/nginx/sites-available/' + app_name +
             ' /etc/nginx/sites-enabled/' + app_name)
    with lcd(local_config_dir):
        with cd(remote_nginx_dir):
            put('./nginx.conf', './' + app_name, use_sudo=True)
    sudo('/etc/init.d/nginx restart')


def configure_supervisor():
    """
    1. Create new supervisor config file
    2. Copy local config to remote config
    3. Register new command
    """
    with lcd(local_config_dir):
        with cd(remote_supervisor_dir):
            put('./supervisor.conf', './' + app_name + '.conf', use_sudo=True)
            sudo('supervisorctl reread')
            sudo('supervisorctl update')


def configure_bower():
    with cd(remote_app_dir + '/coalink/static/'):
        run('bower install --allow-root')


def configure_git():
    """
    1. Setup bare Git repo
    2. Create post-receive hook
    """
    with cd(remote_git_dir):
        if exists(app_name) is False:
            sudo('mkdir ' + app_name)
            sudo('chown ' + app_user + ':sudo ' + app_name)
            with cd(app_name):
                run('git init --bare')

        with cd(app_name):
            with lcd(local_config_dir):
                with cd('hooks'):
                    put('./post-receive', './', use_sudo=True)
                    sudo('chmod +x post-receive')


@task(alias='run')
def run_app():
    """启动生产环境中的App"""
    with cd(remote_app_dir):
        with prefix('source env/bin/activate'):
            sudo('supervisorctl start ' + app_name)


@task
def deploy():
    """将代码部署到生产系统中"""

    """
    1. Copy new Flask files
    2. Restart gunicorn via supervisor
    """
    with lcd(local_app_dir):
        # local('git add -A')
        # commit_message = prompt("Commit message?")
        # local('git commit -am "{0}"'.format(commit_message))
        local('git push production master')

    with cd(remote_app_dir):
        sudo('supervisorctl restart ' + app_name)


@task
def rollback():
    """回滚到上一个版本"""
    """
    1. Quick rollback in case of error
    2. Restart gunicorn via supervisor
    """
    with lcd(local_app_dir):
        local('git revert master  --no-edit')
        local('git push production master')
        sudo('supervisorctl restart ' + app_name)


@task
def setup():
    """初始化生产系统中的自动部署环境"""

    # 创建App的目录，并给用户授权
    if exists(remote_www_dir) is False:
        sudo('mkdir ' + remote_www_dir)
    if exists(remote_git_dir) is False:
        sudo('mkdir ' + remote_git_dir)

    if exists(remote_app_dir) is False:
        sudo('mkdir ' + remote_app_dir)
        sudo('chown ' + app_user + ':sudo ' + remote_app_dir)

    install_requirements()
    configure_virtualenv()
    configure_database()
    configure_nginx()
    # configure_bower()
    configure_supervisor()
    configure_git()


@task
def status():
    """检查App运行状态"""
    sudo('supervisorctl status')
