# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import
from flask import render_template
from . import bp


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/about')
def about():
    return render_template('main/about.html')


@bp.route('/us')
def us():
    return render_template('main/us.html')


@bp.route('/join')
def jobs():
    return render_template('main/join.html')


@bp.route('/contact')
def contact():
    return render_template('main/contact.html')


@bp.route('/faq')
def faq():
    return render_template('main/faq.html')


@bp.route('/howto')
def how_to():
    raise NotImplementedError()


@bp.route('/price')
def price():
    raise NotImplementedError()


@bp.route('/feedback')
def feedback():
    raise NotImplementedError()
