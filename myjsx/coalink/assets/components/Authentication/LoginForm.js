import React from 'react'
import SessionActions from '../../actions/SessionActions'
import TextField from '../flat-ui/text-field'

var LoginForm = React.createClass({

    getInitialState() {
        return {}
    },
    componentDidMount() {
        this.refs.username.setErrorText("Test Error Text")
    },
    onConfirm(e) {
        var self = this;
        SessionActions.login(this.state).then((account)=>{
            self.props.onSuccess(account);
        }).catch((error)=>{
            self.props.onError(account);
        });
        e.preventDefault();
    },
    render () {
        return;
    }
});
export default LoginForm ;
