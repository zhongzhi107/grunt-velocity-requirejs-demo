/**
* 自定义task
* 根据r.js的输出日志文件build.txt
* 删除已经打包的requirejs插件资源文件
*/

'use strict';

module.exports = function(grunt) {
  var fs = require('fs');
  var path = require('path');
  var util = require('util');

  function removeFile(pluginFile, removeEmptyFolder) {
    grunt.file.delete(pluginFile);
    grunt.log.ok(pluginFile + ' removed.');

    if (removeEmptyFolder) {
      try {
        var dirname = path.dirname(pluginFile);
        fs.rmdirSync(dirname);
        grunt.log.ok(dirname + ' removed.');
      } catch (e) {
        // do nothing
      }
    }
  }

  grunt.registerTask('removeCombined', 'Hack requirejs removeCombined', function() {
    // 默认配置
    var options = this.options({
      // r.js工作根目录，即build.txt输出目录
      baseURL: 'prd/static/js',
      // 输入日志文件名称
      logFile: 'build.txt',
      // 是否删除空目录
      removeEmptyFolder: true,
      // 缺省插件文件扩展名
      extensions: {
        es6: '.js' //or ['.js']
      }
    }, grunt.config(this.name));

    grunt.verbose.writeflags(options, 'Options');

    var pluginName, pluginFile;
    var buildText = grunt.file.read(path.join(options.baseURL, options.logFile));
    var lines = buildText.match(/(^\w+!)(.*$)/gm);
    if (lines !== null) {
      lines.forEach(function(line) {
        // 可能有多次使用插件的情况，如"text!some/module.html!strip"
        var matches = /(^\w+!)([^!]*)/gm.exec(line);
        pluginName = matches[1].replace('!', '');
        pluginFile = path.join(options.baseURL, matches[2]);

        if (fs.existsSync(pluginFile)) {
          removeFile(pluginFile, options.removeEmptyFolder);
        } else {
          // 不包含扩展名的文件补全扩展名
          if (!path.extname(pluginFile)) {
            // 且在extensions中配置了缺省扩展名的文件
            var extensions = options.extensions[pluginName];
            if (extensions) {
              if (!util.isArray(extensions)) {
                extensions = [extensions];
              }
              extensions.some(function(ext) {
                pluginFile += ext;
                if (fs.existsSync(pluginFile)) {
                  removeFile(pluginFile, options.removeEmptyFolder);
                  return true;
                }
              });
            }
          }
        }
      });

      grunt.log.ok(lines.length + ' files removed.');
    }
  });
};
