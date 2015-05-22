
module.exports = function (req, res, next) {
	res.end(JSON.stringify({action: 'hello world', name: 'lm'}));
};
