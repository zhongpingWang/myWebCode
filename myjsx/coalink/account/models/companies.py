# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from coalink import db


class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String(120), unique=True, index=True)

    address_province = db.Column(db.String(32))
    address_city = db.Column(db.String(32))
    address_district = db.Column(db.String(32))
    address_detail = db.Column(db.String(64))

    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    certified = db.Column(db.Boolean, default=False)

    # 状态 0: 创建 1: 申请认证 2: 认证通过
    status = db.Column(db.Integer, default=0, index=True)

    license1_id = db.Column(db.Integer, db.ForeignKey('attachment.id'), nullable=True)
    license2_id = db.Column(db.Integer, db.ForeignKey('attachment.id'), nullable=True)
    license3_id = db.Column(db.Integer, db.ForeignKey('attachment.id'), nullable=True)
    license4_id = db.Column(db.Integer, db.ForeignKey('attachment.id'), nullable=True)
    license5_id = db.Column(db.Integer, db.ForeignKey('attachment.id'), nullable=True)

    license1 = db.relationship("Attachment", foreign_keys=[license1_id])
    license2 = db.relationship("Attachment", foreign_keys=[license2_id])
    license3 = db.relationship("Attachment", foreign_keys=[license3_id])
    license4 = db.relationship("Attachment", foreign_keys=[license4_id])
    license5 = db.relationship("Attachment", foreign_keys=[license5_id])
