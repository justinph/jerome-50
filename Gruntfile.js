module.exports = function (grunt) {

    'use strict';

    // Register various packages/tasks we're going to use
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-exec');


    // Project configuration.
    grunt.initConfig({
        pkg: require('./package'),

        // requirejs: {
        //     compile: {
        //         options: {
        //             mainConfigFile: "public_html/js/init.js",
        //             out: "public_html/js/init.min.js",
        //             generateSourceMaps: false,
        //             preserveLicenseComments: false,
        //             optimize: "uglify2",
        //             skipModuleInsertion: false,
        //             name: "init",
        //             baseUrl: "public_html/js/",
        //         }
        //     }
        // },

        //compress(uglify) require.js itself
        // uglify: {
        //     requirejs: {
        //         files: {
        //             'public_html/js/require.min.js': ['public_html/vendor/requirejs/require.js']
        //         }
        //     }
        // },

        // concat: {
        //     options: {
        //         separator: ';',
        //     },
        //     deploy: {
        //         src: ['public_html/js/require.min.js', 'public_html/js/init.min.js'],
        //         dest: 'public_html/js/all.min.js',
        //     },
        // },

        // Build modernizr
        // modernizr: {
        //     devFile: 'public_html/vendor/modernizr/modernizr.js',
        //     outputFile : 'public_html/js/modernizr.min.js',

        //     extra: {
        //         shiv: true,
        //         mq: true,
        //         history: true,
        //         svg: true
        //     },

        //     // Minify
        //     uglify: true,

        //     // Files
        //     files: ['public_html/js/init.js', 'public_html/js/app/*.js', 'app/less/**/*.less']
        // },

        // jshint: {
        //     all: [
        //         'Gruntfile.js',
        //         'public_html/js/init.js',
        //         'public_html/js/app/*.js'

        //     ],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },

        less: {
            dev: {
                options: {
                    //paths: ["/css"]
                    //dumpLineNumbers: 'all',
                    sourceMap: true,
                    relativeUrls: true,
                },
                files: {
                    'css/main.css': 'css/main.less',
                }
            },
            deploy: {
                options: {
                    //paths: ["assets/css"],
                    yuicompress: true,
                    relativeUrls: true
                },
                files: {
                    'css/main.css': 'css/main.less',
                }
            }
        },

        watch: {
            less: {
                files: ['css/**/*.less'],
                tasks: 'less:dev'
            },
            js: {
                files: [
                    'Gruntfile.js',
                    //'js/js/init.js',
                    'js/*.js'
                ],
                //tasks: 'jshint'
            },
            livereload: {
                options: { livereload: true },
                files: ['js/**/*.js','css/**/*.css','index.html' ]
            }
        },

    });

    //grunt.registerTask('deploy', ['jshint', 'less:deploy', 'requirejs', 'modernizr', 'uglify:requirejs', 'concat:deploy']);

    grunt.registerTask('default', ['less:dev']);


};



