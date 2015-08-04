

var Index={};

//配置
Index.Settings={

	timer:null,
	img:2,

}

//背景自动切换
Index.autoBg=function(){

	var url="https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/",bg;
	setInterval(function(){
		Index.Settings.img++;
		if (Index.Settings.img>520) {
			Index.Settings.img=2;
		};
		bg=url+Index.Settings.img+".jpg";
		$("#siteMain").css("background-image","url('"+bg+"')");

	},100000); 
} 
 

 Index.initEvent=function(){

 	//透明
 	$("#opacity").change(function(){
 		$("#bg").css("opacity",$(this).val()/100); 
 	});

 }