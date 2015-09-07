## 开发环境准备

### 开发工具
在开发环境中，使用[npm]和[bower]来安装进行预处理的工具、css包、js库等组件。
在Mac上安装这2个工具的命令如下：

    $ brew install nodejs
    $ npm install bower -g

    安装npm的淘宝镜像，安装后可以使用cnpm替代npm。
    $ sudo npm install -g cnpm --registry=https://registry.npm.taobao.org

### 依赖库
当开始或添加了新的依赖库后，需要运行下列命令安装依赖库：

    $ cnpm install

## 开发与调试

### 开发调试
在进行开发时，需要启动两个Web服务，一个用于提供Web前端的静态文件，另一个通过Flask提供的调试
Web Server。因而在进行开发时，需要启动2个服务：
    1. Web前端开发模式，对文件的修改会自动触发assets的编译
    $ npm run dev
    或生产模式，文件修改后需重新编译。
    $ npm run build

    2. Python后端

    如在Terminal中启动后端，需先激活Python的虚拟环境.
    $ cd ~/dev/coalink
    $ source env/bin/activate

    当python依赖库变化是，需要使用下面命令更新依赖库：
    $ cd ~/dev/coalink
    $ source env/bin/activate
    $ pip install -r requirements/local.txt

    如何数据库升级，需要运行下列命令升级数据库
    $ cd ~/dev/coalink
    $ source env/bin/activate
    $ export FLASK_CONFIG=development && python manage.py db upgrade

    虚拟环境激活后，可以运行下列命令以开发模式启动后端服务:
    $ export FLASK_CONFIG=development && python manage.py runserver

    虚拟环境激活后，运行下列命令可以以生产模式启动后端服务:
    $ export FLASK_CONFIG=production && python manage.py runserver


 ### 添加页面

     当添加一个新的页面时，需要添加如下内容：
     1. 在assets/pages目录下创建页面的目录，如product。(可参考assets/pages/main)
     在该目录下，添加index.js及styles\index.less作为js及css代码的入口。图片文件保存在images目录中。

     2. 在webpack.config.js中的config/entry中添加js及css的入口，如：

         product: ['./pages/product/'],
         productcss: ['./pages/product/styles/index.less']

     3. 在Flask页面模板文件中，添加对js, css的使用。

        <head>中添加css
         {{ stylesheet_tag('maincss') | safe }}

        <body>后添加<script>
         {{ javascript_tag('main') | safe }}


### 生产测试
在进行生产环境部署时，需要对进行部署的代码进行测试，需要执行的步骤如下：

    1. Web前端编译
    $ npm run deploy

    2. Python后端，需配置环境变量FLASK_CONFIG=production
    $ python manage.py runserver 或通过Pycharm启动

## 生产环境部署

通过使用[Fabric]脚步，将阿里云生产环境部署的工作自动化，而不需要通过ssh远程到服务器中
进行手工操作，这样可以确保部署的可靠及一致性。

### 初始化
在第一次使用[Fabric]进行部署前，需要进行下列步骤对阿里云及本地开发环境进行配置及安装工具。

1. 获得并使用阿里云ECS服务器root帐号，使用ssh远程登录创建本应用使用的系统帐号，
并添加到sudo组中（系统帐号可使用应用的名称）:

        $ adduser [app_name]
        $ adduser [app_name] sudo

2. 在本地开发环境中，**全局**安装fabric。fabric只能在python2中运行，安装时确保pip使用的
是python2。

        $ pip install fabric

3. 如App未在生产环境中初始化，可在项目目录中运行`fab setup`进行生产环境中自动部署的初始化。
如生产环境中已经初始化，则不需要运行`fab setup`。

4. 创建生产环境中git的remote配置，如：

        $ git remote add production coalink@114.215.97.220:/webapps/git/coalink

### 启动方式

[Fabric]: http://docs.fabfile.org/
[npm]: https://nodejs.org/
[bower]: http://bower.io/
