module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    cleancss: true,
                    optimization: 2
                },
                files: {
                    "public/stylesheets/base.css": "public/stylesheets/base.less",
                    "public/stylesheets/style.css": "public/stylesheets/style.less",
                    "public/stylesheets/index.css": "public/stylesheets/index.less"
                }
            }
        },
        watch: {
            less: {
                files: ['public/stylesheets/*.less'],
                tasks: ['less'],
                options: {
                    spawn: true
                }
            },
            cssmin: {
                files: ['public/stylesheets/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: true
                }
            },
            js: {
                files: ['public/javascripts/*.js', 'public/javascripts/*.map'],
                tasks: ['uglify'],
                options: {
                    spawn: true
                }                
            }
        },
        copy: {
            development: {
                files: [
                    {cwd: 'bower_components/jquery/dist/', src: 'jquery.min.js', expand: 'true', dest: 'public/javascripts/'},
                    {cwd: 'bower_components/bootstrap/dist/js/', src: 'bootstrap.min.js', expand: 'true', dest: 'public/javascripts/'},
                    {cwd: 'bower_components/bootstrap/dist/css/', src: 'bootstrap.min.css', expand: 'true', dest: 'public/stylesheets/'},
                    {cwd: 'bower_components/bootstrap/dist/css/', src: 'bootstrap-theme.min.css', expand: 'true', dest: 'public/stylesheets/'},
                    {cwd: 'bower_components/bootstrap/dist/fonts/', src: 'glyphicons-halflings-regular.eot', expand: 'true', dest: 'public/fonts/'},
                    {cwd: 'bower_components/bootstrap/dist/fonts/', src: 'glyphicons-halflings-regular.svg', expand: 'true', dest: 'public/fonts/'},
                    {cwd: 'bower_components/bootstrap/dist/fonts/', src: 'glyphicons-halflings-regular.ttf', expand: 'true', dest: 'public/fonts/'},
                    {cwd: 'bower_components/bootstrap/dist/fonts/', src: 'glyphicons-halflings-regular.woff', expand: 'true', dest: 'public/fonts/'}
                ]
            },
        },
        uglify: {
            development: {
                files: {
                    'public/dist/javascripts.min.js': 
                    [
                        'public/javascripts/jquery.min.js',
                        'public/javascripts/bootstrap.min.js',                        
                        'public/javascripts/actions.js',                        
                        'public/javascripts/draw.js',                        
                        'public/javascripts/tools.js',
                        'public/javascripts/setup.js'
                    ]
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            combine: {
                files: {
                    'public/dist/stylesheets.min.css': 
                    [
                        'public/stylesheets/bootstrap.min.css',
                        'public/stylesheets/bootstrap-theme.min.css',
                        'public/stylesheets/base.css',                        
                        'public/stylesheets/style.css',                        
                        'public/stylesheets/index.css'
                    ]
                }
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
 
    grunt.registerTask('default', ['copy', 'watch']);
};