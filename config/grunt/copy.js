'use strict';

module.exports = {
  dev: {
    expand: true,
    dot: true,
    cwd: '<%=yo.app%>/static',
    dest: '.tmp/concat/static',
    src: [
      '**/*',
      '!**/*.less'
    ]
  },
  css: {
    expand: true,
    dot: true,
    cwd: '<%=yo.app%>/static/css',
    dest: '.tmp/concat/static/css',
    src: [
      '**/*',
      '!**/*.less'
    ]
  },
  js: {
    expand: true,
    dot: true,
    cwd: '<%=yo.app%>/static/js',
    dest: '<%=yo.dist%>/static/js',
    src: '**/*.js'
  },
  // 将压缩后的图片拷贝到dist目录
  image: {
    expand: true,
    dot: true,
    cwd: '.tmp/concat/static',
    dest: '<%=yo.dist%>/static/',
    src: '**/*.{png,jpg,jpeg,gif}'
  },
  vm: {
    expand: true,
    cwd: '<%=velocity.root.dev%>',
    src: '**/*.vm',
    dest: '<%=velocity.root.dist%>'
  },
	others: {
		expand: true,
		cwd: '<%=yo.app%>/static',
		dest: '<%=yo.dist%>/static',
		src: '**/*.{ttf,eot,otf,svg,woff,woff2,swf,mp3}'
	}
};
