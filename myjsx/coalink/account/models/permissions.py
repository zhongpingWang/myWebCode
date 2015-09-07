# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from coalink import db
from coalink.core.exceptions import UserError


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), unique=True)
    key = db.Column(db.String(128), unique=True)
    permissions = db.relationship("Permission", secondary=db.Table(
        'role_permission_rel', db.metadata,
        db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
        db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'))
    ))

    # TODO: 角色添加权限
    def add_permission(self, operation):
        permission = db.session.query(Permission).filter(
            Permission.operation == operation
        ).first()
        if not permission:
            raise UserError("该权限不存在")
        self.permissions.append(permission)
        db.session.commit()
        return self


class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), unique=True)
    operation = db.Column(db.String(128), unique=True)


class GrantPermission(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    res_model = db.Column(db.String(32), index=True)
    res_id = db.Column(db.Integer, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    permission_id = db.Column(db.Integer, db.ForeignKey('permission.id'))
