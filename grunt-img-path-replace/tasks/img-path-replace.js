
var gruntTextReplace = require('../lib/grunt-text-replace');

module.exports = function (grunt) {

    grunt.registerMultiTask('imgpathreplace', 'replace css image path.',
      function () {
          gruntTextReplace.replace({
              src: this.data.src,
              dir: this.data.dir
          });
      });
};
