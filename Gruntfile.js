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
        src: ['**/*.js', '!**/tests/**', '!sample-server/**'], // Actual pattern(s) to match.
        dest: 'build/',   // Destination path prefix.
        ext: '.js',   // Dest filepaths will have this extension.
        extDot: 'first'   // Extensions in filenames begin after the first dot
      }
    },
    clean: {
      options: { force: true },
      build: ['build'],
      'test-results': ['test-results']
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
          captureFile: 'test-results/test-results.txt', // Optionally capture the reporter output to a file 
        },
        src: ['src/**/tests/**/*.js']
      }
    },
    mocha_istanbul: {
      coverage: { // no capturing of mocha output with the coverage tool
          src: ['src/**/tests/**/*.js'],
          options: {
              coverageFolder: 'test-results/coverage'
          }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*',
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    },
    antlr4: {
      filter: {
        grammar: ['src/query/antlr/Filter.g4'],
        options: {
            o: 'src/query/antlr/generated',
            grammarLevel: {
                language: 'JavaScript'
            },
            flags: [
            ]
        },
      },
      sort: {
        grammar: ['src/query/antlr/Sort.g4'],
        options: {
            o: 'src/query/antlr/generated',
            grammarLevel: {
                language: 'JavaScript'
            },
            flags: [
            ]
        },
      }
    },
    replace: {
      build: {
        src: ['package.json'],
        dest: 'build/',
        replacements: [{
          from: 'src/index.js',
          to: 'index.js'
        }]
      }
    },
    release: {
      options: {
        'beforeBump': null,
        'bump': null,
        'afterBump': null,
        'beforeRelease': null,
        'changelog': null,
        'add': null,
        'commit': null,
        'tag': null,
        'push': null,
        'pushTags': null,
        npm: true,        
        //npmtag: true, //default: no tag 
        folder: 'build', 
        'github': null,
        'afterRelease': null
      }
    }
  });
  
  grunt.event.on('coverage', function(lcovFileContents, done){
      done();
  });
 
  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-antlr4');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-release');

  // Create & configure tasks
  grunt.registerTask('default', ['clean:test-results', 'coverage', 'clean:build', 'uglify', 'replace:build', 'jsdoc']);  
  grunt.registerTask('tests', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

};