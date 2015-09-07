'use strict';

import './video/banner.mp4'
import './images/banner.jpg'

import React from 'react'
import mui from '../../components/flat-ui'
import TopBar from '../../components/TopBar'
import SearchBox from '../../components/SearchBox'
import {muiTheme} from '../../commons'
import HotNews from '../../components/flat-ui/news'
//import DigitalScroll from '../../components/flat-ui/digital'
import CarouselEffect from '../../components/flat-ui/Carousel'

// 对root React组件，通过prop来传递theme等全局变量，在root 组件内可以
// 通过context来传递。

// TODO: 从现有topBarBox中获得用户是否登录及用户等信息，或者alt store？
React.render(
    <TopBar muiTheme={muiTheme} loggedIn={false}/>,
    document.querySelector('.topBarBox')
);

React.render(<SearchBox muiTheme={muiTheme}/>, document.querySelector("#searchBox"));

var data=[{msgText:'最新动态：Coalink业内首创微信下单，随时随地完成交易',href:'###',linkText:'更多…'},{msgText:'最新动态：Coalink业内首创微信下单',href:'###',linkText:'更多…'}];

React.render(<HotNews data={data} />, document.querySelector(".newNotice") );

//React.render(<DigitalScroll star="200000" end="2005000" />, document.querySelector(".sunNumber") );

var carouseData=[ { type:"number",star: 200000,end:2005000 },{ text:"海到尽头天为路"  },{text:'山登绝顶我为峰'} ];
React.render(<CarouselEffect data={carouseData} />, document.querySelector(".numberTransactions") );
