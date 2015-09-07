# -*- coding: utf-8 -*-
from coalink import db


# TODO: 产品类型
class ProductCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True)


# TODO: 产品定义
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80))
    category_id = db.Column(db.Integer, db.ForeignKey('product_category.id'), backref='products')


# TODO: 产品属性组
class ProductPropertyGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True)


# TODO: 产品属性
class ProductProperty(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80))
    group_id = db.Column(db.Integer, db.ForeignKey('product_property_group.id'))
    __table_args__ = (
        db.UniqueConstraint("name", "group_id"),
    )


# TODO: 产品属性值
class ProductPropertyValue(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship("Product", backref='properties')
    property_id = db.Column(db.Integer, db.ForeignKey('product_property_group.id'))
    value_number = db.Column(db.Float, nullable=True)
    value_string = db.Column(db.String(128), nullable=True)
    value_boolean = db.Column(db.Boolean, nullable=True)
    value_datetime = db.Column(db.DateTime, nullable=True)
    __table_args__ = (
        db.UniqueConstraint("product_id", "property_id"),
    )
