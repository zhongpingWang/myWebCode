# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import base64
import datetime
import hashlib
import random
import uuid
from coalink import db
from coalink.core import message
from coalink.core.exceptions import ResourceUserError, UserError


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    email = db.Column(db.String(80), unique=True, index=True)
    mobile = db.Column(db.String(80), unique=True, index=True)
    password = db.Column(db.String(80))

    nickname = db.Column(db.String(80))
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    gender = db.Column(db.Integer, default=1)

    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    company = db.relationship("Company", backref='employees', foreign_keys=[company_id])

    # 是否激活
    active = db.Column(db.Boolean, default=False)
    # 状态; -1: 删除, 0: 禁用, 1: 正常
    status = db.Column(db.Integer, default=1)

    date_joined = db.Column(db.DateTime, default=datetime.datetime.now)
    date_updated = db.Column(db.DateTime, default=datetime.datetime.now)

    roles = db.relationship("Role", secondary=db.Table(
        'user_role_rel', db.metadata,
        db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
    ))

    # TODO: 用户添加角色
    def add_role(self, role_key):
        from coalink.account.models import Role
        role = db.session.query(Role).filter(
            Role.key == role_key
        ).first()
        if not role:
            raise UserError("该角色不存在")
        self.roles.append(role)
        db.session.commit()
        return self

    # 获取用户当前拥有的权限
    def get_permissions(self):
        permissions = []
        for role in self.roles:
            permissions.extend(role.permissions)
        return permissions

    # 设置密码
    def set_password(self, password):
        self.password = self._encrypt(password)
        self.date_updated = datetime.datetime.now()

    # 判断是否是密码
    def is_password(self, password):
        return self.password == self._encrypt(password)

    # 生成 access_token
    def generate_access_token(self):
        return UserAccessToken.generate(self)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'nickname': self.nickname or ("{0}{1}".format(self.last_name, self.first_name)),
            'active': self.active
        }

    # 密码加密
    def _encrypt(self, password):
        if not self.date_joined:
            self.date_joined = datetime.datetime.now()
        m = hashlib.md5()
        m.update(str(password))
        m.update(self.date_joined.strftime("%Y-%m-%d %H%:%M:%S"))
        return base64.b64encode(m.digest())


# class UserActivity(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)

class UserAccessToken(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship(User, backref='access_tokens')
    token = db.Column(db.String(64), index=True)
    last_ip = db.Column(db.String(16))
    last_device = db.Column(db.String(128))
    last_position_x = db.Column(db.Float)
    last_position_y = db.Column(db.Float)
    date_expired = db.Column(db.DateTime, default=datetime.datetime.now)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now)
    date_updated = db.Column(db.DateTime, default=datetime.datetime.now)

    @classmethod
    def generate(cls, user):
        access_token = cls()
        access_token.user_id = user.id
        access_token.token = base64.b64encode(str(uuid.uuid4()))
        db.session.add(access_token)
        db.session.commit()
        return access_token


class DyCode(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(32), index=True)
    mobile = db.Column(db.String(32), index=True)
    code = db.Column(db.String(64), index=True)
    expired = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now)
    date_updated = db.Column(db.DateTime, default=datetime.datetime.now)

    @staticmethod
    def generate_code(mobile=None, email=None):
        if not (mobile or email) or (mobile and email):
            raise ResourceUserError("手机号或邮箱同时只能取其一")
        code = None
        if mobile:
            code = str(random.random())[2:8]
        if email:
            code = base64.b64encode(str(uuid.uuid4()))

        code_obj = DyCode()
        code_obj.code = code
        code_obj.email = email
        code_obj.mobile = mobile
        db.session.add(code_obj)
        db.session.commit()
        return code_obj

    @staticmethod
    def valid(mobile=None, email=None, code=None):
        code_obj = None
        if mobile:
            code_obj = db.session.query(DyCode).filter(
                DyCode.mobile == mobile,
                DyCode.code == code,
                DyCode.expired == False
            ).first()
        elif email:
            code_obj = db.session.query(DyCode).filter(
                DyCode.email == email,
                DyCode.code == code,
                DyCode.expired == False
            ).first()

        if code_obj:
            code_obj.expired = True
            code_obj.date_updated = datetime.datetime.now()
            db.session.commit()
            return True
        else:
            return False

    def send(self, template=None):
        if self.email:
            self._send_email(template=template)
        if self.mobile:
            self._send_mobile()
        from flask import current_app
        current_app.logger.info("{0}/{1}: {2}".format(self.mobile, self.email, self.code))
        return True

    def _send_email(self, template=None):
        message.send_email(
            subject='激活账户',
            recipients=[self.email],
            template=template or 'email/account_active.html',
            context={
                "email": self.email,
                "code": self.code
            }
        )

    def _send_mobile(self):
        message.send_code_message(self.mobile, self.code)
        return True
