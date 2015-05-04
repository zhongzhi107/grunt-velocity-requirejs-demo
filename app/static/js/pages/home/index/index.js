'use strict';

define([
  'jquery',
  'text!pages/home/index/tpl/time.tpl!strip',
  'es6!pages/home/index/class'
], function(
  $,
  timeTpl
) {
  //require(['es6!pages/home/index/class']);
  $(document).ready(function() {
    $(timeTpl).appendTo($('body'));
  });

});
