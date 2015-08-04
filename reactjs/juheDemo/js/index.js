//http://www.juhe.cn/my/i 

var CookBook=React.createClass({

	//加载数据
	loadData:function(){


	},



	render:function(){



	}
});


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
			}
		}).done(function(data){
			this.setState({data:data});
		});
	},

	render:function(){
		var item;
		if (this.data.result && this.data.result.length>0 ) {

			item=this.data.result.map(function(result){
					return (
						<li className="item" parentId={result.parentId}>{result.name}</li>
					);
	            }); 
		}else{
			item=(<li>数据出错</li>);
		}

		return (

			<div class="navBar"> { item } </div>

		);

}

});


 