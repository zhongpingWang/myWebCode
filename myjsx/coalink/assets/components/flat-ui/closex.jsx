/*
 * 对话框或窗口的关闭图标。
 */

import React from 'react'
import StylePropable from './mixins/style-propable'
import FontIcon from './font-icon'
import {Box, Colors} from './styles'

let CloseX = React.createClass({

    mixins: [StylePropable],

    contextTypes: {
        muiTheme: React.PropTypes.object,
    },

    propTypes: {
    },

    getInitialState() {
        return {
            hovered: false,
        };
    },

    render() {
        let {
            style,
            ...other
            } = this.props;

        let spacing = this.context.muiTheme.spacing;
        let mergedStyles = this.mergeAndPrefix({
            position: 'absolute',
            width: spacing.desktopGutterMore + 'px',
            height: spacing.desktopGutterMore + 'px',
            top: '-' + spacing.desktopGutterLess + 'px',
            right: '-' + spacing.desktopGutterLess + 'px',
            lineHeight: spacing.desktopGutterMore + 'px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: Box.radiusCircle,
            border: Box.borderNormal,
        }, style, {
            background: this.state.hovered ? Colors.partialColor2 : Colors.white,
        });

        return (
            <div {...other} style={mergedStyles}
                            onMouseLeave={this._handleMouseLeave}
                            onMouseEnter={this._handleMouseEnter}>
                <FontIcon className={'fa fa-remove fa-lg'} />
            </div>
        );
    },
    _handleMouseLeave(e) {
        this.setState({hovered: false});
    },

    _handleMouseEnter(e) {
        this.setState({hovered: true});
    },
});

export default CloseX
