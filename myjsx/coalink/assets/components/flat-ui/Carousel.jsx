const React = require('react/addons');
const DigitalScroll=require('../flat-ui/digital');
const $ = require('jquery')


var timer;

var CarouselEffect = React.createClass({

    // getInitialState(){
    //         return {
    //             marginLeft:'0'
    //         };
    // },

    componentDidMount(){
        this.animateStar();
    },

    animateDigita(){

        var WIDTH=$("body").width(),
        $slides=$(".slides"),
        count=$slides.find("li").length,
        mLeft=parseInt($slides.css("margin-left")),
        maxLeft=-(count-1)*WIDTH,
        self=this;

        if ( mLeft > maxLeft) {

              mLeft -= WIDTH;

            timer=setTimeout(()=>{
                 clearTimeout(timer);
                  $(".slides").animate({ "margin-left":mLeft},1000);
                 self.animateDigita();

            },2000);
        }else{

            timer=setTimeout(()=>{
                 clearTimeout(timer);
                 $(".slides").animate({ "margin-left":0},1000);
                 self.animateDigita();

            },2000);
        }
    },

    animateStar(){
        //初始化
        this.animateDigita();
    },

    render(){

        var list="";
        if (this.props.data && this.props.data.length>0) {
              list = this.props.data.map(function(item){

                  if (item.type=="number") {
                      return (<li><DigitalScroll star={item.star} end={item.end} /></li> );
                  }else{
                      return (<li><span className="msgText">{item.text}</span>
                              </li>);
                  }

              }.bind(this));
        }else{
            list=(<li>暂无新闻</li>);
        }

        //return (<ul className="slides" style={this.state}>{list}</ul> );
        return (<ul className="slides">{list}</ul> );

    }


});

module.exports = CarouselEffect;
