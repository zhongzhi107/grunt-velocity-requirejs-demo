/**
* @fileOverview requirejs paths and shim config
*
* It's required by Gruntfile.js
*/
'use strict';

var baseURL = '/static/js';
try {
  if (CDN_ROOT) {
    baseURL = CDN_ROOT + baseURL;
  }
} catch(e) {}

var require = {

  baseUrl: baseURL,

  paths: {
    jquery: 'lib/jquery/jquery',
    text: 'lib/requirejs-text/text'
  },

  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    }
  }
};

if ( typeof module === 'object' && typeof module.exports === 'object' ) {
  module.exports = {
    paths: require.paths,
    shim: require.shim
  };
}
