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
 *   // :dist 编译并预览编译后的文件
 *   // :nobuild 禁止编译功能，直接预览已经编译好的文件
 *   // :noopen  禁止自动启动浏览器功能
 *   // :norewrite 禁止地址转发功能
 *
 *   预览编译后的文件
 *   > grunt server --dist=true
 *
 */

'use strict';

var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

// livereload监听端口号
var LIVERELOAD_PORT = 35730;

// 初始化livereload
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

// 设置connect静态目录函数
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // node_modules父目录
    var nodeModulesDir = grunt.option('node-modules') || '.';

    // 拼grunt-connect-route utils.js地址
    var routeUtils = 'grunt-connect-route/lib/utils';
    if (nodeModulesDir) {
        routeUtils = nodeModulesDir + '/node_modules/' + routeUtils;
    }
    var rewriteRulesSnippet = require(routeUtils).rewriteRequest;

    // 加载node_modules下所有grunt开头的依赖模块
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

    // Time how long tasks take. Can help when optimizing build times
    require(nodeModulesDir + '/node_modules/' + 'time-grunt')(grunt);

    var configApp = require('./config/app');
    // 路径配置
    var appConfig = configApp.path;

    // 静态文件CDN域名的根目录
    // 编译发布时替换require.config.baseUrl
    var qzzDomain = configApp.cdnDomain;
    var cdnRoot;
    switch (grunt.option('deploy-type')) {
        case 'dev':
            cdnRoot = qzzDomain.dev;
            break;
        case 'beta':
            cdnRoot = qzzDomain.beta;
            break;
        case 'prepare':
        case 'prod':
            cdnRoot = qzzDomain.prod;
            break;
        default:
            cdnRoot = '';
            break;
    }

    // parse velocity template
    function velocityParser (req, res, next) {
        function requireUncached(module){
            delete require.cache[require.resolve(module)];
            return require(module);
        }

        var routerTemplate = requireUncached('./config/router-template');
        var url = require('url');
        var Engine = require('velocity/lib/engine');

        // parse VM template
        var urlObject = url.parse(req.url);
        var queryString = querystring.parse(urlObject.query);
        var template = routerTemplate[urlObject.pathname];
        var templateRoot = grunt.config('velocity.root.dev');
        if (grunt.option('dist')) {
            templateRoot = grunt.config('velocity.root.dist');
        }
        var templateAbsPath = path.join(templateRoot, template + '.' + grunt.config('velocity.ext'));

        if (fs.existsSync(templateAbsPath)) {
            var engine = new Engine({
                root: templateRoot,
                template: templateAbsPath
            });
            var contextFile = grunt.config('velocity.data.page') + template;
            var context = {};

            if (fs.existsSync(contextFile + '.js')) {
                try {
                    context = requireUncached(contextFile)(queryString);
                }
                catch (e) {
                    console.log('\n');
                    grunt.warn('File "' + contextFile + '.js" require failed.');
                }
            }
            var result = engine.render(context);
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            res.end(result);
        } else {
            next();
        }
    }

    function getModulesConfig(dir) {
        var excludeModules = [];
        var moduleConfig = require('./config/chunks') || {};
        var returnConfig = [];

        for (var key in moduleConfig) {
            returnConfig.push({
                name: key,
                include: moduleConfig[key]
            });
            excludeModules.push(key);
        }

        grunt.file.recurse(dir, function(abspath, rootdir, subdir, filename) {
            if (/page\d\.js/.test(filename)) {
                returnConfig.push({
                    name: (subdir ? subdir + '/' : '') + filename.replace('.js', ''),
                    exclude: excludeModules
                });
            }
        });
        return returnConfig;
    }

    // Grunt configuration
    var config = {

        // 路径配置
        yo: appConfig,

        locale: "en-us",

        /**
         * Run predefined tasks whenever watched file patterns are added, changed or deleted.
         */
        watch: {
            less: {
                files: [
                    // match all files ending with .less in the yo.app subdirectory
                    // and all of its subdirectories.
                    '<%=yo.app%>/static/css/**/*.less'
                ],
                tasks: ['newer:less:dev', 'newer:autoprefixer:dev']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%=velocity.root.dev%>/**/*.<%=velocity.ext%>',
                    '.tmp/static/css/**/*.css',
                    '<%=yo.app%>/static/css/**/*.css',
                    '!<%=yo.app%>/node_modules/**',
                    '<%=yo.app%>/**/*.{js,<%=velocity.ext%>,png,jpg,jpeg,gif,ttf,webp,svg}'
                ]
            }
        },

        velocity: {
            root: {
                dev: '<%=yo.app%>/vm',
                dist: '<%=yo.dist%>/vm',
            },
            data: {
                page: './<%=yo.app%>/data/page',
            },
            ext: 'vm'
        },

        /**
         * Start a connect web server.
         */
        connect: {
            rules: require('./config/router-api'),
            options: {
                port: grunt.option('port') || 9001,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0',
                //localhost: 'my.yo.com',
                localhost: grunt.option('host') || 'localhost',
            },
            livereload: {
                options: {
                    open: 'http://localhost:9001',
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, appConfig.app),
                            rewriteRulesSnippet,
                            velocityParser
                        ];
                    }
                }
            },
            dist: {
                livereload: false,
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, appConfig.dist),
                            rewriteRulesSnippet,
                            velocityParser
                        ];
                    }
                }
            },
        },

        /**
         * Clean files and folders.
         */
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%=yo.dist%>/*',
                        '!<%=yo.dist%>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        /**
         * Validate files with JSHint.
         */
        jshint: {
            // 指定检查或者排除检查的文件/目录列表
            all: [
                'Gruntfile.js',
                '<%=yo.app%>/static/**/*.js'//,
                //'!<%=yo.app%>/static/js/bower_components/**/*.js',
            ],
            options: {
                // 错误提示美化插件
                reporter: require('jshint-stylish'),
                // 校验规则
                jshintrc: 'config/jshintrc.js'
            },
        },

        /**
         * Copy files and folders.
         */
        copy: {
            dev: {
                expand: true,
                dot: true,
                cwd: '<%=yo.app%>/static',
                dest: '.tmp/concat/static',
                src: [
                    '**/*',
                    '!**/*.less'
                ]
            },
            css: {
                expand: true,
                dot: true,
                cwd: '<%=yo.app%>/static/css',
                dest: '.tmp/concat/static/css',
                src: [
                    '**/*',
                    '!**/*.less'
                ]
            },
            js: {
                expand: true,
                dot: true,
                cwd: '<%=yo.app%>/static/js',
                dest: '<%=yo.dist%>/static/js',
                src: '**/*.js'
            },
            // 将压缩后的图片拷贝到dist目录
            image: {
                expand: true,
                dot: true,
                cwd: '.tmp/concat/static',
                dest: '<%=yo.dist%>/static/',
                src: '**/*.{png,jpg,jpeg,gif,ttf}'
            },
            vm: {
                expand: true,
                cwd: '<%=velocity.root.dev%>',
                src: '**/*.vm',
                dest: '<%=velocity.root.dist%>'
            },
        },

        // r.js打包配置
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    appDir: '<%=yo.app%>/static/js',
                    baseUrl: '.',
                    paths: {
                        jquery: 'lib/jquery',
                        text: 'lib/text',
                        i18n: 'lib/i18n'
                    },
                    dir: '<%=yo.dist%>/static/js',
                    optimize: 'none',
                    findNestedDependencies: true,
                    inlineText: true,
                    removeCombined: true,
                    modules: getModulesConfig('app/static/js')
                }
            }
        },

        /**
         * Minify PNG and JPEG images.
         */
        imagemin: {
            all: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%=yo.app%>/static/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: '.tmp/concat/static/' // Destination path prefix
                }],
                tasks: ['copy:img']
            }
        },

        /**
         * Embedding images as base64 data URIs inside your stylesheets
         *
         * homepage:
         *   https://npmjs.org/package/grunt-image-embed
         */
        imageEmbed: {
            dist: {
                expand: true,
                cwd: '.tmp/concat/static/css',
                dest: '.tmp/concat/static/css',
                src: '**/*.css',
                options: {
                  // Specify a max image size. Default is 32768 (32kb is IE8's limit).
                  // maxImageSize: 0,
                  // Base directory if you use absolute paths in your stylesheet
                    //baseDir: '<%=yo.dist%>/static/css',
                    disableRemoteImage: true,
                }
            }
        },

        /**
         * Compile LESS files to CSS.
         */
        less: {
            dev: {
                expand: true,
                flatten: true,
                ext: '.css',
                src: '<%=yo.app%>/static/css/**/*.less',
                dest: '.tmp/static/css/'
            },
            dist: {
                expand: true,
                flatten: true,
                ext: '.css',
                src: '<%=yo.app%>/static/css/**/*.less',
                dest: '.tmp/concat/static/css/'
            }
        },

        /**
         * Parse CSS and add prefixed properties and values by Can I Use database
         * for actual browsers. Based on Autoprefixer.
         */
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dev: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: '.tmp/static/css/**/*.css',
                    dest: '.tmp/static/css/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: '.tmp/concat/static/css/**/*.css',
                    dest: '.tmp/concat/static/css/'
                }]
            }
        },

        /**
         * Minify files with UglifyJS.
         */
        uglify: {
            options: {
                //sourceMap: true,
                compress: {
                    // Remove console function
                    'drop_console': true,
                    // Set global JavaScript varible value when uglify compressing
                    'global_defs': {
                        DEBUG: false,
                        CDN_ROOT: cdnRoot
                    }
                }
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%=yo.dist%>/static/js/',
                    src: '**/*.js',
                    dest: '<%=yo.dist%>/static/js/',
                }]
            }
        },

        /**
         * Compress CSS files.
         */
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) css/main.css -->
            //
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/static/css/',
                    src: '**/*.css',
                    dest: '<%=yo.dist%>/static/css/',
                    //ext: '.min.css'
                }]
            }
        },

        /**
         * prepares the configuration to transform specific blocks in the scrutinized file into a single line,
         * targeting an optimized version of the files.
         * This is done by generating subtasks called generated for every
         * optimization steps handled by the Grunt plugins listed below.
         */
        useminPrepare: {
            options: {
                root: '<%=yo.app%>',
                dest: '<%=yo.dist%>'
            },
            // Entrance files to find usemin block
            html: '<%=velocity.root.dev%>/**/*.<%=velocity.ext%>'
        },

        /**
         * Replaces references from non-optimized scripts, stylesheets and other assets
         * to their optimized version within a set of HTML files (or any templates/views).
         * homepage: https://github.com/yeoman/grunt-usemin
         */
        usemin: {
            // look under this files
            css: '<%=yo.dist%>/static/css/**/*.css',
            html: '<%=velocity.root.dist%>/**/*.<%=velocity.ext%>',
            js: '<%=yo.dist%>/static/js/**/*.js',
            options: {
                // Single item array set to the value of the directory where the currently looked at file is.
                assetsDirs: ['<%=yo.dist%>', '<%=yo.dist%>/static/js', '<%=yo.dist%>/static/css'],
                // Extend default settings to support CDN url.
                patterns: require('./config/usemin').pattern(cdnRoot)
            }
        },

        /**
         * Static file asset revisioning through content hashing
         */
        rev: {
            dist: {
                files: {
                    src: [
                    '<%=yo.dist%>/static/**/*.{js,css,png,jpg,jpeg,gif,ttf}',
                    '!<%=yo.dist%>/static/js/app/nls/zh-cn/colors.js'
                    ]
                }
            }
        },

    };

    // The initialization of Grunt configuration parameters
    grunt.initConfig(config);

    // for BDS deploy, Qunar only.
