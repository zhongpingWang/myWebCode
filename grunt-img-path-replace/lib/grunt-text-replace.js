var grunt = require('grunt');
var path = require('path');
var gruntTextReplace = {};


exports.replace = function (settings) {
  gruntTextReplace.replace(settings);
}

gruntTextReplace = {
    replaceFileMultiple: function (settings) {
        var sourceFiles = grunt.file.expand(settings.src);
        sourceFiles.forEach(function (pathToSource) {
            gruntTextReplace.replaceFile({
                src: pathToSource,
                dir: settings.dir
            });
        });
    },

    replaceFile: function (settings) {
        grunt.file.copy(settings.src, settings.src, {
            process: function (text) {
                return gruntTextReplace.replaceTextMultiple(settings.src, text, settings.dir);
            }
        });
    },

    replaceTextMultiple: function (src, text, dir) {
        return gruntTextReplace.replaceText({
            text: text,
            src: src,
            dir: dir,
            finallyDir: dir.finallyDir
        });
    },

    replaceText: function (settings) {

        var text = settings.text;
        var src = settings.src;
        var tmpDir = settings.dir[0];
        var finallyDir = settings.dir[1];

        var reg = /:url\(['|"]?(.+?)['|"]?\)/gi;

        var matchs = text.match(reg);

        var oldImageUrlArr = [];

        if (matchs && matchs.length > 0) {
            for (var i = 0; i < matchs.length; i++) {
                var matchItem = matchs[i];
                if (matchItem.length > 0) {
                    var imageUrl = matchItem.replace(":url(", "").replace(")", "").replace("\"", "").replace("\"", "");

                    if (gruntTextReplace.arrContainsElement(oldImageUrlArr, imageUrl))
                        continue;

                    oldImageUrlArr.push(imageUrl);

                    var absolutePath = gruntTextReplace.imgAbsolutePath(src, imageUrl);
                    if (absolutePath) {
                        absolutePath = "/" + absolutePath.replace(tmpDir, finallyDir);

                        //text = text.replace(imageUrl, absolutePath);

                        text = text.replace(new RegExp(imageUrl, "gi"), absolutePath);
                    }
                }
            }
        }
        return text;
    },
    replace: function (settings) {
        var src = grunt.file.expand(settings.src || []);
        var dir = settings.dir;
        gruntTextReplace.replaceFileMultiple({
            src: src,
            dir: dir
        });
    },
    imgAbsolutePath: function (base, relative) {
        base = base.substring(0, base.lastIndexOf("/"));
        var stack = base.split("/"),
          parts = relative.split("/");
        for (var i = 0; i < parts.length; i++) {
            if (parts[0] == "")
                return "";

            if (parts[i] == ".")
                continue;

            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    },
    arrContainsElement: function (arr, element) {
        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == element) {
                    return true;
                }
            }
        }
        return false;
    }
}
