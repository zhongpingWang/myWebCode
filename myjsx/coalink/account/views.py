# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime
from flask import flash, session
from coalink import db
from coalink.core.web import ActionResource, ActionView, templated
from .models import DyCode, User, Company


class AccountActionView(ActionView):
    @templated(template='account/reset_password.html')
    def reset_password(self):
        if self.is_post():
            email = self.get_data('email', )
            code = DyCode.generate_code(email=email)
            code.send(template='email/reset_password.html')
            flash("邮件已发送,请查收")
            return self.render(template='single/notification.html')
        else:
            email = self.get_param('email')
            code = self.get_param('code')
            if email and code:
                user = db.session.query(User).filter(
                    User.email == email
                ).first()
                if not user:
                    self.raise_error('账户不存在')
                return self.render(template='account/reset_password_form.html', email=email, code=code)

    @templated(template='account/reset_password_confirm.html')
    def reset_password_confirm(self):
        email = self.get_data('email', )
        code = self.get_data('code', )
        password = self.get_data('password', )
        user = db.session.query(User).filter(
            User.email == email
        ).first()
        if not user:
            raise self.raise_error('账户不存在')
        if DyCode.valid(email=email, code=code):
            user.set_password(password)
            user.date_updated = datetime.datetime.now()
            db.session.commit()
            flash("修改密码成功")
        else:
            self.raise_error("验证码不正确")

    @templated(template='account/active_email.html')
    def active_email(self):
        email = self.get_param('email', )
        code = self.get_param('code', )

        user = db.session.query(User).filter(
            User.email == email
        ).first()
        if not user:
            return flash("账户不存在")

        if not DyCode.valid(email=email, code=code):
            return flash("验证码不正确")
        user.active = True
        user.date_updated = datetime.datetime.now()
        db.session.commit()
        flash('邮箱激活成功')


