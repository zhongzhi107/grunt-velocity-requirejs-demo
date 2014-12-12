define([
    'text!app/controller/t1.tpl'
], function (
    t1
) {
    var Base = require('app/controller/Base');
    var c1 = new Base('Controller 1');
    alert(t1);
    return c1;
});
