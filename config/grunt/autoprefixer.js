'use strict';

module.exports = {
  options: {
    browsers: ['last 4 version']
  },
  dev: {
    files: [{
      expand: true,
      cwd: '.tmp/static/css',
      src: '**/*.css',
      dest: '.tmp/static/css'
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
};
