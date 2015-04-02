'use strict';
module.exports = function (grunt) {
    var path = require('path');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'app/**/*.js',
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
            public: ['public']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'uglify', 'copy']);
};