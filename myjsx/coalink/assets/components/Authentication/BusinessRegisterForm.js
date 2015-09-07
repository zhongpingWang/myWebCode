import React from 'react'
import $ from 'jquery'
import {Tabs, Tab, Styles, TextField, FileField, RaisedButton, Checkbox, Image} from '../flat-ui'

let BusinessRegisterForm = React.createClass({
    getInitialState() {
        return {
            step: 2,
            has_argument: false,
            disableNext: true,
            btnDyCodeText: '发送验证码',
            disabledNextStep: true
        };
    },
    valueLink(field) {
        let self = this;
        return {
            value: this.state[field],
            requestChange: (value) => {
                var v = {};
                v[field] = value;
                self.setState(v);
            }
        }
    },
    companyNameLink(field) {
        let self = this;
        var interval;
        return {
            value: this.state[field],
            requestChange: (value) => {
                var v = {};
                v[field] = value;
                self.setState(v);
                if (interval) {
                    clearInterval(interval);
                }
                interval = setTimeout(()=> {
                    $.post("/api/account/test_business", {name: self.state[field]}).done((resp)=> {
                        console.log(resp);
                    })
                }, 500);
            }
        }
    },
    handleArgumentCheck(event, value) {
        this.setState({has_argument: value});
    },

    setStep(index) {
        let self = this;
        return () => {
            self.setState({step: index})
        }
    },

    submit() {
        console.log(this.refs);
    },

    renderStep1() {
        return (
            <form rol='form' className='form'>
                <TextField ref='companyName'
                           valueLink={this.companyNameLink('name')}
                           style={{width: '100%'}}
                           hintText="公司名称"/>

                <TextField valueLink={this.valueLink('lastName')}
                           style={{width: '45%'}}
                           hintText="姓"
                           ref="txtLastName"/>

                <TextField valueLink={this.valueLink('firstName')}
                           style={{width: '45%', float: 'right'}}
                           hintText="名"
                           ref="txtFirstName"/>

                <TextField valueLink={this.valueLink('email')}
                           style={{width: '100%'}}
                           hintText="电子邮箱"
                           ref='txtEmail'/>

                <TextField valueLink={this.valueLink('password')}
                           type='password'
                           style={{width: '100%'}}
                           hintText="输入密码"/>
                <TextField valueLink={this.valueLink('repassword')}
                           type='password'
                           style={{width: '100%'}}
                           hintText="确认密码"/>
                <TextField valueLink={this.valueLink('mobile')}
                           style={{width: '100%'}}
                           hintText="手机号码"
                           ref='txtMoble'/>

                <TextField valueLink={this.valueLink('code')}
                           style={{width: '45%', marginRight:'10%'}}
                           hintText="动态码"
                           ref='txtDyCode'/>

                <RaisedButton name="btnDyCode"
                              secondary={true}
                              colorType='primary'
                              style={{width: '45%', marginLeft: 0, marginRight: 0, float: 'right'}}
                              disabled={this.state.disableSendDyCode}
                              label={this.state.btnDyCodeText} onClick={this.getDyCode}/>
                <Checkbox name="arguments"
                          onCheck={this.handleArgumentCheck}
                          label="已阅读并赞同该协议"
                          defaultChecked={this.state.has_argument}/>

                <p className="text-right">
                    <button className='btn btn-link'
                            disabled={this.state.disabledNextStep}
                            onClick={this.setStep(2)}>下一步
                    </button>
                </p>

                <div style={{color: "#353535", backgroundColor: "#cccccc", margin: "0 -25px -25px -25px", padding: 25}}>
                    <p>注册前您需要准备（复印件加盖公章）</p>
                    <ul>
                        <li>1.企业法人营业执照</li>
                        <li>2.组织机构代码证</li>
                        <li>3.法定代表人的身份证</li>
                    </ul>
                </div>
            </form>
        )
    },

    renderStep2() {
        return (
            <form>
                <h5>企业法人营业执照及组织机构代码证（复印件加盖公章）</h5>
                <hr/>
                <div style={{width: "50%", float: "left"}}>
                    <h6>企业法人营业执照</h6>

                    <div>
                        {
                            this.state.licence1
                                ?
                                <Image style={{width: 166, height: 150}} size='contain' src={this.state.licence1.url}/>
                                : undefined
                        }
                    </div>
                    <FileField ref='licence1'
                               accept="image/*"
                               onUploaded={(comp, attach)=>{this.setState({licence1: attach})}}/>
                </div>
                <div style={{width: "50%", float: "left"}}>
                    <h6>组织机构代码证</h6>

                    <div>
                        {
                            this.state.licence2
                                ?
                                <Image style={{width: 166, height: 150}} size='contain' src={this.state.licence2.url}/>
                                : undefined
                        }
                    </div>
                    <FileField ref='licence2'
                               accept="image/*"
                               onUploaded={(comp, attach)=>{this.setState({licence2: attach})}}/>
                </div>
                <br/>
                <br/>
                <h5 style={{clear: "both"}}>法定代表人的身份证（复印件加盖公章）</h5>
                <hr/>
                <div style={{width: "50%", float: "left"}}>
                    <h6>正面</h6>

                    <div>
                        {
                            this.state.licence3
                                ?
                                <Image style={{width: 166, height: 150}} size='contain' src={this.state.licence3.url}/>
                                : undefined
                        }
                    </div>
                    <FileField ref='licence3'
                               accept="image/*"
                               onUploaded={(comp, attach)=>{this.setState({licence3: attach})}}/>
                </div>
                <div style={{width: "50%", float: "left"}}>
                    <h6>背面</h6>

                    <div>
                        {
                            this.state.licence4
                                ?
                                <Image style={{width: 166, height: 150}} size='contain' src={this.state.licence4.url}/>
                                : undefined
                        }
                    </div>
                    <FileField ref='licence4'
                               accept="image/*"
                               onUploaded={(comp, attach)=>{this.setState({licence4: attach})}}/>
                </div>
                <RaisedButton colorType='primary'
                              sizeType='4'
                              style={{width: '45%',}}
                              onClick={this.submit}
                              label="完成注册"/>
                <br/>
                <button className="btn btn-link" onClick={this.setStep(1)}>上一步</button>
            </form>
        )
    },

    render() {
        return this['renderStep' + this.state.step]()
    }
});
export default BusinessRegisterForm;
