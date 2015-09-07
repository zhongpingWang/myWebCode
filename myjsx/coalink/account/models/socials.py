# -*- coding: utf-8 -*-
import datetime
from coalink import db


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 发送者
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    sender = db.relationship("User", backref='sent_messages', foreign_keys=[sender_id])

    # 接收者
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver = db.relationship("User", backref='got_messages', foreign_keys=[receiver_id])

    # 中间人
    middle_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    middle = db.relationship("User", backref='relation_messages', foreign_keys=[middle_id])

    # 关联对象
    target_table = db.Column(db.String(32), index=True)
    target_id = db.Column(db.Integer, index=True)

    # 回复消息
    parent_id = db.Column(db.Integer, db.ForeignKey('user_message.id'))
    parent = db.relationship("UserMessage", backref="children", remote_side=[id], foreign_keys=[parent_id])

    # 帖子类型
    post_type = db.Column(db.String(32), index=True)
    # 帖子内容
    post_content = db.Column(db.String(1024))

    # 状态: -1: 删除, 0: 草稿, 1: 发布, 2: 已阅读
    status = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now)


class Follow(db.Model):
    pass
