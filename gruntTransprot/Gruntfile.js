


module.exports = function(grunt) { 

    require('load-grunt-tasks')(grunt);

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var script = transport.script.init(grunt);
    var text = transport.text.init(grunt);
    grunt.file.defaultEncoding = 'utf8';
    grunt.file.preserveBOM = true;


  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      //提取模块
      transport: {

          options: {
              paths: ['/'],  
              parsers: {
                  '.js': [script.jsParser],
                  '.css': [style.css2jsParser]
              }
          },  
          
          app: {
              options: {
                  hash:false, 
                  idleading: ''
              },
              files: [
                  {
                    expand: true,
                    cwd: '',
                    src: ['app/js/*.js'],
                    filter: 'isFile',
                    dest: 'dist/'
                  }
              ]
          }
      },  
   
      concat:{
         options: {
                paths: ['dist/'],
                include: 'relative' //以相对路径require的方式合并成一个文件
          },
          app: {
                options: {
                    include: 'all' //以相对路径或者绝对路径require的全部合并成一个文件，重写父级的options
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['app/**/*.js'],
                        dest: 'dist/'
                    }
                ]
            }, 
      } 

     }); 

 
   grunt.loadNpmTasks('grunt-cmd-concat');
 
  // 默认被执行的任务列表。
  grunt.registerTask('default', ['transport','concat' ]);

};



 