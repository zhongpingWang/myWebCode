define("apps/task/modules/app-debug", [ "./css/app-debug.css", "./comm/comm-debug", "./app/app-debug", "./app/app-debug.css" ], function(require, exports, module) {
    console.log("app.js");
    require.async("comm-debug", function() {
        console.log("outCommLoading");
    });
    require("./css/app-debug.css");
    require("./comm/comm-debug");
    require("./app/app-debug");
});

define("apps/task/modules/css/app-debug.css", [], function() {
    seajs.importStyle("body{margin:0;padding:0}div{width:200px;height:200px;background-color:red;margin:50px;display:inline-block}");
});

define("apps/task/modules/comm/comm-debug", [], function(require, exports, module) {
    console.log("comm.js");
});

define("apps/task/modules/app/app-debug", [], function(require, exports, module) {
    console.log("appMain.js");
    require("apps/task/modules/app/app-debug.css");
});

define("apps/task/modules/app/app-debug.css", [], function() {
    seajs.importStyle("body{background-color:#000}");
});
