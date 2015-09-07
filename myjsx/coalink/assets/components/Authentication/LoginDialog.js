import React from 'react'
import LoginForm from './LoginForm'
import {Dialog, RaisedButton, TextField} from '../flat-ui'

let LoginDialog = React.createClass({
    getInitialState() {
        return {}
    },

    componentDidMount() {
    },

    componentDidUpdate() {
    },

    show() {
        this.refs.dialog.show();
    },

    onConfirm() {
    },
    linkValue (field) {
        var self = this;
        return {
            value: this.state[field],
            requestChange: function (value) {
                var data = {};
                data[field] = value;
                self.setState(data);
            }
        }
    },
    render () {
        let {
            ...other
            } = this.props;
        return (
            <Dialog {...other} ref='dialog' contentStyle={{width: 320}}>
                <form rol='form' className='form'>
                    <TextField name='username'
                               valueLink={this.linkValue('username')}
                               ref='username'
                               style={{width: '100%'}}
                               hintText="电子邮件地址或手机号" />
                    <TextField name='password'
                               valueLink={this.linkValue('password')}
                               ref='password'
                               type="password"
                               style={{width: '100%'}}
                               hintText="密码"/>
                    <br/>
                    <button className='btn btn-primary btn-block' onClick={this.onConfirm}>登录</button>
                </form>
            </Dialog>
        )
    }
});

export default LoginDialog;
