'use strict';

module.exports = {
  dist: {
    files: {
      src: [
        '<%=yo.dist%>/static/**/*.{js,css,png,jpg,jpeg,gif,ttf}',
        '!<%=yo.dist%>/static/js/app/nls/zh-cn/colors.js'
      ]
    }
  }
};