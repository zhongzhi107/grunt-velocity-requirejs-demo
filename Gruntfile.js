/**
* @fileOverview Gruntfile
* @author <a href="mailto:zhong.zhi@163.com">Zhongzhi</a>
* @version 0.0.1
*  Add time-grunt/jshint-style 2014/1/29
* @example
*   > grunt --gruntfile=/home/webapp/src/Gruntfile.js --node-modules=/home/zhi.zhong
*   // --gruntfile: 指定Gruntfile.js文件的位置，在项目根目录外运行Grunt会用到该参数
*   // --node-modules: 指定开发环境依赖包的位置，只需要指定到node_modules父目录即可
*                      使用该参数便于在同一机器上运行多个分支时共享依赖包
*   // --deploy-type: 指定当前编译类型，取值可能是dev/beta/prod/prepare,分别对应的是dev/QA/正式/灰度发布
*
*   server命令参数
*   > grunt server --host=localhost --port=9001
*   // --host: 指定自动打开浏览器的域名，默认值：localhost
*   // --port: 指定自动打开浏览器的端口号，默认值：9000
*
*   server命令控制开关，可以单独使用
*   > grunt server:nobuild:noopen:norewrite
*   // :nobuild 禁止编译功能，直接预览已经编译好的文件
*   // :noopen  禁止自动启动浏览器功能
*   // :norewrite 禁止地址转发功能
*
*   预览编译后的文件
*   > grunt server --dist=true
*
*/

'use strict';

module.exports = function (grunt) {
  // 定义编译类型，并将其存入运行环境变量中
  process.env.DEPLOY_TYPE = grunt.option('deploy-type') || '';

  // node_modules父目录
  var nodeModulesDir = grunt.option('node-modules') || '.';

  // 非开发模式加载dependencies下的包
  //var filterFunction = 'filter';

  // // 开发模式加载全部依赖
  // if (process.env.DEPLOY_TYPE === '') {
  //   // var routeUtils = 'grunt-connect-route/lib/utils';
  //   // if (nodeModulesDir) {
  //   //   routeUtils = nodeModulesDir + '/node_modules/' + routeUtils;
  //   // }
  //   // var rewriteRulesSnippet = require(routeUtils).rewriteRequest;
  //   filterFunction = 'filterAll';
  // }

  // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('matchdep').filterAll('grunt-*').forEach(function(nodeModule) {
    if (nodeModulesDir) {
      var cwd = process.cwd();
      process.chdir(nodeModulesDir);
      grunt.loadNpmTasks(nodeModule);
      process.chdir(cwd);
    } else {
      grunt.loadNpmTasks(nodeModule);
    }
  });

  // 各模块运行所消耗的时间，可以用来指导优化编译过程
  require(nodeModulesDir + '/node_modules/' + 'time-grunt')(grunt);

  // 加载项目配置
  var configApp = require('./config/app');
  // 路径配置
  var appConfig = configApp.path;

  // Grunt configuration
  var config = {

    // 路径配置
    yo: appConfig,

    bower: require('./config/grunt/bower'),

    /**
    * Run predefined tasks whenever watched file patterns are added, changed or deleted.
    */
    watch: require('./config/grunt/watch'),

    // velocity模版解析
    velocity: require('./config/grunt/velocity'),

    /**
    * Start a connect web server.
    */
    connect: require('./config/grunt/connect')(grunt),

    /**
    * Clean files and folders.
    */
    clean: require('./config/grunt/clean'),

    /**
    * Validate files with JSHint.
    */
    jshint: require('./config/grunt/jshint'),

    /**
    * Copy files and folders.
    */
    copy: require('./config/grunt/copy'),

    // r.js打包配置
    requirejs: require('./config/grunt/requirejs')(grunt),

    /**
    * Minify PNG and JPEG images.
    */
    imagemin: require('./config/grunt/imagemin'),

    /**
    * Compile LESS files to CSS.
    */
    less: require('./config/grunt/less'),

    /**
    * Parse CSS and add prefixed properties and values by Can I Use database
    * for actual browsers. Based on Autoprefixer.
    */
    autoprefixer: require('./config/grunt/autoprefixer'),

    /**
    * Minify files with UglifyJS.
    */
    uglify: require('./config/grunt/uglify'),

    /**
    * Compress CSS files.
    */
    cssmin: require('./config/grunt/cssmin'),

    /**
    * prepares the configuration to transform specific blocks in the scrutinized file into a single line,
    * targeting an optimized version of the files.
    * This is done by generating subtasks called generated for every
    * optimization steps handled by the Grunt plugins listed below.
    */
    useminPrepare: require('./config/grunt/usemin-prepare'),

    /**
    * Replaces references from non-optimized scripts, stylesheets and other assets
    * to their optimized version within a set of HTML files (or any templates/views).
    * homepage: https://github.com/yeoman/grunt-usemin
    */
    usemin: require('./config/grunt/usemin')(),

    /**
     * Converting a set of images into a spritesheet
     * and corresponding CSS variables.
     */
    sprite: require('./config/grunt/sprite'),

    /**
    * Static file asset revisioning through content hashing
    */
    rev: require('./config/grunt/rev'),

  };

  // The initialization of Grunt configuration parameters
  grunt.initConfig(config);

  // Registration start a local web server tasks
  grunt.registerTask('server', function ()    {
    var args = Array.prototype.slice.call(arguments, 0);
    var tasks = [];

    // Compile and preview the compiled result
    if (grunt.option('dist')) {
      tasks = [
        'build',
        'configureRewriteRules',
        'connect:dist:keepalive'
      ];
    } else {
      tasks = [
        'clean:server',
        'less:dev',
        'autoprefixer:dev'
      ];
      if (args.indexOf('norewrite') === -1) {
        tasks.push('configureRewriteRules');
      }
      tasks.push('connect:livereload');
      // if (args.indexOf('noopen') === -1) {
      //     tasks.push('open');
      // }
      tasks.push('watch');
    }

    grunt.task.run(tasks);
  });

  // 注册代码编译任务
  grunt.registerTask('build', [
    'clean:dist',
    //'jshint',
    'copy:css',
    'copy:js',
    'copy:others',
    'imagemin',
    'copy:image',
    'useminPrepare',
    'less:dist',
    'autoprefixer:dist',
    'concat',
    'requirejs',
    'uglify',
    'cssmin',
    'rev:dist',
    'copy:vm',
    'usemin',
  ]);

  // 注册Grunt默认任务
  grunt.registerTask('default', [
    'build'
  ]);
};
