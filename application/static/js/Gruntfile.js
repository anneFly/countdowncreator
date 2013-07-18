/**
 * (http://gruntjs.com/sample-gruntfile)
 *
 * How to use this: go to your command line and navigate to the directory of THIS file.
 * Then type 'npm install && grunt build'. If you have node.js installed, this should work.
 *
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // concatenate files
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {

            app: {
                 files: [
                    { src:  ['app/utils.js', 'app/ui.js'],
                      dest: 'app.js',
                      nonull: true }
                ]
            }

        },

        // minify js files
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            app: {
              files: {
                'min/app.min.js': ['app.js']
              }
            }
        },

        // Listen for changes in JS files
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            scripts: {
                files: ['app/*.js'],
                tasks: ['concat', 'jshint'],
                options: {
                    nospawn: true
                }
            }
        },

        // Linting for JavaScript
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            options:     {
                "camelcase": true,
                "undef": false,
                "unused": false,
                "eqeqeq": true,
                "immed": false,
                "indent": false,
                "quotmark": "single",
                "trailing": true,
                "maxparams": 10,
                "maxdepth": 3,
                "maxstatements": 10,
                "browser": true,
                "maxlen": 120,
                "maxcomplexity": 13,
                "globals": {
                    "MY_GLOBAL": false
                 },
                "predef" : [
                    "$", "jQuery", "_", "console", "window", "document"
                ]
            },
            all: ['app/**/*.js']
        }

    });

    // load grunt modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // make it hcustomen that 'grunt build' works on the command line
    grunt.registerTask('build', [ 'jshint', 'concat', 'uglify']);


};
