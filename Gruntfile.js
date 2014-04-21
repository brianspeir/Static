//
// Copyright (C) 2014 Brian Speir. All rights reserved.
//
// Licensed under The BSD 3-Clause License (the "License"); you may not
// use this file except in compliance with the License. You may obtain
// a copy of the License at http://opensource.org/licenses/BSD-3-Clause.
//
//

'use strict';

/**static.Gruntfile

Make building static websites nicer.

Be easy to understand. Be powerful to configure. Allow changes to be
made in package.json.

*/

module.exports = function (grunt) {

    // Globbing patterns.
    // Set in package.json under config.globbing.
    //
    // match all files                                   *
    // match all files and one subdirectory deep    {,*/}*
    // match all files in all subdirectories          **/*

    // Load all grunt tasks.
    require('load-grunt-tasks')(grunt);

    // Configuration.
    grunt.initConfig({

        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (C) <%= grunt.template.today("yyyy") %> ' +
                '<%= pkg.author.name %>. All rights reserved.;' +
                ' Licensed <%= props.license %> */\n',


        // Append vendor preprefixes to CSS.
        autoprefixer: {

            options: {
                browsers: [
                    '> 1%',
                    'last 2 versions',
                    'Firefox ESR',
                    'Opera 12.1'
                ],
                cascade: true,
            },

            // Replace intermediate files.
            files: {
                src: '<%= pkg.directories.intermediates %>/' +
                     '<%= pkg.directories.stylesheets %>/' +
                     '<%= pkg.config.globbing %>.css'
            }

        },

        // Push to server.
        buildcontrol: {

            options: {
                connectCommits: 'true',
                commit: true,
                dir: '<%= pkg.directories.resources %>',
                message: 'Version: <%= pkg.version %>',
                push: true,
                tag: '<%= pkg.version %>'
            },

            files: {
                options: {
                    branch: 'gh-pages',
                    remote: 'git@github.com:' +
                    '<%= pkg.repository.username %>/<%= pkg.name %>.git'
                }
            }

        },

        // Remove files and folders.
        clean: {

            all: {
                dot: true,
                src: [
                    '<%= pkg.directories.cache %>',

                    '<%= pkg.directories.intermediates %>',

                    '<%= pkg.directories.resources %>/*',

                    '!<%= pkg.directories.resources %>/.git*'
                ]
            },

            intermediates: {
                dot: true,
                src: [
                    '<%= pkg.directories.intermediates %>/*',

                    // Keep processed images.
                    '!<%= pkg.directories.intermediates %>/' +
                    '<%= pkg.directories.images %>'
                ]
            },

            resources: {
                dot: true,
                src: [
                    '<%= pkg.directories.resources %>/*',

                    '!<%= pkg.directories.resources %>/.git*'
                ]
            }

        },

        // Launch a static web server.
        connect: {

            options: {
                hostname: '<%= pkg.config.hostname %>',
                open: false,
                port: '<%= pkg.config.port %>',
                protocol: '<%= pkg.config.protocol %>'
            },

            server: {
                options: {
                    base: [
                        '<%= pkg.directories.intermediates %>',

                        '<%= pkg.directories.intermediates %>/html',

                        '<%= pkg.name %>'
                    ],
                    livereload: true,
                }
            },

            resources: {
                options: {
                    base: [
                        '<%= pkg.directories.resources %>'
                    ],
                    livereload: false,
                }
            }

        },

        // Duplicate files and folders.
        copy: {

            resources: {
                files: [
                    {
                        cwd: '<%= pkg.name %>',
                        dest: '<%= pkg.directories.resources %>',
                        dot: true,
                        expand: true,
                        src: [
                            'CNAME',

                            '*.{ico,png,txt}',

                            '**/web-archive/**/*.*',

                            'v?/**/*.*',

                            '<%= pkg.directories.fonts %>/' +
                            '<%= pkg.config.globbing %>.*',

                            '<%= pkg.directories.images %>/' +
                            '<%= pkg.config.globbing %>.svg'
                        ]
                    },
                    {
                        cwd: '<%= pkg.directories.intermediates %>/html',
                        dest: '<%= pkg.directories.resources %>',
                        dot: true,
                        expand: true,
                        src: [
                            '<%= pkg.config.globbing %>.html'
                        ]
                    },
                    {
                        cwd: '<%= pkg.directories.intermediates %>/' +
                             '<%= pkg.directories.images %>',
                        dest: '<%= pkg.directories.resources %>/' +
                              '<%= pkg.directories.images %>',
                        dot: true,
                        expand: true,
                        src: [
                            '<%= pkg.config.globbing %>.{gif,jpeg,jpg,png}'
                        ]
                    }

                ]
            },

            scripts: {
                cwd: '<%= pkg.name %>/<%= pkg.directories.scripts %>',
                dest: '<%= pkg.directories.intermediates %>/' +
                      '<%= pkg.directories.scripts %>/',
                dot: true,
                expand: true,
                src: [
                    '<%= pkg.config.globbing %>.js'
                ]
            },

            stylesheets: {
                cwd: '<%= pkg.name %>/<%= pkg.directories.stylesheets %>',
                dest: '<%= pkg.directories.intermediates %>/' +
                      '<%= pkg.directories.stylesheets %>/',
                dot: true,
                expand: true,
                src: [
                    '<%= pkg.config.globbing %>.css'
                ]
            }

        },

        // Refresh file names for heavy caching.
        filerev: {

            options: {
                algorithm: 'sha1',
                encoding: 'utf8',
                length: '13'
            },

            files: {
                src: [
                    '<%= pkg.directories.resources %>/*.{ico,png}',

                    '!<%= pkg.directories.resources %>/**/web-archive/**/*.*',

                    '!<%= pkg.directories.resources %>/v?/**/*.*',

                    '<%= pkg.directories.resources %>/' +
                    '<%= pkg.directories.fonts %>/' +
                    '<%= pkg.config.globbing %>.*',

                    '<%= pkg.directories.resources %>/' +
                    '<%= pkg.directories.images %>/' +
                    '<%= pkg.config.globbing %>.*',

                    '<%= pkg.directories.resources %>/' +
                    '<%= pkg.directories.scripts %>/' +
                    '<%= pkg.config.globbing %>.js',

                    '<%= pkg.directories.resources %>/' +
                    '<%= pkg.directories.stylesheets %>/' +
                    '<%= pkg.config.globbing %>.css'
                ]
            }

        },

        // Minify HTML.
        htmlmin: {

            options: {
                // Treat attributes in case sensitive manner.
                caseSensitive: true,
                // Omit attribute values from boolean attributes.
                collapseBooleanAttributes: true,
                // Collapse white space that contributes to text
                // nodes in a document tree.
                collapseWhitespace: true,
                // Keep the trailing slash on singleton elements.
                keepClosingSlash: false,
                // Minify CSS in style elements and style attributes.
                minifyCSS: true,
                // Minify Javascript in script elements and on
                // attributes. (true, false, Object (options))
                minifyJS: true,
                // Remove quotes around attributes when possible.
                removeAttributeQuotes: false,
                // Remove CDATA sections from script and style
                // elements.
                removeCDATASectionsFromCDATA: true,
                // Strip HTML comments.
                removeComments: true,
                // Strip HTML comments from scripts and stylesheets.
                removeCommentsFromCDATA: true,
                // Remove all attributes with whitespace-only values.
                removeEmptyAttributes: true,
                // Remove all elements with empty contents.
                removeEmptyElements: false,
                // Remove unrequired tags.
                removeOptionalTags: false,
                // Remove attributes when value matches default.
                removeRedundantAttributes: true,
                // Replaces the doctype with the short doctype.
                useShortDoctype: false
            },

            files: {
                cwd: '<%= pkg.directories.resources %>',
                dest: '<%= pkg.directories.resources %>',
                expand: true,
                src: [
                    '<%= pkg.config.globbing %>.html',

                    '!**/web-archive/**/*.*'
                ]
            }

        },

        // Optimize images. Convert JPGs to progressive JPGs.
        imagemin: {

            options: {
                optimizationLevel: 7
            },

            files: {
                cwd: '<%= pkg.name %>/<%= pkg.directories.images %>',
                dest: '<%= pkg.directories.intermediates %>/' +
                      '<%= pkg.directories.images %>',
                expand: true,
                src: [
                    '<%= pkg.config.globbing %>.{gif,jpeg,jpg,png}'
                ]
            }

        },

        // Validate JavaScript.
        jshint: {

            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },

            files: [
                'Gruntfile.js',

                '<%= pkg.directories.intermediates %>/' +
                '<%= pkg.directories.scripts %>/<%= pkg.config.globbing %>.js',

                '!<%= pkg.directories.intermediates %>/' +
                '<%= pkg.directories.scripts %>/vendor/*'
            ]

        },

        // Optimize feature detection for HTML5 and CSS.
        modernizr: {

            files: {

                // Path to the build you're using for development.
                devFile: '<%= pkg.directories.intermediates %>/' +
                         '<%= pkg.directories.scripts %>/' +
                         'vendor/modernizr-dev.js',

                // Path to save out the built file.
                outputFile: '<%= pkg.directories.resources %>/'+
                            '<%= pkg.directories.scripts %>/' +
                            'vendor/modernizr-custom.js',

                // By default, source is uglified before saving
                uglify: true,

                // Define any tests you want to implicitly include.
                tests: [],

                // When parseFiles = true, this task will crawl all
                // *.js, *.css, *.scss files, except files that are in
                // node_modules/.
                files: {
                    src: [
                        '<%= pkg.directories.resources %>/' +
                        '<%= pkg.directories.scripts %>/' +
                        '<%= pkg.config.globbing %>.js',

                        '<%= pkg.directories.resources %>/' +
                        '<%= pkg.directories.stylesheets %>/' +
                        '<%= pkg.config.globbing %>.css',

                        '!<%= pkg.directories.resources %>/' +
                        '<%= pkg.directories.scripts %>/vendor/*'
                    ]
                }

            }

        },

        // Restrict task to new or modified files.
        newer: {

            options: {
                cache: '<%= pkg.directories.cache %>'
            }

        },

        // Append HTML partials.
        processhtml: {

            options: {
                commentMarker: 'process',
                includeBase: '<%= pkg.name %>/<%= pkg.directories.partials %>',
                recursive: true
            },

            files: {
                cwd: '<%= pkg.name %>',
                dest: '<%= pkg.directories.intermediates %>/html',
                expand: true,
                src: [
                    '<%= pkg.config.globbing %>.html',

                    '!<%= pkg.directories.partials %>/*',

                    '!**/web-archive/**/*.*',

                    '!v?/**/*.*'
                ]
            }

        },

        // Search HTML for usemin blocks to enable smart builds that
        // automatically concat, minify and refresh files.
        useminPrepare: {

            options: {

                // Base directory for transformed files.
                dest: '<%= pkg.directories.resources %>',

                // Workflow.
                flow: {
                    steps: {
                        'js': [
                            'concat',
                            'uglifyjs'
                        ],
                        'css': [
                            'concat',
                            'cssmin'
                        ]
                    },
                    post: {}
                },

                // Root directory from which files will be resolved.
                root: '<%= pkg.directories.intermediates %>',

                // Base directory for temporary (concatenated) files.
                staging: '<%= pkg.directories.intermediates %>'

            },

            // Single target, no directory.
            html: '<%= pkg.directories.intermediates %>/html/index.html'

        },

        // Refresh HTML with files from the useminPrepare configuration.
        usemin: {

            options: {
                assetsDirs: [
                    '<%= pkg.directories.resources %>',
                    '<%= pkg.directories.resources %>/' +
                    '<%= pkg.directories.images %>'
                ]
            },

            css: [
                '<%= pkg.directories.resources %>/' +
                '<%= pkg.directories.stylesheets %>/' +
                '<%= pkg.config.globbing %>.css'
            ],

            html: [
                '<%= pkg.directories.resources %>/' +
                '<%= pkg.config.globbing %>.html',

                '!**/web-archive/**/*.*',

                '!v?/**/*.*'
            ]

        },

        // Validate HTML.
        validation: {

            options: {
                charset: 'utf-8',
                doctype: 'HTML5',
                path: '<%= pkg.directories.cache %>/validation-status.json',
                relaxerror: [
                    'Bad value X-UA-Compatible for attribute ' +
                    'http-equiv on element meta.',
                    'The seamless attribute on the iframe element is not ' +
                    'supported by browsers yet. It would probably be better ' +
                    'to wait for implementations.'
                ],
                reportpath: '<%= pkg.directories.cache %>/' +
                            'validation-report.json',
                reset: true,
                stoponerror: false
            },

            files: {
                src: [
                    '<%= pkg.directories.intermediates %>/html/' +
                    '<%= pkg.config.globbing %>.html',
                ]
            }

        },

        // Launch tasks when files are created, modified or removed.
        watch: {

            options: {
                dateFormat: function (time) {
                    grunt.log.writeln(String(
                        'Task completed in ' +
                        time.toFixed(3) + 's').green +
                         ' - ' +
                         'Waiting...');
                }
            },

            html: {
                options: {
                    event: 'all',
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= pkg.name %>/<%= pkg.config.globbing %>.html',
                    '!<%= pkg.name %>/<%= pkg.directories.partials %>/*'
                ],
                tasks: [
                    'newer:processhtml'
                ]
            },

            other: {
                options: {
                    event: 'all',
                    livereload: '<%= connect.server.options.livereload %>'
                },
                files: [
                    '<%= pkg.name %>/<%= pkg.directories.fonts %>/' +
                    '<%= pkg.config.globbing %>',

                    '<%= pkg.name %>/<%= pkg.directories.images %>/' +
                    '<%= pkg.config.globbing %>',

                    '<%= pkg.directories.intermediates %>/' +
                    '<%= pkg.directories.stylesheets %>/' +
                    '<%= pkg.config.globbing %>.css'
                ]

            },

            partials: {
                options: {
                    event: 'all',
                    livereload: true,
                    spawn: false
                },
                files: [
                    '<%= pkg.name %>/' +
                    '<%= pkg.directories.partials %>/' +
                    '<%= pkg.config.globbing %>.html'
                ],
                tasks: [
                    'processhtml'
                ]
            },

            scripts: {
                options: {
                    atBegin: true,
                    // debounceDelay: 500,
                    event: 'all',
                    // interrupt: false,
                    livereload: true
                    // spawn: false
                },
                files: [
                    'jshintrc',

                    '<%= pkg.name %>/<%= pkg.directories.scripts %>/' +
                    '<%= pkg.config.globbing %>.js'
                ],
                tasks: [
                    'copy:scripts',
                    'jshint'
                ]
            },

            stylesheets: {
                options: {
                    // Do not process deleted files. Can we set a
                    // separate watch task for this?
                    event: [ 'added', 'changed' ],
                    livereload: false
                },
                // We watch and compile files as normal but don't live
                // reload here.
                files: [
                    '<%= pkg.name %>/' +
                    '<%= pkg.directories.stylesheets %>/' +
                    '<%= pkg.config.globbing %>.css'
                ],
                tasks: [
                    'newer:copy:stylesheets',

                    'autoprefixer'
                ]
            },


        }

    });

    // Use for development.
    // Append HTML partials. Append vendor preprefixes to CSS. Launch a
    // static web server. Launch tasks when files are created, modified
    // or removed.
    grunt.registerTask('develop', [

        'clean:intermediates',
        'processhtml',
        'copy:stylesheets',
        'autoprefixer',
        'connect:server',
        'watch'

    ]);

    // Use to build for staging and deploying to production.
    // Append HTML partials. Append vendor preprefixes to CSS. Optimize
    // images. Convert JPGs to progressive JPGs. Concat and minify
    // stylesheets and scripts. Duplicate files and folders. Refresh
    // file names for heavy caching. Refresh HTML with processed files.
    // Minify HTML. Validate HTML. Remove files and folders in
    // intermediates.
    grunt.registerTask('build', [

        'clean:intermediates',
        'clean:resources',
        'processhtml',
        'copy:scripts',
        'copy:stylesheets',
        'autoprefixer',
        'useminPrepare',
        'newer:imagemin',
        'concat',
        'cssmin',
        'uglify',
        'copy:resources',
        'modernizr',
        'filerev',
        'usemin',
        'htmlmin',
        'clean:intermediates',

    ]);

    // Use to test before deploying to production.
    // Launch a static web server.
    grunt.registerTask('stage', [

        'build',
        'connect:resources:keepalive'

    ]);

    // Deploy task.
    // Take everything from build and push it...
    grunt.registerTask('deploy', [

        'build',
        'buildcontrol'

    ]);

};
