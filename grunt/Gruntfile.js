


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
              paths: ['.'],
              alias: '<%= pkg.spm.alias %>',
              parsers: {
                  '.js': [script.jsParser],
                  '.css': [style.css2jsParser]
              }
          },  
         
          comm: {
              options: {
                  idleading: ''
              },
              files: [
                  {
                    expand: true,
                    cwd: '',
                    src: ['modules/comm/**/*'],
                    filter: 'isFile',
                    dest: '.build/'
                  }
              ]
          },

          app: {
              options: {
                  idleading: ''
              },
              files: [
                  {
                    expand: true,
                    cwd: '',
                    src: ['apps/task/modules/**/*'],
                    filter: 'isFile',
                    dest: '.build/'
                  }
              ]
          }
      }, 
 
      uglify: {
        options: {
                compress: {
                    drop_console: true
                },
                report: 'gzip'
            },
        build: {
       
            options: {
                    // sourceMap: true,
                    mangle: {
                        except: ['require', 'module', 'exports', 'seajs', 'jQuery', '$', '_',
                            'iviewer', 'cursorGrab', 'nicescroll']
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['**/*.js','!**/*-debug.js','!**/*.css.js'],
                        dest: 'dist/',
                        extDot: 'last',
                        ext: '.js'
                    }
                ] 
        }
      },

      cssmin: {
            build: { 
                files: [
                    {
                        expand: true,
                        src: ['app/**/*.css'],
                        dest: '.build/',
                        extDot: 'last',
                        ext: '.css'
                    }
                ]
            } 
      },
 

      copy: {

          app: {
              files: [
                  {
                      expand: true,
                      src: ['apps/**/*.html','modules/seajs/**/*', 'apps/**/*.{png,jpg,gif}','apps/**/*.css'],
                      dest: '.build/'
                  }
              ]
          } ,

          appdist: {
              files: [
                  {
                      expand: true,
                      src: ['.build/**/*.html', '.build/modules/seajs/**/*','.build/**/*.{png,jpg,gif}','.build/**/*.css'],
                      dest: 'dist/'
                  }
              ]
          } 
      }, 

      concat:{
         options: {
                paths: ['.build/'],
                include: 'relative' //以相对路径require的方式合并成一个文件
          },
          app: {
                options: {
                    include: 'all' //以相对路径或者绝对路径require的全部合并成一个文件，重写父级的options
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['apps/task/**/*.js'],
                        dest: '.build/'
                    }
                ]
            },

      },


      connect: {
          options: { 
              port: 8080,
              open: true, 
              // Change this to '0.0.0.0' to access the server from outside
              hostname: '*'  
          },       
          dist: {    
                livereload: false,
             
              }   
          }  
  }); 
 
grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // 默认被执行的任务列表。
  grunt.registerTask('default', ['transport','concat:app','uglify' ]);

};



// var path = require('path');
// var fs = require('fs');

// module.exports = function (grunt) {
// 	grunt.file.defaultEncoding = 'utf8';
//     grunt.file.preserveBOM = true;

//      grunt.initConfig({

//         pkg: grunt.file.readJSON("package.json"),

//         uglify:{

//         	options: {
//                 compress: {drop_console: true},
//                 report: 'gzip'
//             },

//             mdtask: {
//                 options: {
//                     // sourceMap: true,
//                     mangle: {
//                         except: ['require', 'module', 'exports', 'seajs', 'jQuery', '$', '_',
//                             'iviewer', 'cursorGrab', 'nicescroll']
//                     }
//                 },
//                 files: [
//                     {
//                         expand: true,
//                         cwd: 'dist/',
//                         src: ['./js/*.js'],
//                         dest: 'dist/',
//                         extDot: 'last',
//                         ext: '.js'
//                     }
//                 ]
//             }
//         }
//     });

// };
// 
// module.exports = function(grunt){
//         require('load-grunt-tasks')(grunt); //加载所有的任务 
//         
//   //require('time-grunt')(grunt); 如果要使用 time-grunt 插件
//           grunt.initConfig({   
//           
//                     connect: {
//                             options: { 
//                                    port: 9000, 
//                                           hostname: '*', //默认就是这个值，可配置为本机某个 IP，localhost 或域名 
//                                                  livereload: 35729 //声明给 watch 监听的端口    
//                                                      },       
//                                                       server: {   
//                                                            options: {     
//                                                               open: true, //自动打开网页 http://  
//                                                                     base: [        'app' //主目录        ]  
//                                                                           }   
//                                                                               
//                                                                                 }    
//                                                                                    },    
//                                                                                        watch: {        livereload: {        options: {        livereload: '' //监听前面声明的端口 35729        },        files: [ //下面文件的改变就会实时刷新网页        'app/*.html',        'app/style/{,*/}*.css',        'app/scripts/{,*/}*.js',        'app/images/{,*/}*.{png,jpg}'        ]        }        }        });        grunt.registerTask('serve', [        'connect:server',        'watch'        ]);}