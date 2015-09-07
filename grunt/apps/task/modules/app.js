

define(function(require, exports, module){

console.log("app.js");  

	require.async("comm",function(){
		console.log("outCommLoading");
	});

	require("./css/app.css");
	
	require("./comm/comm.js"); 

	require("./app/app.js"); 
	
});