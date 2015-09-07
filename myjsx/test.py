# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import uuid
from StringIO import StringIO
import os
import sys

reload(sys)
sys.setdefaultencoding('utf8')
import unittest
import manage
import base64
from flask import json
from flask.ext.login import make_secure_token
from coalink.core import message


class MailTest(unittest.TestCase):
    def setUp(self):
        manage.app.config['TESTING'] = True
        self.client = manage.app.test_client()
        self.app_context = manage.app.app_context()
        self.app_context.push()

    def test_send_mail(self):
        message.send_email(
            subject='激活账户',
            recipients=['th.synee@gmail.com'],
            template='email/account_active.html',
            context={
                "email": 'liang.shao@binqsoft.com',
                "code": base64.b64encode(os.urandom(32))
            }
        )

    def test_make_secure_token(self):
        print(make_secure_token("Hello"))

    def tearDown(self):
        self.app_context.pop()


class StorageActionTest(unittest.TestCase):
    def setUp(self):
        manage.app.config['TESTING'] = True
        self.client = manage.app.test_client()
        self.app_context = manage.app.app_context()
        self.app_context.push()

    def test_storage_upload(self):
        with open('./requirements/packages/OSS_Python_API_20150811.zip', 'rb') as f:
            fio = StringIO(f.read())
        response = self.client.post(
            "/api/storage/upload",
            content_type='multipart/form-data',
            data={
                'file': (fio, 'test.jpg')
            }, follow_redirects=True)
        print(response.data)
        assert json.loads(response.data)['success']

    def tearDown(self):
        self.app_context.pop()


# TODO: 账户接口测试
class AccountActionTest(unittest.TestCase):
    def setUp(self):
        manage.app.config['TESTING'] = True
        self.client = manage.app.test_client()
        self.app_context = manage.app.app_context()
        self.app_context.push()

    def test_generate_mobile_code(self):
        response = self.client.post("/api/account/generate_mobile_code", data=dict(
            mobile='18121138260'
        ))
        ret = json.loads(response.data)
        print(ret)
        assert ret['success']

    def test_generate_email_code(self):
        response = self.client.post("/api/account/generate_mobile_code", data=dict(
            mobile='18121138260'
        ))
        assert "success: true" in response.data

    def test_test(self):
        response = self.client.post("/api/account/test", data=dict(
            mobile='18121138260'
        ))
        ret = json.loads(response.data)
        assert ret['success']

    def test_register_customer(self):
        response = self.client.post("/api/account/register_customer", data=dict(
            email='liang.shao@binqsoft.com',
            name='王小二',
            mobile='18121138260',
            code=511513,
            password='password'
        ))
        ret = json.loads(response.data)
        assert ret['success']

    def test_register_by_mobile(self):
        response = self.client.post("/api/account/register_by_mobile", data=dict(
            mobile='18121138260',
            password="password",
            code="994735",
        ))
        print(response.data)
        assert "\"success\": true" in response.data

    def test_register_by_email(self):
        response = self.client.post("/api/account/register_by_email", data=dict(
            email='liang.shao@binqsoft.com',
            password="password"
        ))
        print(response.data)
        print(json.loads(response.data).get('message'))
        assert "\"success\": true" in response.data

    def test_active_email(self):
        response = self.client.get(
            "http://localhost:5000/api/account/active_email?email=liang.shao@binqsoft.com%20&code=2CmEsSyXsnJZ1BlkXKuoZ/8zAH3i+jAXXAjftClvCu0=")
        print(response.data)
        print(json.loads(response.data).get('message'))
        assert "\"success\": true" in response.data

    def test_login(self):
        response = self.client.post("/api/account/login", data=dict(
            username='18121138260',
            password="password"
        ))
        print(response.data)
        assert "\"success\": true" in response.data

    def test_info(self):
        response = self.client.post("/api/account/info?access_token=YTM1MzY4N2YxMzYyNDRmNjlmNDRiOTdmOGRjZjdlMmI=")
        print(response.data)
        assert "\"success\": true" in response.data

    def test_refresh_token(self):
        response = self.client.post(
            "/api/account/refresh_token?access_token=MGFjNDBjMmZkZDc4NGY5Mzk3Y2I5ODU5NDI1MWUwMzE=")
        print(response.data)
        assert "\"success\": true" in response.data

    def test_repassword_by_mobile(self):
        response = self.client.post('/api/account/repassword_by_mobile', data=dict(
            mobile='18121138260',
            password='password',
            code='769929'
        ))
        print(response.data)
        assert "\"success\": true" in response.data

    def tearDown(self):
        self.app_context.pop()


if __name__ == '__main__':
    unittest.main()
