import React from 'react'

/*
 * 在React Root组件中用于从props中获得theme变量，并保存在context以提供给子组件使用。
 * 在非Root组件中，需要使用muiTheme context时不需要使用该mixin，而应该添加：
 * contextTypes: {
 *     muiTheme: React.PropTypes.object,
 * }
 */
module.exports = {
    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired
    },
    getChildContext() {
        return {
            muiTheme: this.props.muiTheme
        };
    }
};
