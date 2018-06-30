define(
    /* Class name */
    'main/api/path/ArrayStar',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'main/api/path/ArrayNav'],

    /* Class symbols */
    function (PathStep, assert, ArrayNav) {

        'use strict';

        /**
         * @class The array star step.
         */
        function ArrayStar() {

            assert(arguments.length === 0, 'No arguments');

            /* Super constructor */
            PathStep.call(this, '[*]');

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        ArrayStar.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        ArrayStar.prototype.matches = function(step) {
            return (step instanceof ArrayStar || step instanceof ArrayNav);
        };

        return ArrayStar;
    }
);