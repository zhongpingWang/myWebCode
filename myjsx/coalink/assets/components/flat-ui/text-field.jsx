import React from 'react/addons'
import ColorManipulator from './utils/color-manipulator'
import StylePropable from './mixins/style-propable'
import Transitions from './styles/transitions'
import UniqueId from './utils/unique-id'
import EnhancedTextarea from './enhanced-textarea'
import Box from './styles/boxes'
import Fonts from './styles/fonts'

/**
 * Check if a value is valid to be displayed inside an input.
 *
 * @param value The value to check.
 * @returns True if the string provided is valid, false otherwise.
 */
function isValid(value) {
    return value || value === 0;
}

let TextField = React.createClass({

    mixins: [StylePropable],

    contextTypes: {
        muiTheme: React.PropTypes.object,
    },

    propTypes: {
        errorStyle: React.PropTypes.object,
        errorText: React.PropTypes.string,
        floatingLabelStyle: React.PropTypes.object,
        floatingLabelText: React.PropTypes.string,
        fullWidth: React.PropTypes.bool,
        hintText: React.PropTypes.string,
        id: React.PropTypes.string,
        inputStyle: React.PropTypes.object,
        multiLine: React.PropTypes.bool,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onEnterKeyDown: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        rows: React.PropTypes.number,
        type: React.PropTypes.string,
        sizeType: React.PropTypes.number,
        colorType: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            fullWidth: false,
            type: 'text',
            rows: 1,
            sizeType: 3,
            colorType: 'default',
        };
    },

    getInitialState() {
        let props = (this.props.children) ? this.props.children.props : this.props;

        return {
            errorText: this.props.errorText,
            hasValue: isValid(props.value) || isValid(props.defaultValue) ||
            (props.valueLink && isValid(props.valueLink.value)),
        };
    },

    getTheme() {
        return this.context.muiTheme.component.textField;
    },

    componentDidMount() {
        this._uniqueId = UniqueId.generate();
    },

    componentWillReceiveProps(nextProps) {
        let newState = {};

        newState.errorText = nextProps.errorText;
        if (nextProps.children && nextProps.children.props) {
            nextProps = nextProps.children.props;
        }

        let hasValueLinkProp = nextProps.hasOwnProperty('valueLink');
        let hasValueProp = nextProps.hasOwnProperty('value');
        let hasNewDefaultValue = nextProps.defaultValue !== this.props.defaultValue;

        if (hasValueLinkProp) {
            newState.hasValue = isValid(nextProps.valueLink.value);
        }
        else if (hasValueProp) {
            newState.hasValue = isValid(nextProps.value);
        }
        else if (hasNewDefaultValue) {
            newState.hasValue = isValid(nextProps.defaultValue);
        }

        if (newState) this.setState(newState);
    },

    _getSize() {
        return Box['Size' + this.props.sizeType];
    },

    _getFontSize() {
        return Fonts['SizeInput' + this.props.sizeType];
    },

    getBorderColor() {
        if (this.state.isFocused && this.state.hasValue) {
            return "#6699ff";
        } else if (this.state.hasValue) {
            return "#666666";
        } else {
            return "#cccccc";
        }
    },

    getStyles() {
        let props = this.props;
        let theme = this.getTheme();


        let styles = {
            root: {
                fontSize: 16,
                lineHeight: '24px',
                width: props.fullWidth ? '100%' : 256,
                height: (props.rows - 1) * 20 + (props.floatingLabelText ? this._getSize() + 40 : this._getSize()),
                display: 'inline-block',
                position: 'relative',
                transition: Transitions.easeOut('200ms', 'height'),
                borderRadius: 3
            },
            error: {
                position: 'relative',
                bottom: 0,
                padding: '0 10px',
                fontSize: 12,
                lineHeight: '12px',
                color: theme.errorColor,
                transition: Transitions.easeOut(),
            },
            hint: {
                padding: '0 10px',
                position: 'absolute',
                fontSize: this._getFontSize(),
                lineHeight: this._getFontSize() + 'px',
                opacity: 1,
                color: theme.hintColor,
                transition: Transitions.easeOut(),
                bottom: (this._getSize() - this._getFontSize()) / 2 + 'px',
                whiteSpace: "nowrap",
                overflowY: "auto",
                width: "100%",
                textOverflow: "ellipsis"
            },
            input: {
                tapHighlightColor: 'rgba(0,0,0,0)',
                padding: '0 10px',
                position: 'relative',
                width: '100%',
                height: '100%',
                border: 'solid 1px ' + this.getBorderColor(),
                outline: 'none',
                backgroundColor: theme.backgroundColor,
                color: props.disabled ? theme.disabledTextColor : theme.textColor,
                font: 'inherit',
                fontSize: this._getFontSize(),
                borderRadius: 3
            },
        };

        styles.error = this.mergeAndPrefix(styles.error, props.errorStyle);

        styles.floatingLabel = this.mergeStyles(styles.hint, {
            lineHeight: '22px',
            top: 38,
            bottom: 'none',
            opacity: 1,
            transform: 'scale(1) translate3d(0, 0, 0)',
            transformOrigin: 'left top',
        });

        styles.textarea = this.mergeStyles(styles.input, {
            marginTop: props.floatingLabelText ? 36 : 12,
            marginBottom: props.floatingLabelText ? -36 : -12,
            boxSizing: 'border-box',
            font: 'inherit',
        });

        if (this.state.isFocused) {
            styles.floatingLabel.color = theme.focusColor;
            styles.floatingLabel.transform = 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)';
        }

        if (this.state.hasValue) {
            styles.floatingLabel.color = ColorManipulator.fade(props.disabled ? theme.disabledTextColor : theme.floatingLabelColor, 0.5);
            styles.floatingLabel.transform = 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)';
            styles.hint.opacity = 0;
        }

        if (props.floatingLabelText) {
            styles.hint.opacity = 0;
            styles.input.boxSizing = 'border-box';
            if (this.state.isFocused && !this.state.hasValue) styles.hint.opacity = 1;
        }

        if (props.style && props.style.height) {
            styles.hint.lineHeight = props.style.height;
        }

        if (this.state.errorText && this.state.isFocused) styles.floatingLabel.color = styles.error.color;
        if (props.floatingLabelText && !props.multiLine) styles.input.paddingTop = 26;

        return styles;
    },

    render() {
        let {
            className,
            errorStyle,
            errorText,
            floatingLabelText,
            fullWidth,
            hintText,
            id,
            multiLine,
            onBlur,
            onChange,
            onFocus,
            type,
            rows,
            ...other,
            } = this.props;

        let styles = this.getStyles();

        let inputId = id || this._uniqueId;

        let errorTextElement = this.state.errorText ? (
            <div style={styles.error}>{this.state.errorText}</div>
        ) : null;

        let hintTextElement = hintText ? (
            <div style={this.mergeAndPrefix(styles.hint)}>{hintText}</div>
        ) : null;

        let floatingLabelTextElement = floatingLabelText ? (
            <label
                style={this.mergeAndPrefix(styles.floatingLabel, this.props.floatingLabelStyle)}
                htmlFor={inputId}>
                {floatingLabelText}
            </label>
        ) : null;

        let inputProps;
        let inputElement;

        inputProps = {
            id: inputId,
            ref: this._getRef(),
            style: this.mergeAndPrefix(styles.input, this.props.inputStyle),
            onBlur: this._handleInputBlur,
            onFocus: this._handleInputFocus,
            disabled: this.props.disabled,
            onKeyDown: this._handleInputKeyDown,
        };

        if (!this.props.hasOwnProperty('valueLink')) {
            inputProps.onChange = this._handleInputChange;
        }
        if (this.props.children) {
            let childrenProps = this.props.children.props;
            inputElement = React.cloneElement(this.props.children, {...inputProps, ...childrenProps});
        }
        else {
            inputElement = multiLine ? (
                <EnhancedTextarea
                    {...other}
                    {...inputProps}
                    rows={rows}
                    onHeightChange={this._handleTextAreaHeightChange}
                    textareaStyle={this.mergeAndPrefix(styles.textarea)}/>
            ) : (
                <input
                    {...other}
                    {...inputProps}
                    type={type}/>
            );
        }

        return (
            <div className={className} style={this.mergeAndPrefix(styles.root, this.props.style)}>
                {floatingLabelTextElement}
                {hintTextElement}
                {inputElement}
                {errorTextElement}
            </div>
        );
    },

    blur() {
        if (this.isMounted()) this._getInputNode().blur();
    },

    clearValue() {
        this.setValue('');
    },

    focus() {
        if (this.isMounted()) this._getInputNode().focus();
    },

    getValue() {
        return this.isMounted() ? this._getInputNode().value : undefined;
    },

    setErrorText(newErrorText) {
        if (process.env.NODE_ENV !== 'production' && this.props.hasOwnProperty('errorText')) {
            console.error('Cannot call TextField.setErrorText when errorText is defined as a property.');
        }
        else if (this.isMounted()) {
            this.setState({
                errorText: newErrorText,
                hasError: true,
            });
        }
    },

    clearError(){
        this.setState({
            errorText: undefined,
            hasError: false
        });
    },

    setValue(newValue) {
        if (process.env.NODE_ENV !== 'production' && this._isControlled()) {
            console.error('Cannot call TextField.setValue when value or valueLink is defined as a property.');
        }
        else if (this.isMounted()) {
            if (this.props.multiLine) {
                this.refs[this._getRef()].setValue(newValue);
            }
            else {
                this._getInputNode().value = newValue;
            }

            this.setState({hasValue: isValid(newValue)});
        }
    },

    _getRef() {
        return this.props.ref ? this.props.ref : 'input';
    },

    _getInputNode() {
        return (this.props.children || this.props.multiLine) ?
            this.refs[this._getRef()].getInputNode() : React.findDOMNode(this.refs[this._getRef()]);
    },

    _handleInputBlur(e) {
        this.setState({isFocused: false});
        if (this.props.onBlur) this.props.onBlur(e);
    },

    _handleInputChange(e) {
        this.setState({hasValue: isValid(e.target.value)});
        if (this.props.onChange) this.props.onChange(e);
    },

    _handleInputFocus(e) {
        if (this.props.disabled)
            return;
        this.setState({isFocused: true});
        if (this.props.onFocus) this.props.onFocus(e);
    },

    _handleInputKeyDown(e) {
        if (e.keyCode === 13 && this.props.onEnterKeyDown) this.props.onEnterKeyDown(e);
        if (this.props.onKeyDown) this.props.onKeyDown(e);
    },

    _handleTextAreaHeightChange(e, height) {
        let newHeight = height + 24;
        if (this.props.floatingLabelText) newHeight += 24;
        React.findDOMNode(this).style.height = newHeight + 'px';
    },

    _isControlled() {
        return this.props.hasOwnProperty('value') ||
            this.props.hasOwnProperty('valueLink');
    }

});

module.exports = TextField;
