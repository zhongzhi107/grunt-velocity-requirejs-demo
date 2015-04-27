'use strict';

module.exports = {
  all: {
    files: [{
      expand: true, // Enable dynamic expansion
      cwd: '<%=yo.app%>/static/', // Src matches are relative to this path
      src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
      dest: '.tmp/concat/static/' // Destination path prefix
    }],
    tasks: ['copy:img']
  }
};
