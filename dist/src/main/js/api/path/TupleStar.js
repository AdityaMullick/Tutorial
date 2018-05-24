define(
    /* Class name */
    'main/api/path/TupleStar',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'main/api/path/TupleNav'],

    /* Class symbols */
    function (PathStep, assert, TupleNav) {

        'use strict';

        /**
         * @class The tuple star step.
         */
        function TupleStar() {

            assert(arguments.length === 0, 'No arguments');

            /* Super constructor */
            PathStep.call(this, '.*');

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        TupleStar.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        TupleStar.prototype.matches = function(step) {
            return (step instanceof TupleStar || step instanceof TupleNav);
        };

        return TupleStar;
    }
);