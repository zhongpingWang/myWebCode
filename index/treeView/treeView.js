

var TreeView=function(opts){  


	var _this=this,

	defauts={
		data:null,
		appendTo:"body",
		//callback
		select:null,
		open:null,
		close:null
	};

	this.settings=$.extend(defauts,opts);
	//初始化
	this.init();
};
 

$.extend(TreeView.prototype,{

	//初始化
	init:function(){

		var settings=this.settings;

		var $div=$("<div/>").addClass("navTasks boxShadow boderRadAll_5");

		settings.data.deep=1;
		//生成html
		$div.append(buildHtml(settings.data));
		//添加
		$(settings.appendTo).append($div);
		//事件初始化
		this.initEvent($div); 
	},

	//初始化事件
	initEvent:function($div){

		var settings=this.settings,$container=$(settings.appendTo);  

		//展开 收起
		$div.on("click",".nodeSwitch",function(event){

			var $this=$(this);

			if ($this.hasClass("on")) {
				$this.removeClass("on").addClass("off");
				$this.parent().find(".joinLine").show().end().next().show(); 
				//回调
				if ($.isFunction(settings.open)) {
					settings.open();
				};

			}else{
				$this.addClass("on").removeClass("off");
				$this.parent().find(".joinLine").hide().end().next().hide();
				//回调
				if ($.isFunction(settings.close)) {
					settings.close();
				};
			} 
			event.stopPropagation();
		});


		//hover
		$div.on({ 

			click:function(event){

				$div.find(".header").removeClass("selected");
				$(this).toggleClass("selected");
				//回调
				if ($.isFunction(settings.select)) {
					settings.select();
				};

				event.stopPropagation();
			},

			mouseover:function(){ 
				$(this).addClass("hovered");
			},
			mouseout:function(){
				$(this).removeClass("hovered");
			} 
		},".header");  
	} 
});


//生成html
function buildHtml(data){ 

	var str="",
	 	tasks=data.tasks,count=tasks.length,master=data.deep==1,hidden=master?"":"Hidden";

	if (count>0) { 
		 
		str+='<ul class="box '+hidden+'">';

		//底线
		var borderBottomClass="";
		if (master) {
			borderBottomClass="borderBottom";
		};

		var last=count-1,borderLeft="";

		for(var i=0;i<count;i++){ 

			//测边线
			if (!master) {
				if (i==last) {
					borderLeft="";
				}else{
					borderLeft=" borderLeft ";
				}
			};

			str+='<li class="'+borderBottomClass+' '+borderLeft+'"><div class="header"> ';

			//最后一个 不加边框线
			if (!master && i==last) {
				str+='<span class="joinPrevLine" ></span>';
			}; 
			

			var subTasks=tasks[i].tasks; 

			if (subTasks) {

				if (!master) {
					str+='<span class="subJoinLine"></span>'
				};

				str+='<span class="joinLine"></span><span class="nodeSwitch on"></span>';
			}else{ 

				if (master) {
					str+='<span class="nodeSwitch noSub"></span>';
				}else{
					str+='<span class="subJoinLineBefore"></span><span class="subJoinLine"></span>';
					str+='<span class="nodeCircleSmall circle "></span>';
				}

			}

			//数据
			str+='<span>'+tasks[i].TaskName+' </span> </div>';

			if (subTasks) { 
				data.deep+=1; 
				str+=buildHtml(tasks[i]); 
			}; 

			str+='</li>';

			
		}
      str+='</ul>';	
	}
	
	return str; 
}




;(function($){

	$.treeView=function(opts){ 
		return new TreeView(opts);
	}
})(jQuery);
