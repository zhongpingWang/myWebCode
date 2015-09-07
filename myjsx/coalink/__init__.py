# -*- coding: utf-8 -*-

from __future__ import absolute_import
import importlib
from flask import Flask
from flask.ext.mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.webpack import Webpack
from config import config

db = SQLAlchemy()
mail = Mail()

# 添加模块
modules = [
    'coalink.main',
    'coalink.admin',
    'coalink.commons',
    'coalink.account',
]


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # 初始化db
    db.init_app(app)
    mail.init_app(app)

    # 初始化 webpack
    webpack = Webpack()
    webpack.init_app(app)

    from .core import api
    api.init_app(app)

    # 初始化莫苦熬
    for module_name in modules:
        module = importlib.import_module(module_name)
        if hasattr(module, 'init_app'):
            module.init_app(app)
        if hasattr(module, 'init_api'):
            module.init_api(api.api)

    return app
