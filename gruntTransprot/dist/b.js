
define('b',['a'],function(require, exports, module){

	require('a');
    console.log("b.js");   
	
});

define('a',function(require, exports, module){

      console.log("a.js");   
	
});
