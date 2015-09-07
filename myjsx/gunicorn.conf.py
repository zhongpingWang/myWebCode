# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import multiprocessing
import os

# TODO: [REV] 调整gunicorn配置？

bind = '127.0.0.1:8000'
workers = multiprocessing.cpu_count() * 2 + 1

backlog = 2048
debug = False
worker_class = "gevent"  # sync, gevent,meinheld
proc_name = 'Gunicorn: coalink'
pidfile = '/webapps/run/coalink.pid'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
accesslog = '/webapps/log/coalink/access.log'
errorlog = '/webapps/log/coalink/info.log'
loglevel = 'info'

# reload = True
chdir = os.path.dirname(__file__)


def post_fork(server, worker):
    server.log.info("启动服务器 (pid: %s)", worker.pid)


def pre_fork(server, worker):
    pass


def pre_exec(server):
    server.log.info("分叉子进程, 重新启动.")


def when_ready(server):
    server.log.info("服务器已启动.")


def worker_int(worker):
    worker.log.info("worker received INT or QUIT signal")

    ## get traceback info
    import threading, sys, traceback

    id2name = dict([(th.ident, th.name) for th in threading.enumerate()])
    code = []
    for threadId, stack in sys._current_frames().items():
        code.append("\n# Thread: %s(%d)" % (id2name.get(threadId, ""),
                                            threadId))
        for filename, lineno, name, line in traceback.extract_stack(stack):
            code.append('File: "%s", line %d, in %s' % (filename,
                                                        lineno, name))
            if line:
                code.append("  %s" % (line.strip()))
    worker.log.debug("\n".join(code))


def worker_abort(worker):
    worker.log.info("程序接受sigabrt信号")


def worker_exit(server, worker):
    worker.log.info("退出程序 (PID: %d)" % worker.pid)
