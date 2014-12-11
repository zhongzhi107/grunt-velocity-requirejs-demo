/**
 * @fileOverview Grunt URL rewrite rule config file
 * @author <a href="mailto:zhong.zhi@163.com">Zhongzhi</a>
 * @version 0.0.1
 * @TODO: 解决80端口代理错误
 *
 */

module.exports = {
    // 从上至下匹配，遇到第一个匹配的规则后就返回，通用配置写在最下面
    // 特殊配置

    // 通用配置
    '^/api/(.*)': 'require!/app/data/api/$1.js',
    //'^/api/(.*)': 'http://www.test.com/api/$1',
};

