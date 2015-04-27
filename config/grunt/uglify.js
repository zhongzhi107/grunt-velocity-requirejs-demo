'use strict';

module.exports = {
  options: {
    //sourceMap: true,
    compress: {
      // Remove console function
      'drop_console': true,
      // Set global JavaScript varible value when uglify compressing
      'global_defs': {
        DEBUG: false,
        CDN_ROOT: '<%=cdnRoot%>'
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
};
