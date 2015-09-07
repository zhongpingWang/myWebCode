define("apps/task/modules/app/app-debug", [ "./app-debug.css" ], function(require, exports, module) {
    console.log("appMain.js");
    require("./app-debug.css");
});

define("apps/task/modules/app/app-debug.css", [], function() {
    seajs.importStyle("body{background-color:#000}");
});
