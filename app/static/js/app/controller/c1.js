define([
    './Base',
    'text!app/controller/t1.tpl'
], function (
    Base,
    t1
) {
    var c1 = new Base('Controller 1');
    alert(t1);
    return c1;
});
