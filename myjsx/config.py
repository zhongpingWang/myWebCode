# -*- coding: utf-8 -*-
import os


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or \
                 '\x91\xe6\x07\x9c\xbc\xa4I]\xf3\x12\x16F|\x99\x10\xc7\xee\x86g\xe7z\xd9\xbe\xcb'
    WEBPACK_MANIFEST_PATH = os.path.join(os.path.dirname(__file__), 'coalink/assets/manifest/manifest-dev.json')
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True

    BASE_DIR = os.path.dirname(__file__)

    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'upload'))
    OSS_KEY_ID = os.environ.get('OSS_KEY_ID', 'hwzCyhW9BssRwb8h')
    OSS_KEY_SECRET = os.environ.get('OSS_KEY_SECRET', '6j0rrgyPKLNRx8oHgIbC4b9rw9vJmo')


    MAIL_SERVER = os.environ.get('FLASK_MAIL_SERVER', 'smtp.exmail.qq.com')
    MAIL_PORT = os.environ.get('FLASK_MAIL_PORT', 465)
    MAIL_USE_SSL = os.environ.get('FLASK_MAIL_USE_SSL', True)
    MAIL_USERNAME = os.environ.get('FLASK_MAIL_USERNAME', 'no-reply@coalink.com')
    MAIL_PASSWORD = os.environ.get('FLASK_MAIL_PASSWORD', 'Coalink01!')

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://coalink:Coalink01!@localhost:5432/coalink_dev_db'


class ProductionConfig(Config):
    WEBPACK_MANIFEST_PATH = os.path.join(os.path.dirname(__file__), 'coalink/assets/manifest/manifest.json')
    SQLALCHEMY_DATABASE_URI = os.environ.get('COALINK_DATABASE_URL') or \
                              "postgresql+psycopg2://coalink:Coalink01!@localhost:5432/coalink_dev_db"


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
