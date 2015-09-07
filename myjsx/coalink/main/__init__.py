# -*- coding: utf-8 -*-

from flask import Blueprint, jsonify, render_template, flash
from coalink.core.exceptions import ResourceUserError, ViewUserError

bp = Blueprint('main', __name__)


@bp.app_errorhandler(ResourceUserError)
def handle_user_error(error):
    response = jsonify(error.to_dict())
    return response


@bp.app_errorhandler(ViewUserError)
def handle_user_error(error):
    flash(error.message)
    return render_template('error/user_error.html')


from . import views


def init_app(app):
    app.register_blueprint(bp)
