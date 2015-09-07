# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime
from coalink import db


class Attachment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.String(512))
    key = db.Column(db.String(256))
    name = db.Column(db.String(32))
    mimetype = db.Column(db.String(64))
    size = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now)
    date_expired = db.Column(db.DateTime, default=datetime.datetime.now)
    server = db.Column(db.String(32))

    def get_url(self):
        from . import storage
        return storage.sign_url(self.key)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'size': self.size,
            'mimetype': self.mimetype,
            'url': self.get_url()
        }
