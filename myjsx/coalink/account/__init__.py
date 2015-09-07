# -*- coding: utf-8 -*-
from flask import Blueprint, session, request, g
from coalink import db
from .views import AccountActionResource
from .models import UserAccessToken

bp = Blueprint('account', __name__, url_prefix='/account')
bp.add_url_rule('/<string:action>', view_func=views.AccountActionView.as_view('account_action'))


@bp.before_app_request
def before_request():
    access_token = session.get("access_token")
    if not access_token:
        access_token = request.args.get("access_token")
    if not access_token:
        access_token = request.form.get("access_token")
    if not access_token and isinstance(request.json, dict):
        access_token = request.json.get("access_token")

    user_token = db.session.query(UserAccessToken).filter_by(token=access_token).first()
    if user_token:
        g.current_user = user_token.user


def init_app(app):
    app.register_blueprint(bp)


def init_api(api):
    api.add_resource(AccountActionResource, '/account/<string:action>')
