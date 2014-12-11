//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
var baseURL = 'static/js';
if (window.CDN_ROOT) {
    baseURL = CDN_ROOT + '/' + baseURL;
}
requirejs.config({
    baseUrl: baseURL,
    paths: {
        jquery: 'lib/jquery',
        text: 'lib/text',
    }
});
