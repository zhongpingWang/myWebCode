# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from flask import Blueprint, redirect
from flask.ext.restful import Api

bp = Blueprint('api', __name__, url_prefix='/api')
api = Api(bp)


@bp.route("/documents")
def apidoc():
    return redirect('/static/apidoc/index.html')


def init_app(app):
    app.register_blueprint(bp)
