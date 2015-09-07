'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  cmd = require('gulp-cmd'),
  cmdTransport=require('gulp-cmd-transport'),
  cmdConcat=require('gulp-cmd-concat'),
  seajsCombo = require( 'gulp-seajs-combo' ),
  transport = require("gulp-seajs-transport");

gulp.task('connect', function() {
  connect.server();
}); 
 
 
 
gulp.task( 'cmd', function(){
    return gulp.src( ['app/js/*.js'])
        .pipe( cmd({map:{"c":"./app/js/" }}) ) 
        .pipe( gulp.dest('dist/') );
}); 

gulp.task( 'cmd2', function(){
    return gulp.src( ['dist/app/js/*.js']) 
        .pipe(cmdConcat({include:"relative"}))
        .pipe( gulp.dest('build/') );
}); 

gulp.task( 'combo', function(){
    return gulp.src( ['app/js/*.js']) 
        .pipe(seajsCombo({map : {'c' : 'app/js'}}))
        .pipe( gulp.dest('dist/') );
});


gulp.task("transport",function(){
  gulp.src('app/js/*.js',{base:"./"})
        .pipe(transport())
        .pipe(gulp.dest("dist/"));
}) 

gulp.task('default', ['connect']);