'use strict';

module.exports = {
    icon: {
        src: [
            '<%=yo.app%>/static/images/common/icons/*.png',
            '!<%=yo.app%>/static/images/**/sprite.png'
        ],
        dest: '<%=yo.app%>/static/images/common/icons/sprite.png',
        destCss: '<%=yo.app%>/static/css/common/icons.less',
        imgPath: '/static/images/common/icons/sprite.png',
        cssFormat: 'less'
    },
    'repeat-x': {
        src: [
            '<%=yo.app%>/static/images/common/repeat-x/*.png',
            '!<%=yo.app%>/static/images/**/sprite.png'
        ],
        dest: '<%=yo.app%>/static/images/common/repeat-x/sprite.png',
        destCss: '<%=yo.app%>/static/css/common/repeat-x.less',
        imgPath: '/static/images/common/repeat-x/sprite.png',
        cssFormat: 'less',
        algorithm: 'top-down'
    },
    'repeat-y': {
        src: [
            '<%=yo.app%>/static/images/common/repeat-y/*.png',
            '!<%=yo.app%>/static/images/**/sprite.png'
        ],
        dest: '<%=yo.app%>/static/images/common/repeat-y/sprite.png',
        destCss: '<%=yo.app%>/static/css/common/repeat-y.less',
        imgPath: '/static/images/common/repeat-y/sprite.png',
        cssFormat: 'less',
        algorithm: 'left-right'
    }
};
