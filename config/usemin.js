/**
 * @fileOverview Velocity模板配置，在原有功能基础上增加了对cdnRoot的支持
 * 一般不需要修改
 * @author <a href="mailto:zhong.zhi@163.com">Zhongzhi</a>
 * @version 0.0.1
 *
 */

module.exports = {
    pattern: function(cdnRoot) {
        // usemin支持传入前置/后置函数，处理匹配中的文件名
        var filterIn = function (m) { 
            return m; 
        };
        var filterOut = function (m) {
            if (/^(?!http:\/\/|https:\/\/|data:|\/\/).+?\.(js|css|png|jpg|gif|svg|swf|ico)/i.test(m)) {
                m = cdnRoot + m;
            }
            return m; 
        };

        // encode module name to RegExp pattern
        var moduleKeys = Object.keys(require('./module')).map(function(item) {
            return item.replace('/', '\/').replace('.', '\.');
        })

        return {
            'html': [
                /*jshint regexp:false */
                [
                    /<script.+src=['"]([^"']+)["']/gm,
                    'Update the HTML to reference our concat/min/revved script files',
                    filterIn,
                    filterOut
                ],
                [
                    /<link[^\>]+href=['"]([^"']+)["']/gm,
                    'Update the HTML with the new css filenames',
                    filterIn,
                    filterOut
                ],
                [
                    /<img[^\>]+src=['"]([^"']+)["']/gm,
                    'Update the HTML with the new img filenames',
                    filterIn,
                    filterOut
                ],
                [
                    /data-main\s*=['"]([^"']+)['"]/gm,
                    'Update the HTML with data-main tags',
                    function (m) { return m.match(/\.js$/) ? m : m + '.js'; },
                    function (m) { return m.replace('.js', ''); }
                ],
                [
                    /data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
                    'Update the HTML with data-* tags',
                    filterIn,
                    filterOut
                ],
                [
                    /url\(\s*['"]([^"']+)["']\s*\)/gm,
                    'Update the HTML with background imgs, case there is some inline style',
                    filterIn,
                    filterOut
                ],
                [
                    /<a[^\>]+href=['"]([^"']+)["']/gm,
                    'Update the HTML with anchors images',
                    filterIn,
                    filterOut
                ],
                [
                    /<input[^\>]+src=['"]([^"']+)["']/gm,
                    'Update the HTML with reference in input',
                    filterIn,
                    filterOut
                ]
            ],
            'css': [
                /*jshint regexp:false */
                [ /(?:src=|url\(\s*)['"]?([^'"\)]+)['"]?\s*\)?/gm,
                    'Update the CSS to reference our revved images'
                ]
            ],
            'js': [
                /*[
                    /require\(\[{0,1}['"]([^"']+)["']/gm, //require(['./common'],//require('jquery')
                    'Update the RequireJS modules with require tags',
                    function (m) { return m.match(/\.js$/) ? m : m + '.js'; },
                    function (m) { return m.replace('.js', ''); }
                ],*/
                [
                    new RegExp('"(' + moduleKeys.join('|') + ')"', 'gm'),
                    'Update the RequireJS modules with require tags',
                    function (m) { return m.match(/\.js$/) ? m : m + '.js'; },
                    function (m) { return m.replace('.js', ''); }
                ]
            ]
        }

    }
};

