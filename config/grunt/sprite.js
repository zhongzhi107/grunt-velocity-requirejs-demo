'use strict';

module.exports = {
    icon: {
        src: [
            '<%=yo.app%>/static/images/common/icon/*.png',
            '!<%=yo.app%>/static/images/**/sprite.png'
        ],
        dest: '<%=yo.app%>/static/images/common/icon/sprite.png',
        destCss: '<%=yo.app%>/static/css/common/icon.less',
        imgPath: '/static/images/common/icon/sprite.png',
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
