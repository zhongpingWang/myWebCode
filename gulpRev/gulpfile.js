"use strict";

var gulp = require("gulp");
var del = require("del");
var RevAll = require("gulp-rev-all");
var revRep = require("gulp-rev-replace");
var copy = require("gulp-copy");
var bom = require("gulp-bom");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var appConfig = {
    src: "task_bak/",
    dist: "modules/",
    isBak: require("fs").existsSync("task_bak/")
};

gulp.task("delDist", function() {
    return gulp.src(["../../dist/Apps/task"]).pipe(clean({
        force: true
    }));
});

gulp.task("copy", function() {
    return gulp.src(["./modules/**/*", "./*.{aspx,aspx.cs}"])
        .pipe(copy(appConfig.src));
});

gulp.task("cleanMoudle", function() {
    return gulp.src(["./modules"]).pipe(clean());
});

gulp.task("rev", function() {
    var revAll = new RevAll({
        annotator: function(contents, path) {
            //原始的文件名和路径
            var fragments = [{
                'contents': contents
            }];
            return fragments;
        },
        replacer: function(fragment, replaceRegExp, newReference, referencedFile) {
            fragment.contents = fragment.contents.replace(replaceRegExp, function(word, i) {
                if (word.indexOf(".") != -1) {
                    return word.replace(replaceRegExp, "$1" + newReference + "$3$4");
                } else {
                    return word;
                }
            });
        },
        transformFilename: function(file, hash) {
            var path = require("path");
            var ext = path.extname(file.path);
            return path.basename(file.path, ext) + "_" + hash.substr(0, 5) + ext;
        }
    });
    return gulp.src("./task_bak/modules/**/*.{css,js,png,jpg,gif,html}")
        .pipe(revAll.revision())
        .pipe(gulp.dest("./modules"))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest("./modules/rev"));
});

gulp.task("revAspx", function() {
    var manifest = gulp.src("./modules/rev/*.json");
    return gulp.src("./*.aspx")
        .pipe(revRep({
            manifest: manifest,
            replaceInExtensions: [".aspx"]
        }))
        .pipe(bom()) // encoding for vs utf8 with bom
        .pipe(gulp.dest('./'));
});

gulp.task("delMoudle", function() {
    return gulp.src(["./modules", "./*.{aspx,aspx,cs}"]).pipe(clean());
});

//恢复
gulp.task("resetCopy", function() {
    return gulp.src("./task_bak/**/*")
        .pipe(copy("./", {
            prefix: 1
        }));
});

gulp.task("delBak", function() {
    return gulp.src(["./task_bak"]).pipe(clean());
});

gulp.task("default", function(callback) {
    if (appConfig.isBak) {
        runSequence(["delDist", "reset"], "copy", "cleanMoudle", "rev", "revAspx", callback);
    } else {
        runSequence("copy", "cleanMoudle", "rev", "revAspx", callback);
    }
});

gulp.task("reset", function(callback) {
    runSequence("delMoudle", "resetCopy", "delBak", callback);
});