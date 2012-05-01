/**
 * Gruntfile
 * 
 */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Project meta information.
    dir: {// directories
      apidoc: 'docs/api',
      dist: 'dist',
      src: 'src',
      test: 'test'
    },
    pkg: '<json:package.json>',
    sdk: {
      html5: '<%= pkg.name %>-js-<%= pkg.version %>',// HTML5 dist filename,
      node: '<%= pkg.name %>-nodejs-<%= pkg.version %>'// node dist filename
    },
    meta: {
      banner: [// sdk will be prefixed with this banner
        '/*!',
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> Kinvey, Inc. All rights reserved.',
        ' *',
        ' * Licensed to Kinvey, Inc. under one or more contributor',
        ' * license agreements.  See the NOTICE file distributed with',
        ' * this work for additional information regarding copyright',
        ' * ownership.  Kinvey, Inc. licenses this file to you under the',
        ' * Apache License, Version 2.0 (the "License"); you may not',
        ' * use this file except in compliance with the License.  You',
        ' * may obtain a copy of the License at',
        ' *',
        ' *         http://www.apache.org/licenses/LICENSE-2.0',
        ' *',
        ' * Unless required by applicable law or agreed to in writing,',
        ' * software distributed under the License is distributed on an',
        ' * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY',
        ' * KIND, either express or implied.  See the License for the',
        ' * specific language governing permissions and limitations',
        ' * under the License.',
        ' */'
      ].join("\n")
    },

    // Specify lint task.
    lint: {
      beforeconcat: ['grunt.js', 'lib/grunt/**/*.js', '<%= dir.src %>/**/*.js', '<%= dir.test %>/**/*.js' ],
      afterconcat: [ '<%= dir.dist %>/<%= sdk %>.js' ]
    },
    jshint: {//http://www.jshint.com/options/
      options: {
        curly: true,//require { }
        eqeqeq: true,//=== instead of ==
        immed: true,//wrap IIFE in parentheses
        latedef: true,//variable declared before usage
        newcap: true,//capitalize class names
        noarg: true,//forbids arguments.calle(e/r)
        undef: true,//checks for undefined variables

        eqnull: true,//== allowed for undefined/null checking
        expr: true,//allow foo && foo()

        node: true//node environment
      },
      globals: {
        // Library globals.
        Kinvey: true,
        Base: true,
        bind: true,
        Storage: true,

        // Test globals.
        after: true,
        afterEach: true,
        before: true,
        beforeEach: true,
        callback: true,
        describe: true,
        it: true,
        mocha: true,
        COLLECTION_UNDER_TEST: true
      }
    },

    // Specify concatenation task.
    concat: {
      html5: {
        src: [
          '<banner>',
          '<%= dir.src %>/intro.txt',
          '<%= dir.src %>/Storage.js',
          '<%= dir.src %>/Kinvey.js',
          '<%= dir.src %>/net/Net.js',
          '<%= dir.src %>/net/Http.js',
          '<%= dir.src %>/Entity.js',
          '<%= dir.src %>/Collection.js',
          '<%= dir.src %>/User.js',
          '<%= dir.src %>/UserCollection.js',
          '<%= dir.src %>/query/Query.js',
          '<%= dir.src %>/query/MongoBuilder.js',
          '<%= dir.src %>/aggregation/Aggregation.js',
          '<%= dir.src %>/aggregation/MongoBuilder.js',
          '<%= dir.src %>/outro.txt'
        ],
        dest: '<%= dir.dist %>/<%= sdk.html5 %>.js'
      },
      node: {
        src: [
          '<banner>',
          '<%= dir.src %>/intro.txt',
          '<%= dir.src %>/Storage.node.js',
          '<%= dir.src %>/Kinvey.js',
          '<%= dir.src %>/net/Net.js',
          '<%= dir.src %>/net/Http.js',
          '<%= dir.src %>/net/Node.js',
          '<%= dir.src %>/Entity.js',
          '<%= dir.src %>/Collection.js',
          '<%= dir.src %>/User.js',
          '<%= dir.src %>/UserCollection.js',
          '<%= dir.src %>/query/Query.js',
          '<%= dir.src %>/query/MongoBuilder.js',
          '<%= dir.src %>/aggregation/Aggregation.js',
          '<%= dir.src %>/aggregation/MongoBuilder.js',
          '<%= dir.src %>/outro.txt'
        ],
        dest: '<%= dir.dist %>/<%= sdk.node %>.js'
      }
    },

    // Specify replace task.
    replace: {
      html5FirstPass: {//remove IIFE from source files
        src: '<%= dir.dist %>/<%= sdk.html5 %>.js',
        find: /^(\(function\(\) \{)$|^(\}\(\)\)\;)$/gm
      },
      html5SecondPass: {//remove gaps in newlines caused by firstPass
        src: '<%= dir.dist %>/<%= sdk.html5 %>.js',
        find: /\n{3,}/g,
        replace: '\n\n'
      },
      html5ThirdPass: {//remove newline below <banner>
        src: '<%= dir.dist %>/<%= sdk.html5 %>.js',
        find: /\n(\(function\(undefined\) \{)/g,
        replace: '$1'
      },
      html5Arg: {
        src: '<%= dir.dist %>/<%= sdk.html5 %>.min.js',
        find: /^\(function\(a\)/m,
        replace: '(function(undefined)'
      },

      nodeFirstPass: {//remove IIFE from source files
        src: '<%= dir.dist %>/<%= sdk.node %>.js',
        find: /^(\(function\(\) \{)$|^(\}\(\)\)\;)$/gm
      },
      nodeSecondPass: {//remove gaps in newlines caused by firstPass
        src: '<%= dir.dist %>/<%= sdk.node %>.js',
        find: /\n{3,}/g,
        replace: '\n\n'
      },
      nodeThirdPass: {//remove newline below <banner>
        src: '<%= dir.dist %>/<%= sdk.node %>.js',
        find: /\n(\(function\(undefined\) \{)/g,
        replace: '$1'
      }
    },

    filter: {
      html5: {
        src: '<%= dir.dist %>/<%= sdk.html5 %>.js'
      },
      node: {
        src: '<%= dir.dist %>/<%= sdk.node %>.js'
      }
    },

    // Specify Mocha test task.
    mocha: {
      test: {
        require: ['<%= dir.test %>/spec.js'],
        src: ['<%= dir.test %>/**/*.spec.js']
      }
    },
    mochaOptions: {
      timeout: 10000// 10s
    },

    // Specify minification task.
    min: {
      html5: {
        src: [ '<banner>', '<%= dir.dist %>/<%= sdk.html5 %>.js' ],
        dest: '<%= dir.dist %>/<%= sdk.html5 %>.min.js'
      }
    },

    // Specify JSDoc task.
    jsdoc: {
      core: {
        src: '<%= dir.dist %>/<%= sdk.html5 %>.js',
        dest: '<%= dir.apidoc %>'
      }
    },

    // Specify watch task.
    watch: {
      files: ['grunt.js', 'lib/grunt/**/*.js', '<%= dir.src %>/**/*.js'],
      tasks: 'default',

      test: {
        files: '<%= dir.test %>/**/*.js',
        tasks: 'test'
      }
    },

    // Specify clean task.
    clean: {
      files: ['<%= dir.apidoc %>', '<%= dir.dist %>']
    }
  });

  // Load task plugins.
  grunt.loadTasks('lib/grunt/tasks');

  // Register tasks.
  grunt.registerTask('default', 'build test minify doc');

  grunt.registerTask('build', 'lint:beforeconcat pack lint:afterconcat');
  grunt.registerTask('doc', 'jsdoc');
  grunt.registerTask('minify', 'min replace:html5Arg');
  grunt.registerTask('pack', 'concat replace:html5FirstPass replace:nodeFirstPass replace:html5SecondPass replace:nodeSecondPass replace:html5ThirdPass replace:nodeThirdPass filter');
  grunt.registerTask('test', 'mocha');
};