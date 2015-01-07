define([
    'jquery',
    './lib',
    //'./controller/c1',
    './model/m1',
    'text!app/controller/t1.tpl',
    'i18n!nls/colors'
],function (
    $,
    lib,
    //controller,
    model,
    t1,
    colors
) {
    //A fabricated API to show interaction of
    //common and specific pieces.
    require(['app/controller/Base'], function(Controller) {
        var controller = new Controller('Controller 1');
        controller.setModel(model);
        alert(t1);
        alert(colors.red);
        $(function () {
            controller.render(lib.getBody());
        });
    })
});
