const React = require('react/addons');
const $ = require('jquery')

var timer;

var HotNews = React.createClass({


    componentDidMount(){
        this.animateStar();
    },

    animateNews(time){

        var length=this.props.data && this.props.data.length-1 || 0,
            $newsBox=$(".newsBox"),maxTop=-(length*60),self=this;

        timer= setTimeout(function(){
            clearTimeout(timer);
            var mTop=parseInt($newsBox.css("margin-top"));
            if (mTop>maxTop) {
                mTop-=60;
            }else{
                mTop=0;
            }
            $(".newsBox").animate({'margin-top':mTop},time-1000,function(){
                self.animateNews(time);
            });
        },time);

    },

    animateClear(){
        clearTimeout(timer);
    },

    animateStar(){

        var length=this.props.data && this.props.data.length || 0;

        if (length>0) {
            this.animateNews( this.props.time || 3000 );
        }
    },


    render(){

        var list="";

        if (this.props.data && this.props.data.length>0) {
              list = this.props.data.map(function(item){
                  return (<li onMouseOver={this.animateClear}  onMouseOut={this.animateStar} ><span className="msgText"><label>{item.msgText}</label>
                                <a href={item.href}>{item.linkText}</a></span>
                          </li>);
              }.bind(this));
        }else{
            list=(<li>暂无新闻</li>);
        }

        return (<ul className="newsBox">{list}</ul> );

    }


});

module.exports = HotNews;
