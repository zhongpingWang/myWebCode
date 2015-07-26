

var TreeView=function(opts){  


	var _this=this,

	defauts={
		data:null,
		appendTo:"body",
		allBg:false,
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
		$div.append(buildHtml(settings.data,settings.allBg));
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
function buildHtml(data,allBg){ 

	var str="",
	 	tasks=data.tasks,count=tasks.length,master=data.deep==1,hidden=master?"":"Hidden";

	if (count>0) { 
		 
		 if (allBg) {
		 	str+='<ul class="box '+hidden+'">';
		 	
		 }else{
		 	str+='<ul class="box mLeft20 '+hidden+'">';
		 }
		

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

			var pLeft=(data.deep-1)*20;

			if (allBg) {
				str+='<li class="'+borderBottomClass+' "><div class="header" style="padding-left:'+pLeft+'px;"> ';
				str+='<span class="'+borderLeft+'"></span>';
			}else{
				str+='<li class="'+borderBottomClass+' '+borderLeft+'"><div class="header"> ';
			}

			//最后一个 不加边框线
			if (!master && i==last) {
				str+='<span class="joinPrevLine" ></span>';
			}; 																																			
			

			var subTasks=tasks[i].tasks; 

			if (subTasks) {

				pLeft=data.deep*20;

				if (!master) {
					if (allBg) {
						str+='<span class="subJoinLine" style="left:'+pLeft+'px;"></span>';
					}else{
						str+='<span class="subJoinLine"></span>';
					}
				};

				if (allBg) {
					str+='<span class="joinLine" style="left:'+pLeft+'px;"></span>';
				}else{
					str+='<span class="joinLine"></span>';
				}

				str+='<span class="nodeSwitch on"></span>';
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
				tasks[i].deep=data.deep+1; 
				str+=buildHtml(tasks[i],allBg); 
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