class AccountActionResource(ActionResource):
    def generate_mobile_code(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/generate_mobile_code 生成手机验证码
        @apiGroup Account
        @apiParam {String} mobile 手机号
        @apiSuccess {Boolean} success 请求是否成功
        @apiSuccess {String} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: null
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "手机号被注册"}
        """
        mobile = self.get_data('mobile', )
        code = DyCode.generate_code(mobile=mobile)
        code.send()
        return self.done()

    def generate_email_code(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/generate_email_code 生成邮箱验证码
        @apiGroup Account
        @apiParam {String} email 邮箱
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: null
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "手机号被注册"}
        """
        email = self.get_data('email', )
        code = DyCode.generate_code(email=email)
        code.send()
        return self.done()

    # TODO: 测试账号是否存在
    def test(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/test 检测账户
        @apiGroup Account
        @apiParam {String} mobile 手机号
        @apiParam {String} email 密码
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: true
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        """
        email = self.get_data('email', require=False, label='邮箱')
        mobile = self.get_data('mobile', require=False, label='手机号')
        exist = None
        if email:
            exist = db.session.query(db.exists().where(User.email == email, )).scalar()
        if mobile:
            exist = db.session.query(db.exists().where(User.mobile == mobile, )).scalar()
        return self.done(exist)

    def test_business(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/test 检测公司名称
        @apiGroup Account
        @apiParam {String} name 公司名称
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: true
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        """
        name = self.get_data('name', label='名称')
        exist = db.session.query(db.exists().where(Company.name == name)).scalar()
        return self.done(exist)

    # TODO: 企业注册
    def register_business(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/register_business 注册企业
        @apiGroup Account
        @apiParam {String} company_name 公司名称
        @apiParam {String} first_name 名
        @apiParam {String} last_name 姓
        @apiParam {String} email 邮箱
        @apiParam {String} name 名称
        @apiParam {String} mobile 手机号
        @apiParam {String} code 手机验证码(通过生成手机验证码接口获取)
        @apiParam {String} password 密码
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: {
                                    'id': 10086,
                                    'username': '中国移不动',
                                    'nickname': '中国移不动',
                                    'access_token': 'JBibiub213ibniNh89921KMkkka='
                                }
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "手机号被注册"}
        """
        company_name = self.get_data('company_name', label='公司名称')
        company = db.session.query(Company).filter(Company.name == company_name).first()
        if company:
            self.raise_error("公司名称被注册: {0}".format(company_name))

        ret = self.register_customer()
        email = self.get_data('email', label='邮箱')
        user = db.session.query(User).filter(
            User.email == email
        ).first()
        if not user:
            self.raise_error("账户未被创建: {0}".format(email))

        company = Company()
        company.name = company_name
        company.admin_id = user.id
        db.session.add(company)
        db.session.commit()

        user.company_id = company.id
        db.session.commit()

        return ret

    # TODO: 申请认证
    def apply_certify(self):
        current_user = self.get_current_user()
        company = current_user.company
        if not company:
            self.raise_error("没有需要认证的公司")
        company.license1_id = self.get_data('license1_id', require=False, label='证件1')
        company.license2_id = self.get_data('license2_id', require=False, label='证件2')
        company.license3_id = self.get_data('license3_id', require=False, label='证件3')
        company.license4_id = self.get_data('license4_id', require=False, label='证件4')
        company.license5_id = self.get_data('license5_id', require=False, label='证件5')
        company.status = 1
        db.session.commit()
        self.done()

    def register_customer(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/register_customer 注册用户
        @apiGroup Account
        @apiParam {String} first_name 名
        @apiParam {String} last_name 姓
        @apiParam {String} email 邮箱
        @apiParam {String} name 名称
        @apiParam {String} mobile 手机号
        @apiParam {String} code 手机验证码(通过生成手机验证码接口获取)
        @apiParam {String} password 密码
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: {
                                    'id': 10086,
                                    'username': '中国移不动',
                                    'nickname': '中国移不动',
                                    'access_token': 'JBibiub213ibniNh89921KMkkka='
                                }
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "手机号被注册"}
        """
        first_name = self.get_data('first_name', label='名称')
        last_name = self.get_data('last_name', label='名称')

        email = self.get_data('email', label='邮箱')
        mobile = self.get_data('mobile', label='手机号')
        code = self.get_data('code', label='手机动态码')
        password = self.get_data('password', label='密码')
        user = db.session.query(User).filter(
            db.or_(
                User.mobile == mobile,
                User.email == email
            )
        ).first()

        if user:
            self.raise_error('邮箱或手机号被注册')

        if not DyCode.valid(mobile=mobile, code=code):
            self.raise_error('验证码不正确')

        user = User()
        user.first_name = first_name
        user.last_name = last_name

        user.email = email
        user.mobile = mobile
        user.username = email
        user.set_password(password)

        user.active = True

        db.session.add(user)
        db.session.commit()

        access_token = user.generate_access_token()
        ret = {
            'id': user.id,
            'email': user.email,
            'name': user.nickname,
            'access_token': access_token.token
        }
        session['access_token'] = access_token.token
        return self.done(ret)

    def login(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/login 登录
        @apiGroup Account
        @apiParam {String} username 邮箱/手机号
        @apiParam {String} password 密码
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: {
                                    'id': 10086,
                                    'username': '中国移不动',
                                    'nickname': '中国移不动',
                                    'access_token': 'JBibiub213ibniNh89921KMkkka='
                                }
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "账户不存在"}
        """
        username = self.get_data('username', label='邮箱 / 手机号')
        password = self.get_data('password', label='手机号')
        user = db.session.query(User).filter(
            db.or_(
                User.email == username,
                User.mobile == username
            )
        ).first()
        if not user:
            self.raise_error("账户不存在")
        if not user.active:
            self.raise_error("账户未激活")
        if not user.is_password(password):
            self.raise_error("密码不正确")
        if user.status == 0:
            self.raise_error("账户被禁用")
        access_token = user.generate_access_token()
        ret = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'nickname': user.nickname or ("{0}{1}".format(user.last_name, user.first_name)),
            'access_token': access_token.token
        }
        session['access_token'] = access_token.token
        return self.done(ret)

    def logout(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/logout 登出
        @apiGroup Account
        """
        session.pop('access_token', None)
        return self.done()

    def refresh_token(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/refresh_token 刷新凭证
        @apiGroup Account
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {
                                success: true,
                                data: {
                                    'id': 10086,
                                    'access_token': 'JBibiub213ibniNh89921KMkkka='
                                }
                           }
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "账户不存在"}
        """
        current_user = self.get_current_account()
        access_token = current_user.generate_access_token()
        session['access_token'] = access_token.token
        return self.done({'id': current_user.id, 'access_token': access_token.token})

    def repassword_by_mobile(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/repassword_by_mobile 通过手机号重置密码
        @apiGroup Account
        @apiParam {String} mobile 手机号
        @apiParam {String} code 手机验证码(通过生成手机验证码接口获取)
        @apiParam {String} password 密码
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {success: true, data: null}
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "账户不存在"}
        """
        mobile = self.get_data('mobile', label='手机号')
        code = self.get_data('code', label='验证码')
        password = self.get_data('password', label='密码')
        account = db.session.query(User).filter(
            User.mobile == mobile
        ).first()
        if not account:
            self.raise_error("账户不存在")
        if not DyCode.valid(mobile=mobile, code=code):
            self.raise_error("手机验证码不正确")

        account.set_password(password)
        account.date_updated = datetime.datetime.now()
        db.session.commit()
        return self.done()

    # TODO: 通过邮箱重置密码 ? TEST
    def repassword_by_email(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/repassword_by_email 通过邮箱重置密码
        @apiGroup Account
        @apiParam {Email} email 邮箱
        @apiParam {String} code 邮箱验证码
        @apiParam {Password} password 密码
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {success: true, data: null}
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "账户不存在"}
        """
        email = self.get_data('email', label='邮箱')
        code = self.get_data('code', label='验证码')
        password = self.get_data('password', label='密码')
        account = db.session.query(User).filter(
            User.email == email
        ).first()
        if not account:
            self.raise_error("账户不存在")
        if not DyCode.valid(email=email, code=code):
            self.raise_error("邮箱验证码不正确")

        account.set_password(password)
        account.date_updated = datetime.datetime.now()
        db.session.commit()
        return self.done()

    # TODO: 补充session信息
    def fetch_session(self):
        """
        @apiVersion 0.0.1
        @api {post} /api/account/fetch_session 获取session数据
        @apiGroup Account
        @apiSuccess {boolean} success 请求是否成功
        @apiSuccess {string} data 请求成功数据
        @apiSuccessExample {json} Success-Response
                           {success: true, data: null}
        @apiError {boolean} success 请求是否成功
        @apiError {string} message 请求错误信息
        @apiErrorExample {json} Error-Response
                         {"success": false, "message": "账户不存在"}
        """
        ret = {}
        user = self.current_user
        if user:
            ret['user'] = user.to_dict()
            ret['account'] = user.to_dict()
        return self.done(ret)
