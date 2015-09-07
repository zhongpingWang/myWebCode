# -*- coding: utf-8 -*-
from __future__ import unicode_literals


class WebException(Exception):
    status_code = 400


class UserError(WebException):
    """
    用户操作错误
    """
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        """
        :param message: 错误消息
        :param status_code: 错误代号
        :param payload: 错误数据
        :return:
        """
        Exception.__init__(self)
        self.message = message
        self.status_code = status_code or self.status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['success'] = False
        rv['message'] = self.message
        rv['code'] = self.status_code
        return rv


class ResourceUserError(UserError):
    """
    用户操作接口错误
    """
    status_code = 10400


class ViewUserError(UserError):
    """
    用户操作视图错误
    """
    status_code = 400
