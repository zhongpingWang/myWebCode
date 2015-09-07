define("apps/task/modules/app", [ "./css/app.css", "./comm/comm", "./app/app", "./app/app.css" ], function(require, exports, module) {
    console.log("app.js");
    require.async("comm", function() {
        console.log("outCommLoading");
    });
    require("./css/app.css");
    require("./comm/comm");
    require("./app/app");
});

define("apps/task/modules/css/app.css", [], function() {
    seajs.importStyle("body{margin:0;padding:0}div{width:200px;height:200px;background-color:red;margin:50px;display:inline-block}");
});

define("apps/task/modules/comm/comm", [], function(require, exports, module) {
    console.log("comm.js");
});

define("apps/task/modules/app/app", [], function(require, exports, module) {
    console.log("appMain.js");
    require("apps/task/modules/app/app.css");
});

define("apps/task/modules/app/app.css", [], function() {
    seajs.importStyle("body{background-color:#000}");
});
