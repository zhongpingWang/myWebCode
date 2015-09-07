const React = require('react/addons');

var timer;

var DigitalScroll = React.createClass({

    getInitialState(){
            return {
                number:this.props.star
            };
    },

    componentDidMount(){
        this.animateStar();
    },

    animateDigita(){

        var star=this.state.number,end=this.props.end,self=this;

        if (star<end) {
            star++;
            timer= setTimeout(function(){
                clearTimeout(timer);
                self.setState({ number:star});
                self.animateDigita();
            },50);
        }
    },

    animateStar(){
        //初始化
        this.animateDigita();
    },

    render(){

        var i=0,block,numArr= this.state.number.toString().split(''),count=numArr.length;

        var list= numArr.map((n)=>{
             i++;
             if (i%3==0 && i!=0 && i!=count) {
                 return (<span><label className="number">{n}</label><label className="number">,</label></span>);
             }else{
                 return ( <label className="number">{n}</label> );
             }
         });

        return (<div className="numberBox"><label className="tipText">已完成交易数</label>{list}<label className="unit">吨</label></div> );

    }


});

module.exports = DigitalScroll;
