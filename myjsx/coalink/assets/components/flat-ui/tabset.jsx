var React = require('react');
import classNames from 'classnames/dedupe'


var Tab = React.createClass({
    render () {
        return (
            <div/>
        );
    }
});

var Tabset = React.createClass({
    getInitialState () {
        return {
            active: this.props.active || 0
        }
    },
    getClasses() {
        return classNames({
            'tabset': true
        })
    },
    getChildren () {
        var children = this.props.children;
        if (!children.length) {
            children = [children]
        }
        return children;
    },
    getTabs() {
        var self = this;
        return this.getChildren().map(function (tab, index) {
            var key = 'tab' + index,
                classes = classNames({
                    tab: true,
                    active: index == self.state.active
                });
            return (
                <li key={key} className={classes} onClick={self.onSelectTab(tab, index)}>
                    {tab.props.heading}
                </li>
            )
        });
    },
    getPanels() {
        var self = this;
        return this.getChildren().map(function (tab, index) {
            var key = 'tabPanel' + index,
                classes = classNames({
                    'tab-panel': true,
                    'active': index == self.state.active
                });
            return (
                <div key={key} className={classes}>
                    {tab.props.children}
                </div>
            )
        })
    },
    onSelectTab(tab, index) {
        var self = this;
        return function () {
            self.setState({active: index});
            (self.props.onSelectTab || function (){})(tab, index);
        }
    },
    render() {
        var self = this, children = this.getChildren();
        return (
            <div className={this.getClasses()}>
                <ul className='tabs'>
                    {this.getTabs()}
                </ul>
                <div className='tab-panels'>
                    {this.getPanels()}
                </div>
            </div>
        );
    }
});

export {
    Tabset,
    Tab
}
