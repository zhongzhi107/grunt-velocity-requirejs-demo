/**
 * @fileOverview test data for veloctiy template when the template load.
 * @parameter _GET {JSON} data get from url query
 * @return {JSON}
 */
module.exports = function (_GET) {
    return {
        pageTitle: 'Welcome page',
        name: _GET.name || 'Joe'
    };
};
