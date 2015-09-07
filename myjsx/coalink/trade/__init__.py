# -*- coding: utf-8 -*-
from flask import Blueprint

trade_bp = Blueprint('trade', __name__, url_prefix='/trade')
product_bp = Blueprint('product', __name__, url_prefix='/product')


def init_app(app):
    app.register_blueprint(trade_bp)
    app.register_blueprint(product_bp)
