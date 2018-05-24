define(
    /* Class name */
    'main/api/diff/DeleteHtmlDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'main/api/diff/HtmlPath', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, HtmlPath, Op) {

        'use strict';

        /**
         * @class A delete HTML diff class.
         *
         * @param {!HtmlPath} target        - The target.
         *
         * @constructor
         */
        function DeleteHtmlDiff(target) {
            assert(target instanceof HtmlPath, 'Target must be an HTML Path');
            Diff.call(this, Op.DELETE, target);
        }

        /* Super class */
        DeleteHtmlDiff.prototype = new Diff();

        return DeleteHtmlDiff;

    }
);