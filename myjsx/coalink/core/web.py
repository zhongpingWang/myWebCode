# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from functools import wraps
from flask import g, json, render_template, Response, request
from flask.ext.restful import Resource, abort
from flask.views import MethodView
from coalink.core.exceptions import ResourceUserError, ViewUserError


def templated(template=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            template_name = template
            if template_name is None:
                template_name = request.endpoint.replace('.', '/') + '.html'
            ctx = f(*args, **kwargs)
            if ctx is None:
                ctx = {}
            elif not isinstance(ctx, dict):
                return ctx
            return render_template(template_name, **ctx)

        return decorated_function

    return decorator


class ViewMixin(object):
    _data = None
    _form = None
    _json = None
    _args = None

    def raise_error(self, *args, **kwargs):
        raise NotImplementedError

    def _get_typed_data(self, data, data_type):
        try:
            data_type(data)
        except ValueError as err:
            self.raise_error("请求参数类型不正确")

    def get_param(self, name, default=None, require=True, data_type=None, label=None):
        if not self._args:
            self._args = request.args
        ret = self._args.get(name) or default
        if require and not ret:
            self.raise_error("缺少参数: %s" % (label or name))
        return ret if not data_type else self._get_typed_data(ret, data_type)

    def get_data(self, name, default=None, require=True, data_type=None, label=None):
        """
        :param name: 参数名称
        :param default: 默认值
        :param require: 是否必须
        :param data_type:
        :param label:
        :return:
        """
        ret = None
        if not ret and isinstance(self._json, dict):
            ret = self._json.get(name)
        if not ret and isinstance(self._data, dict):
            ret = self._data.get(name)
        if not ret:
            ret = self._form.get(name)
        if not ret:
            ret = default
        if require and not ret:
            self.raise_error("缺少参数: %s" % (label or name))
        return self._get_typed_data(ret, data_type) if (ret and data_type) else ret

    def page_pair(self):
        page = self.get_param('page', 1, int)
        size = self.get_param('page_size', 50, int)
        offset = (page - 1) * size
        return offset, min(size, 50)

    @property
    def current_account(self):
        return getattr(g, "current_account", None)

    def get_current_account(self, nullable=False):
        current_account = self.current_account
        if not nullable and not current_account:
            self.raise_error("用户未登录", status_code=10401)
        return current_account

    @property
    def current_user(self):
        return getattr(g, "current_user", None)

    def get_current_user(self, nullable=False):
        current_user = self.current_user
        if not nullable and not current_user:
            self.raise_error("用户未登录", status_code=10401)
        return current_user

    def render(self, template, **context):
        html = render_template(template, **context)
        resp = Response()
        resp.data = html
        return resp


class ActionView(MethodView, ViewMixin):
    methods = ['GET', 'POST']

    def raise_error(self, *args, **kwargs):
        raise ViewUserError(*args, **kwargs)

    def is_get(self):
        return request.method == 'GET'

    def is_post(self):
        return request.method == 'POST'

    def dispatch_action(self, action):
        if not hasattr(self, action):
            abort(404)
        return getattr(self, action)()

    def dispatch_request(self, *args, **kwargs):
        try:
            self._data = json.loads(request.data)
        except ValueError as err:
            self._data = None
        self._form = request.form
        self._json = request.json
        self._args = request.args
        return super(ActionView, self).dispatch_request(*args, **kwargs)

    @templated()
    def get(self, action=None):
        return self.dispatch_action(action)

    @templated()
    def post(self, action=None):
        return self.dispatch_action(action)


class AbstractResource(Resource, ViewMixin):
    def raise_error(self, *args, **kwargs):
        raise ResourceUserError(*args, **kwargs)

    def dispatch_request(self, *args, **kwargs):
        try:
            self._data = json.loads(request.data)
        except ValueError as err:
            self._data = None
        self._form = request.form
        self._json = request.json
        self._args = request.args
        return super(AbstractResource, self).dispatch_request(*args, **kwargs)

    def done(self, data=None):
        return {"success": True, "data": data}

    def fail(self, message, code=400):
        return {
            "success": False,
            "error_message": message,
            "code": code
        }


class RestResource(AbstractResource):
    model_class = None

    def get(self, model_id=None):
        return self.get_item(model_id) if model_id else self.get_list()

    def get_item(self, model_id):
        raise NotImplementedError

    def get_list(self):
        raise NotImplementedError


class ActionResource(AbstractResource):
    def post(self, action=None):
        from coalink.account.auth import PermissionError
        if not hasattr(self, action):
            self.raise_error("该接口不存在")
        try:
            return getattr(self, action)()
        except PermissionError as err:
            self.raise_error(err.message, status_code=err.status_code)
