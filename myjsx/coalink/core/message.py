# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
from coalink import mail
from flask import render_template
from flask.ext.mail import Message
import requests


def send_message():
    pass


def send_email(subject, recipients, template, context=None):
    """
    发送邮件
    :param subject:
    :param recipients:
    :param template:
    :param context:
    :return:
    """
    if not context:
        context = dict()
    msg = Message(
        subject=subject,
        sender='no-reply@coalink.com',
        recipients=recipients,
        html=render_template(template, **context)
    )
    mail.send(msg)


def send_code_message(mobile, code):
    """
    发送验证码
    :param mobile:
    :param code:
    :return:
    """
    return requests.post("https://api.submail.cn/message/xsend.json", json={
        "appid": "10038",
        "to": mobile,
        "project": "lJGNl3",
        "vars": json.dumps({"code": code}),
        "signature": "01901c91749e9f1d60f93442950c13f0"
    }).json()
