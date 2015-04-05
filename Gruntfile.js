'use strict';
module.exports = function (grunt) {
    var path = require('path');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: ['app/dashboard/dashboard.js', 'app/dashboard/dashboard.controller.js', 'app/expenses.js'],
                dest: 'build/expenses.js'
            }
        },
        uglify: {
            build: {
                src: 'build/expenses.js',
                dest: 'public/js/expenses.min.js'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true, flatten: true, dest: 'public/css', filter: 'isFile',
                        src: ['bower_components/**/*.min.css', '!bower_components/angular-material/modules/**']
                    },
                    {
                        expand: true, flatten: true, dest: 'public/js', filter: 'isFile',
                        src: ['bower_components/**/*.min.js', '!bower_components/angular-material/modules/**']
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
        clean: {
            all: ['public', 'modules']
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
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy', 'babel']);
    grunt.registerTask('test', ['jasmine_node']);
};