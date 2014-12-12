define([
    'jquery',
    './lib',
    //'./controller/c1',
    './model/m1',
    'text!app/controller/t1.tpl'
],function (
    $,
    lib,
    //controller,
    model,
    t1
) {
    //A fabricated API to show interaction of
    //common and specific pieces.
    require(['app/controller/Base'], function(Controller) {
        var controller = new Controller('Controller 1');
        controller.setModel(model);
        alert(t1);
        $(function () {
            controller.render(lib.getBody());
        });
    })
});
