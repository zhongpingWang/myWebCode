import React from 'react/addons'
import assign from 'object-assign'

let Image = React.createClass({
    getDefaultProps() {
        return {
            size: 'cover'
        }
    },
    getStyle() {
        return {
            backgroundSize: this.props.size,
            backgroundPosition: 'center',
            backgroundRepeat: "no-repeat",
            border: "1px solid #ccc",
            backgroundImage: "url(" + this.props.src + ")"
        }
    },
    render() {
        let {
            src,
            style,
            ...other
        } = this.props;
        return (<div {...other} style={assign(this.getStyle(), style)}></div>);
    }
});

export default Image;
