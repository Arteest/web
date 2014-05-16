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
                    "public/stylesheets/style.css": "public/stylesheets/style.less"
                }
            }
        },
        watch: {
            styles: {
                files: ['public/stylesheets/*.less'],
                tasks: ['less'],
                options: {
                    spawn: true
                }
            }
        },
        copy: {
            main: {
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
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
 
    grunt.registerTask('default', ['copy', 'watch']);
};