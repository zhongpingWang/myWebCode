import React from 'react'
import mui from '../flat-ui'
import classNames from 'classnames/dedupe'
import {Tabs, Tab, Styles} from '../flat-ui'


var SearchBox = React.createClass({

    mixins: [mui.ThemeContextMixin],

    getInitialState () {
        return {}
    },
    getInputBoxClasses(nav) {
        return classNames({
            "search-input-box": true,
            "active": nav == this.state.currentTab
        });
    },
    render() {
        return (
            <Tabs tabItemContainerStyle={{width: 400}}>
                <Tab label='动力煤'>
                    <div className={this.getInputBoxClasses('tab1')}>
                        <input placeholder="热值: 4500~5000"/>
                        <input placeholder="水分: 10%以下"/>
                        <input placeholder="送至: 不限"/>
                    </div>
                    <div className='search-submit'>搜索</div>
                </Tab>
                <Tab label='焦煤'>
                    <div>
                        <div className={this.getInputBoxClasses('tab2')}>
                            <input placeholder="空干基挥发分: 10%以下"/>
                            <input placeholder="灰分: 5%以下"/>
                            <input placeholder="送至: 不限"/>
                        </div>
                        <div className='search-submit'>搜索</div>
                    </div>
                </Tab>
                <Tab label='无烟煤'>
                    <div className={this.getInputBoxClasses('tab3')}>
                        <input placeholder="低位热值: 3000以下"/>
                        <input placeholder="空干基挥发分: 10%以下"/>
                        <input placeholder="送至: 不限"/>
                    </div>
                    <div className='search-submit'>搜索</div>
                </Tab>
            </Tabs>
        )
    }
});

export default SearchBox;
