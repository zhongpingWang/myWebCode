import React from 'react'
import RegisterForm from './RegisterForm'
import {Dialog, Styles} from '../flat-ui'

let RegisterDialog = React.createClass({

    componentDidMount() {
    },
    componentDidUpdate() {
    },

    show() {
        this.refs.dialog.show();
    },

    render () {
        let {
            ...other
            } = this.props;
        return (
            <Dialog {...other} ref='dialog' contentStyle={{width: 480}}>
                <RegisterForm {...other} onSuccess={()=>{this.refs.dialog.dismiss()}} />
            </Dialog>
        )
    }
});

export default RegisterDialog;
