'use strict';

module.exports = {
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
}
