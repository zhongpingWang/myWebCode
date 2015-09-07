


module.exports = function(grunt) { 

    require('load-grunt-tasks')(grunt); 
    grunt.file.defaultEncoding = 'utf8';
    grunt.file.preserveBOM = true;


  // Project configuration.
  grunt.initConfig({ 

    copy:{

    },

      connect: { 
          server: {  
            port: 9000,
            open: true,  
            hostname: 'localhost' ,  
            livereload: false,
            base: "apps/" //主目录   
            }   
          } 
  }); 
 

  // 默认被执行的任务列表。
   grunt.registerTask('default', ['connect']);

};


 