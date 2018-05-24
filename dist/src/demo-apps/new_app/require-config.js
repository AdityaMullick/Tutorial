/**
 * RequireJS config for Karma test cases.
 *
 * Modified from Karma's auto-generated file. More details at:
 * http://karma-runner.github.io/0.12/plus/requirejs.html
 */

/* eslint-disable */

var TEST_FILES_REGEX = /\/(Test)[^/]+\.js$/;
var test_files = [];


require.config({

    /*
     * QuickFix!
     * Prevent RequireJS from Caching Required Scripts.
     * This is performed because changes to action files are not
     * automatically identified by RequireJS in order to cause refetching.
     * for that reason the url is modified on each load to force the reload.
     *
     * References:
     * http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts
     * http://stackoverflow.com/questions/11088909/expire-cache-on-require-js-data-main
     *
     * TODO: find a more elegant solution that doesn't force the refetching of unchanged files...
     */
    //   urlArgs: "bust=v2",

    // Karma serves files under /base, which is the basePath from karma.conf.js
    baseUrl: '/template-IVM',

    paths: {
        main: 'src/main/js',
        test: 'src/test/js',
        demoapps : 'src/demo-apps',
        template: 'src/main/js/compiler/template-requirejs-plugin',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery',
        async: 'bower_components/requirejs-plugins/src/async'
    },

    /*
     * Official RequireJS workaround to prevent jQuery from leaking global variables
     * http://requirejs.org/docs/jquery.html
     */
    map: {
        // All modules resolve "jquery" to "jquery-private"
        '*': { 'jquery': 'jquery-private' },

        // Except the "jquery-private" module itself
        'jquery-private': { 'jquery': 'jquery' }
    },

    packages: [
        {'name': 'lodash', 'location': 'node_modules/lodash-amd'},
        {'name': 'text', 'location': 'node_modules/requirejs-text', 'main': 'text.js'},
        {'name': 'cryptojs','location': 'bower_components/crypto-js', 'main': 'index.js'}
    ],

    // Dynamically load all test files
    deps: test_files


});

// Configure jQuery to relinquish global variables $ and jQuery
define('jquery-private', ['jquery'], function (jq) {
    return jq.noConflict( true );
});