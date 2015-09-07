define("apps/task/modules/app/app", [ "./app.css" ], function(require, exports, module) {
    console.log("appMain.js");
    require("./app.css");
});

define("apps/task/modules/app/app.css", [], function() {
    seajs.importStyle("body{background-color:#000}");
});
