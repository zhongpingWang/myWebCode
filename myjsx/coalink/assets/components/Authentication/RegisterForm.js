import React from 'react'
import $ from 'jquery'
import {Tabs, Tab, Styles, TextField, RaisedButton} from '../flat-ui'
import BusinessRegisterForm from './BusinessRegisterForm'
let ThemeManager = new Styles.ThemeManager();

var RegisterForm = React.createClass({

    getInitialState(){

        return {
            btnDyCodeText: "动态获取验证码",
            disableSendDyCode: false,
            disableRegister: false
        }
    },

    //获取动态验证码
    getDyCode(e){

        var mobile = this.refs.txtMoble.getValue();

        var regMobile = /1[0-9]{10}/;

        var self = this;
        //验证手机号码
        if (regMobile.test(mobile)) {

            $.ajax({
                url: "/api/account/generate_mobile_code",
                type: "POST",
                data: {
                    mobile: mobile
                }
            }).done(function (data) {

                if (data.success) {
                    self.verificationCountdown(60);
                    self.setState({
                        disableSendDyCode: true
                    });
                } else {
                    alert(data.message);
                }

            });


        } else {
            alert("手机号码有误");
        }

    },
    //获取验证码倒计时
    verificationCountdown(time){
        var timer, self = this;
        if (time > 0) {
            self.setState({
                btnDyCodeText: "重新发送(" + time + ")"
            });
            time--;
            timer = setTimeout(function () {
                clearTimeout(timer);
                self.verificationCountdown(time)
            }, 1000);

        } else {
            clearTimeout(timer);
            self.setState({
                disableSendDyCode: false,
                btnDyCodeText: "动态获取验证码"
            });
        }

    },

    //注册
    register(){

        var refs = this.refs,
            txtEmail = refs.txtEmail.getValue(),
            txtFirstName = refs.txtFirstName.getValue(),
            txtLastName = refs.txtLastName.getValue(),
            txtMoble = refs.txtMoble.getValue(),
            txtPwd = refs.txtPwd.getValue(),
            txtRePwd = refs.txtRePwd.getValue(),
            txtDyCode = refs.txtDyCode.getValue(), self = this;

        var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regEmail.test(txtEmail)) {
            alert("电子邮件不正确");
            return;
        }

        if (txtFirstName.length <= 0) {
            alert("请输入名");
            return;
        }

        if (txtLastName.length <= 0) {
            alert("请输入姓");
            return;
        }

        if (txtPwd.length <= 0) {
            alert("请输入密码");
            return;
        }

        if (txtPwd != txtRePwd) {
            alert("两次输入的密码不一致");
            return;
        }

        $.ajax({
            url: "/api/account/register_customer",
            type: "POST",
            data: {
                email: txtEmail,
                first_name: txtFirstName,
                last_name: txtLastName,
                mobile: txtMoble,
                code: txtDyCode,
                password: txtRePwd
            }
        }).done((data)=> {

            if (data.success) {
                this.props.onSuccess();
                self.setState({disableRegister: false});
            } else {
                alert(data.message);
                self.setState({disableRegister: false});
            }

        });

        this.setState({disableRegister: true});

    },

    render () {
        return (
            <Tabs>
                <Tab label='个人注册'>
                    <form rol='form' className='form'>
                        <TextField name='email'
                                   style={{width: '100%'}}
                                   hintText="电子邮件地址"
                                   ref='txtEmail'/>

                        <TextField name='last_name'
                                   style={{width: '45%'}}
                                   hintText="姓氏"
                                   ref="txtLastName"/>

                        <TextField name='first_name'
                                   style={{width: '45%', float: 'right'}}
                                   hintText="名字"
                                   ref="txtFirstName"/>

                        <TextField name='password'
                                   type='password'
                                   ref='txtPwd'
                                   style={{width: '100%'}}
                                   hintText="密码"/>
                        <TextField name='password'
                                   type='password'
                                   ref='txtRePwd'
                                   style={{width: '100%'}}
                                   hintText="确认密码"/>

                        <TextField name='mobile'
                                   style={{width: '100%'}}
                                   hintText="手机号码"
                                   ref='txtMoble'/>

                        <TextField name='dyCode'
                                   style={{width: '45%', marginRight:'10%'}}
                                   hintText="动态码"
                                   ref='txtDyCode'/>

                        <RaisedButton name="btnDyCode"
                                      secondary={true}
                                      colorType='primary'
                                      style={{width: '45%', marginLeft: 0, marginRight: 0, float: 'right'}}
                                      disabled={this.state.disableSendDyCode}
                                      label={this.state.btnDyCodeText} onClick={this.getDyCode}/>

                        <RaisedButton name="btnRegister"
                                      secondary={true}
                                      style={{width: '100%', marginLeft: 0}}
                                      disabled={this.state.disableRegister}
                                      label="注  册" onClick={this.register}/>
                    </form>
                </Tab>
                <Tab label='企业注册'>
                    <BusinessRegisterForm/>
                </Tab>
            </Tabs>
        )
    }
});

export default RegisterForm;
