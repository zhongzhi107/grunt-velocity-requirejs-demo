'use strict';

module.exports = {
  options: {
    root: '<%=yo.app%>',
    dest: '<%=yo.dist%>'
  },
  // Entrance files to find usemin block
  html: '<%=velocity.root.dev%>/**/*.<%=velocity.ext%>'
};
