# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from flask import render_template
from coalink.admin import bp
from coalink.core.web import templated


@bp.route("/")
@templated("admin/index.html")
def admin_index():
    return {}
