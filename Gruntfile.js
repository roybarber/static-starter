'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var fs = require('fs');

module.exports = function (grunt) {
    
    var yeomanConfig = {
        app: 'htdocs',
        deploy: 'htdocs'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        
        connect: {
            options: {
                port: 4000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            }
        },
        
        open: {
            server: {
                path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
            }
        },

        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/sass',
                cssDir: '<%= yeoman.app %>/css',
                imagesDir: '<%= yeoman.app %>/img',
                javascriptsDir: '<%= yeoman.app %>/js'
            },
            dev: {
	        	force: true,
                debugInfo: true,
                outputStyle: 'compact'  
            }
        },
        
        jshint: {
			files: ['<%= compass.options.javascriptsDir %>/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
			        module: true, 
			        document: true
				},
				reporter: require('jshint-stylish')
			}
		},
		
		watch: {
			compass: {
                files: ['<%= compass.options.sassDir %>/{,*/}*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '<%= compass.options.cssDir %>/{,*/}*.css',
                    '<%= compass.options.javascriptsDir %>/{,*/}*.js',
                    '<%= compass.options.imagesDir %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['jshint']
            }
        }

    });
    
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-reload");
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-concurrent');
    
    grunt.registerTask('default', ['jshint','connect:livereload','open','watch']);
};
