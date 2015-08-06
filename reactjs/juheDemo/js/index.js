//http://www.juhe.cn/my/i 

var CookBook=React.createClass({

	//加载数据
	loadData:function(){


	}, 

	render:function(){

		return ( <div className="bookShops"><div className="navBar">  
					<CookSearch />
					<CookBookHeader /></div> 
					<div className="cookContent"><CookContent /></div>
				  </div>); 
	}
});


//内容
var CookContent=React.createClass({

	render:function(){ 
		return (<div className="images"><img src="./images/book6.jpg" /><img className="next" src="./images/book3.jpg" /><img className="last" src="./images/book5.jpg" /><img className="vnext" src="./images/book4.jpg" /></div>); 
	} 

});


//查找
var CookSearch=React.createClass({ 

	getInitialState:function(){
		return {
			keyWords:null
		};
	},

	render:function(){

		return (
			<div className="searchCooks"> 
		 		<input type="text" placeholder="请输入要查找的菜名" className="txtSearch" value={this.state.keyWords} />
		 		<span className="clearSearch" title="清除搜索">x</span>
			</div>);

	} 
});


//  菜谱头部
var CookBookHeader=React.createClass({

	//初始化 数据
	getInitialState:function(){
		return {
			data:null
		};
	},

	//仅会在客户端调用一次
	componentDidMount:function(){
		$.ajax({
			url:"http://apis.juhe.cn/cook/category",
			type:"GET",
			dataType:"jsonp",
			data:{
				key:"43896054cbf8a1be64951640a4ea059f"
			},
			success: function(data) {
        		this.setState({data: data});
      		}.bind(this)
		});
	},

	render:function(){
	 	
	 	console.log(this.state);

		var item;
		if ( this.state.data && this.state.data.result && this.state.data.result.length>0 ) {

			item=this.state.data.result.map(function(result){
				return (<li className="item" data-parentId={result.parentId}><span className="cookCategory cookText">{result.name}</span><CookBookHeaderList list={result.list} /></li>);
	        }); 

		}else{
			item=(<li>数据加载中……</li>);
		} 

		return (<ul className="cookBooks">{ item }</ul>); 
	} 
}); 


//菜谱列表
var CookBookHeaderList=React.createClass({

	getInitialState:function(){

		return { list:this.props.list }
	},

	//获取菜系详情
	handleGetBookDetail:function(e){
		e.preventDefault();

		///  this.refs.author.getDOMNode().value = "";
		///  
		var text=$(this).text();
		console.log(text);
	},

	render:function(){ 
		
		var  list;

		if (this.state.list && this.state.list.length>0) {

			list=this.state.list.map(function(item){
				return (<li className="subItem" data-parentId={item.parentId} >
							<span  className="cookItem cookText" onClick={this.handleGetBookDetail} >{item.name}</span>
						</li>);
			});
		}else{
			list=(<li>暂无数据</li>);
		}  

		return (<ul className="cookBook">{ list }</ul>);  
	}  
});


var TestClick=React.createClass({

	render:function(){

		return (<div>abc</div>);

	}


});