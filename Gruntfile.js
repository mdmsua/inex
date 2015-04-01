'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                src: '[app/**/*.js]',
                dest: 'public/js/expenses.min.js'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true, flatten: true, dest: 'public/css', filter: 'isFile',
                        src: ["bower_components/**/*.min.css", "!bower_components/angular-material/modules/**"]
                    },
                    {
                        expand: true, flatten: true, dest: 'public/js', filter: 'isFile',
                        src: ["bower_components/**/*.min.js", "!bower_components/angular-material/modules/**"]
                    }
                ]
            }
        },
        jshint: {
            all: ['app/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['uglify', 'copy']);
};