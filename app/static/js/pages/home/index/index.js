'use strict';

define([
  'jquery',
  'lib/qunit/qunit',
  'text!pages/home/index/tpl/time.tpl'
], function($, QUnit, timeTpl) {
  $(document).ready(function() {
    $(timeTpl).appendTo($('body'));
  });

});
