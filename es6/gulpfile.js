'use strict';


var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task("def", function () {
  return gulp.src("./index2.js")
    .pipe($.babel())
    .pipe(gulp.dest("dist/"));
}); 

// 默认任务
gulp.task('default', function () {
    gulp.run('def');
    // 监听文件变化
    gulp.watch('./index2.js', function () {
        gulp.run('def');
    });
});
