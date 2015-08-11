﻿'use strict';


var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


// 编译Sass
gulp.task('sass', function () {
    return gulp.src(['sassTest/**/*.scss'])
         .pipe($.sass({
             outputStyle: 'expanded', //nested 展开  expanded  接近手写  compact 一行  compressed 所有样式合成一行
             precision: 10,
             includePaths: ['.']
         }))
         .pipe($.autoprefixer({ browsers: ['last 5 versions', 'IE 7'] }))
         .pipe(gulp.dest('./css/'));
});

gulp.task('css2', function () {
    return gulp.src('sassTest/**/*.css')
      .pipe($.cssScss())
      .pipe(gulp.dest('./sassTest/'));
}); 
 


gulp.task('a', function () {
    return gulp.src('SCSS/*.css')
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./css'));
});


// 默认任务
gulp.task('default', function () {
    gulp.run('sass');
    // 监听文件变化
    gulp.watch('./SCSS/*.scss', function () {
        gulp.run('sass');
    });
});


// gulp.task("scss",function(){ 
//    return gulp.src('SCSS/*.scss') 
//     .pipe($.sass.sync({
//       outputStyle: 'expanded',
//       precision: 10,
//       includePaths: ['.']
//     }).on('error', $.sass.logError)) 
//     .pipe(gulp.dest('SCSS'));

// });


