let React = require('react');
let StylePropable = require('../mixins/style-propable');
let Colors = require('../styles/colors.js');


let Tab = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    handleTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool,
    width: React.PropTypes.string,
  },

  handleTouchTap() {
    this.props.handleTouchTap(this.props.tabIndex, this);
  },

  render() {
    let styles = this.mergeAndPrefix({
      display: 'table-cell',
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'middle',
      height: 48,
      color: Colors.white,
      opacity: 1,
      fontSize: 16,
      fontWeight: '500',
      whiteSpace: 'initial',
      fontFamily: this.context.muiTheme.contentFontFamily,
      boxSizing: 'border-box',
      width: this.props.width,
    }, this.props.style);

    if (this.props.selected) {
      styles.backgroundColor = '#00cccc';
    }

    return (
      <div className='tab' style={styles} onTouchTap={this.handleTouchTap} routeName={this.props.route}>
        {this.props.label}
      </div>
    );
  },

});

module.exports = Tab;
