'use strict';


var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); 

gulp.task('default' ,function() {
	gulp.src("./css/*.css")
	    .pipe($.md5Assets(10,'./index.html'))
	    .pipe(gulp.dest("./dist"));
});