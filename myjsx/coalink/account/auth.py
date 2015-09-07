# -*- coding: utf-8 -*-
import functools
from flask import g
from coalink.core.exceptions import UserError


class PermissionError(UserError):
    """
    权限错误
    """
    status_code = 10403


def _get_current_user():
    if hasattr('g', 'current_user'):
        return g.current_user
    else:
        return None


def _has_login():
    return _get_current_user()


def _has_permission(operation):
    user = _get_current_user()
    permissions = user.get_permissions()
    return operation in [permission.operation for permission in permissions]


def need_login():
    """
    需要登录
    :return:
    """

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if _has_login():
                return func(*args, **kwargs)
            else:
                raise PermissionError("用户未登录")

        return wrapper

    return decorator


def need_permission(operation):
    """
    需要权限
    :param operation: 操作
    :return:
    """

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if _has_permission(operation):
                return func(*args, **kwargs)
            else:
                raise PermissionError("用户没有该权限")

        return wrapper

    return decorator
