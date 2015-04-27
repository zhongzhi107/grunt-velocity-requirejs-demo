'use strict';

module.exports = {
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
      livereload: require('../app').port.liveReload
    },
    files: [
      '<%=velocity.root.dev%>/**/*.<%=velocity.ext%>',
      '.tmp/static/css/**/*.css',
      '<%=yo.app%>/static/css/**/*.css',
      '!<%=yo.app%>/node_modules/**',
      '<%=yo.app%>/**/*.{js,<%=velocity.ext%>,png,jpg,jpeg,gif,ttf,webp,svg}'
    ]
  }
};
