'use strict';

module.exports = {
  // 指定检查或者排除检查的文件/目录列表
  all: [
    'Gruntfile.js',
    '<%=yo.app%>/static/**/*.js',
    '!<%=yo.app%>/static/js/lib/**/*.js',
  ],
  options: {
    // 错误提示美化插件
    reporter: require('jshint-stylish')
  },
};
