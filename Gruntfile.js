'use strict';
module.exports = function (grunt) {
    var path = require('path');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: ['public', 'modules'],
            public: ['public'],
            modules: ['modules']
        },
        concat: {
            js: {
                src: ['app/facebook.js'],
                dest: 'build/js/expenses.js'
            },
            css: {
                src: ['assets/css/paper.css'],
                dest: 'build/css/expenses.css'
            }
        },
        uglify: {
            app: {
                src: 'build/js/expenses.js',
                dest: 'public/js/expenses.min.js'
            }
        },
        cssmin: {
            main: {
                files: {
                    'public/css/landing.min.css': 'assets/css/landing.css',
                    'public/css/expenses.min.css': 'build/css/expenses.css'
                }
            }
        },
        copy: {
            main: {
                files: [
                    //{
                    //    expand: true, dest: 'components', filter: 'isFile', cwd: 'bower_components',
                    //    src: ['**/*.html', 'polymer/polymer.js', '!**/{metadata,demo,index}.html', '!**/test/**', '!polymer-test-tools/**']
                    //},
                    {
                        expand: true, flatten: true, dest: 'public/js', filter: 'isFile',
                        src: ['bower_components/**/*.min.js']
                    },
                    {
                        expand: true, flatten: true, dest: 'public/css', filter: 'isFile',
                        src: ['bower_components/**/*.min.css']
                    },
                    {
                        expand: true, flatten: true, dest: 'public/fonts', filter: 'isFile',
                        src: ['bower_components/**/fonts/**']
                    },
                    {
                        expand: true, flatten: true, dest: 'public/img', filter: 'isFile',
                        src: ['assets/img/**']
                    }
                ]
            },
            build: {
                files: [
                    {
                        expand: true, flatten: true, dest: 'build/css', filter: 'isFile',
                        src: ['assets/css/**']
                    },
                    {
                        expand: true, flatten: true, dest: 'build/img', filter: 'isFile',
                        src: ['assets/img/**']
                    },
                    {
                        expand: true, flatten: true, dest: 'build/fonts', filter: 'isFile',
                        src: ['bower_components/**/fonts/**']
                    }
                ]
            },
            svg: {
                expand: true, flatten: true, dest: 'public/svg', filter: 'isFile',
                src: ['bower_components/material-design-icons/sprites/svg-sprite/*.svg'],
                rename: function (dest, src) {
                    return path.join(dest, /[a-z]+\.svg$/.exec(src)[0]);
                },
                options: {
                    process: function (content) {
                        return content.replace(/ic_/mg, '').replace(/_24px/mg, '').replace(/_/mg, '-');
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            angular: {
                options: {
                    node: false
                },
                files: {
                    src: ['app/**/*js']
                }
            },
            node: {
                options: {
                    globals: {
                        angular: false
                    }
                },
                files: {
                    src: ['routes/*.js', 'app.js', 'server.js']
                }
            }
        },
        babel: {
            options: {
                sourceMap: true
            },
            modules: {
                files: [{
                    expand: true,
                    cwd: 'harmony/backend',
                    src: ['*.js'],
                    dest: 'modules'
                }]
            }
        },
        watch: {
            modules: {
                files: ['harmony/backend/*.js'],
                tasks: ['babel:modules']
            },
            backend: {
                files: ['modules/*.js', 'specs/backend/*.js'],
                tasks: ['jasmine_node:modules'],
                options: {
                    event: ['added', 'changed']
                }
            },
            frontend: {
                files: ['assets/**', 'app/**'],
                tasks: ['concat', 'copy:build']
            }
        },
        jasmine_node: {
            options: {
                forceExit: true
            },
            modules: {
                options: {
                    source: ['modules/*.js'],
                    specFolders: ['specs/backend']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', ['clean:all', 'concat', 'uglify', 'cssmin', 'copy:main', 'babel']);
    grunt.registerTask('test', ['jasmine_node']);
};