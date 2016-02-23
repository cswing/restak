module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {

        expand: true,     // Enable dynamic expansion.
        cwd: 'src/',      // Src matches are relative to this path.
        src: ['**/*.js'], // Actual pattern(s) to match.
        dest: 'build/',   // Destination path prefix.
        ext: '.js',   // Dest filepaths will have this extension.
        extDot: 'first'   // Extensions in filenames begin after the first dot
      }
    },
    clean: {
      options: { force: true },
      build: ['build'],
      release: ['../../release/<%= pkg.name %>-<%= pkg.version %>/**/*']
    },
    copy: {
      'release-scripts': {
        cwd: 'build/',
        src: '**/*',
        dest: '../../release/<%= pkg.name %>-<%= pkg.version %>',
        expand: true
      },
      'release-config': {
        cwd: 'src/',
        src: ['**/*.properties', '**/log4js.json'],
        dest: '../../release/<%= pkg.name %>-<%= pkg.version %>/',
        expand: true
      },
      'release-modules': {
        cwd: 'node_modules/',
        src: '**/*',    
        dest: '../../release/<%= pkg.name %>-<%= pkg.version %>/node_modules',
        expand: true
      }
    },
    jsdoc : {
        dist : {
            src: ['src/**/*.js', 'README.md', '!src/sample-server/**/*.js'],
            options: {
                destination: 'build/doc',
                template : "node_modules/ink-docstrap/template",
                configure : "jsdoc.conf.json"
            }
        }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'build/test-results.txt', // Optionally capture the reporter output to a file 
          quiet: false, // Optionally suppress output to standard out (defaults to false) 
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
        },
        src: ['src/**/tests/**/*.js']
      }
    },
    antlr4: {
      generate: {
        grammar: 'src/query/antlr/Query.g4',
        options: {
            o: 'src/query/antlr/generated',
            grammarLevel: {
                language: 'JavaScript'
            },
            flags: [
            ]
        },
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-antlr4');

  // Create & configure tasks
  grunt.registerTask('default', ['clean:build', 'mochaTest', 'uglify']);
  grunt.registerTask('release', ['uglify', 'clean:release', 'copy']);
  grunt.registerTask('tests', ['mochaTest']);

};