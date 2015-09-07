# -*- coding: utf-8 -*-
from coalink import db


# TODO: 订单
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))



# TODO: 合同定义
class Contract(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
