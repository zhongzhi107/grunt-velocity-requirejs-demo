/**
 * @fileOverview Pad touch webapp config file
 * @author <a href="mailto:zhong.zhi@163.com">Zhongzhi</a>
 * @version 0.0.1
 *
 */

module.exports = {

    port: {
      www: 9001,
      liveReload: 35740
    },

    // 路径配置
    path: {
        // 程序主目录
        app: 'app',
        // 发布目录
        dist: 'prd'
    },

    // 访问不同环境对应的qzz域名
    cdnDomain: {
        '': '',
        dev: 'http://dev.cdn.yourdomain.com',
        beta: 'http://beta.cdn.yourdomain.com',
        prepare: 'http://cdn.yourdomain.com',
        prod: 'http://cdn.yourdomain.com'
    },

};
