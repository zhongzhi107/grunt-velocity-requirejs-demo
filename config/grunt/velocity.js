'use strict';

module.exports = {
  root: {
    dev: '<%=yo.app%>/vm',
    dist: '<%=yo.dist%>/vm',
  },
  data: {
    page: './<%=yo.app%>/data/page',
  },
  ext: 'vm',
  macro: './<%=yo.app%>/vm/common/layout.vm'
};
