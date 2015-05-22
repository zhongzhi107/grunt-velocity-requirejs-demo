'use strict';

define([
  'jquery',
  'text!pages/home/index/tpl/time.tpl!strip',
  'es6!pages/home/index/class'
], function(
  $,
  timeTpl
) {
  $(document).ready(function() {
   console.log(timeTpl);
  });

});