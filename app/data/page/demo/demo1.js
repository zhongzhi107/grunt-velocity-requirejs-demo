module.exports = function (req, res) {
  var url = require('url');
  var querystring = require('querystring');
  var query = querystring.parse(url.parse(req.url).query);

  return {
    pageTitle: 'Test page',
    name: query.name || 'lm',
    body: 'hello world'
  };
};