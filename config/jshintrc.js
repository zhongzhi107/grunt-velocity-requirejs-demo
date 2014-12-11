/**
 * @fileOverview Grunt jshint config file
 * @author <a href="mailto:zhong.zhi@163.com">Zhongzhi</a>
 * @version 0.0.1
 *
 */

{
    //语法校验规则
    "node": true,
    "browser": true,
    "esnext": true,
    //"bitwise": false,
    "camelcase": true,
    "curly": true,
    //"eqeqeq": true,
    "immed": true,
    "indent": 4,
    "latedef": true,
    "newcap": true,
    "noarg": true,
    "quotmark": "single",
    "regexp": true,
    "undef": true,
    "unused": true,
    "strict": true,
    "trailing": true,
    "smarttabs": true,
    "jquery": true,
    // 全局变量（免校验）
    "globals": {
        "_": true,
        "Backbone": true,
        "define": true,
        "alert": true,
        "confirm": true,
        "pad": true,
        "DEBUG": true
    }
}