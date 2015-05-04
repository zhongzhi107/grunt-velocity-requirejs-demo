'use strict';

define([
  'jquery',
  'lib/qunit/qunit',
  'text!pages/home/index/tpl/time.tpl!strip',
  'es6!pages/home/index/class'
], function(
  $,
  QUnit,
  timeTpl
) {
  //require(['es6!pages/home/index/class']);
  $(document).ready(function() {
    $(timeTpl).appendTo($('body'));
  });

});
