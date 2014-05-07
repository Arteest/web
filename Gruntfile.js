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
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    grunt.registerTask('default', ['watch']);
};