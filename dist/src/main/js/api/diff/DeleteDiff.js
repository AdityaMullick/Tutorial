define(
    /* Class name */
    'main/api/diff/DeleteDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'main/api/diff/Path', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, Path, Op) {

        'use strict';

        /**
         * @class A delete diff class.
         *
         * @param {!Path} target        - The target.
         *
         * @constructor
         */
        function DeleteDiff(target) {
            assert(target instanceof Path, 'Target must be a path');
            Diff.call(this, Op.DELETE, target);
        }

        /* Super class */
        DeleteDiff.prototype = new Diff();

        return DeleteDiff;

    }
);