//    grunt.registerTask('rename', function() {
//        var devPath = grunt.config('velocity.root.dev');
//        var distPath = grunt.config('velocity.root.dist');
//        var devFolderName = devPath.replace(grunt.config('yo.app') + '/', '');
//        var distFolderName = distPath.replace(grunt.config('yo.dist') + '/', '');
//        if (devFolderName !== distFolderName) {
//            fs.renameSync(
//                grunt.config('yo.dist') + '/' + devFolderName,
//                distPath
//            );
//        }
//        //grunt.task.run(['copy:rename']);
//    });

    // Registration start a local web server tasks
    grunt.registerTask('server', function ()    {
        var args = Array.prototype.slice.call(arguments, 0);
        var tasks = [];

        // Compile and preview the compiled result
        if (grunt.option('dist')) {
            tasks = [
                'clean:dist',
                //'jshint',
                'copy:css',
                'copy:js',
                'imagemin',
                'copy:image',
                'useminPrepare',
                'less:dist',
                'autoprefixer:dist',
                'concat',
                //'imageEmbed', //[TODO]conflict with connect web server
                'requirejs',
                'uglify',
                'cssmin',
                'rev:dist',
                'copy:vm',
                'usemin',

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
        'imagemin',
        'copy:image',
        'useminPrepare',
        'less:dist',
        'autoprefixer:dist',
        'concat',
        'requirejs',
        //'imageEmbed',
        'uglify',
        'cssmin',
        'rev:dist',
        'copy:vm',
        'usemin',
    ]);

    // 注册Grunt默认任务
    grunt.registerTask('default', [
        'jshint'
    ]);
};
