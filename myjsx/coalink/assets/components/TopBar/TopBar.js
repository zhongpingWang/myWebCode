import React from 'react'
import mui from '../flat-ui'

import SessionActions from '../../actions/SessionActions'
import SessionStore from '../../stores/SessionStore'
import {LoginDialog, RegisterDialog} from '../Authentication'


let TopBar = React.createClass({

    mixins: [mui.ThemeContextMixin],

    propTypes: {
    },

    getInitialState() {
        return SessionStore.getState();
    },
    getDefaultProps() {
        return {};
    },

    componentDidMount() {
        SessionStore.listen(this.handleSessionChange);
        SessionActions.fetch();
    },
    componentWillUnmount() {
        SessionStore.unlisten(this.handleSessionChange);
    },
    handleSessionChange(session) {
        //加载数据重新渲染 不需要弹出层
        this.setState(SessionStore.getState());
    },

    render() {
        return (
            <ul className="topBar">
                <li key="logo" className="logo left">Coalink</li>
                <li key="require" className="right myRelease pointer">发布我的需求</li>
                <li key="help" className="right colorWhite help mTop pointer">帮助<i className="arrorwDown"></i></li>

                {this.state.loggedIn &&
                <li key="logout" className="right colorWhite signIn pointer"
                    onTouchTap={this._handleLogoutTouchTap}>退出</li>}
                {this.state.loggedIn &&
                <li key="user" className="right colorWhite signIn pointer">{this.state.currentAccount.nickname}</li>}

                {!this.state.loggedIn &&
                <li key="login" className="right colorWhite signIn pointer"
                    onTouchTap={()=>{this._handleDialogOpen('loginDialog')}}>登录</li>}
                {!this.state.loggedIn &&
                <li key="register" className="right colorWhite mTop register pointer"
                    onTouchTap={()=>{this._handleDialogOpen('registerDialog')}}>注册</li>}

                <LoginDialog ref="loginDialog" />
                <RegisterDialog ref="registerDialog" />
            </ul>
        )
    },
    _handleDialogOpen(dialog){
        this.refs[dialog].show();
    },
    _handleLogoutTouchTap(){
        SessionActions.logout();
    },
});

export default TopBar;
