# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime
from coalink import db


class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    nickname = db.Column(db.String(80))
    email = db.Column(db.String(80), unique=True, index=True)
    mobile = db.Column(db.String(80), unique=True, index=True)
    password = db.Column(db.String(80))
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))

    # 员工等级
    level = db.Column(db.Integer, default=1)
    # 是否激活
    active = db.Column(db.Boolean, default=False)
    # 状态; -1: 删除, 0: 禁用, 1: 正常
    status = db.Column(db.Integer, default=1)

    date_joined = db.Column(db.DateTime, default=datetime.datetime.now)
    date_updated = db.Column(db.DateTime, default=datetime.datetime.now)

    def is_superuser(self):
        return self.level == 0
