# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from flask import Blueprint, session, g
from coalink import db
from .models import Staff

bp = Blueprint('admin', __name__, url_prefix='/admin')
from .views import admin_index
from .models import Staff


@bp.before_app_request
def before_request():
    staff_id = session.get("staff_id")
    staff = db.session.query(Staff).filter(Staff.id == staff_id).first()
    if staff:
        g.staff = staff
    else:
        g.staff = None


def init_app(app):
    app.register_blueprint(bp)

