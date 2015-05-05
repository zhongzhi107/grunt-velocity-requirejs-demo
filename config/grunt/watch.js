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
      '.tmp/static/css/**/*.css',
      '<%=yo.app%>/**/*.{<%=velocity.ext%>,js,css,png,jpg,jpeg,gif,ttf,webp,svg,tpl}',
      '!<%=yo.app%>/node_modules/**'
    ]
  }
};
