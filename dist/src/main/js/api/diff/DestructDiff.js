define(
    /* Class name */
    'main/api/diff/DestructDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/api/diff/Path', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, Path, Op) {

        'use strict';

        /**
         * @class A destruct diff.
         */
        function DestructDiff() {

            /* Super constructor */
            Diff.call(this, Op.DESTRUCT, new Path('^'));

        }

        /* Super class */
        DestructDiff.prototype = new Diff();

        return DestructDiff;

    }
);