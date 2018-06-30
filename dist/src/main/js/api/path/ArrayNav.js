define(
    /* Class name */
    'main/api/path/ArrayNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The array nav step.
         *
         * @param {!number} position - the position.
         */
        function ArrayNav(position) {

            assert(lodash.isNumber(position), 'Position must be a number');

            /* Super constructor */
            PathStep.call(this, '[' + position + ']');


            /**
             * The position.
             *
             * @public
             * @readonly
             * @type {!number}
             */
            this.position = position;

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        ArrayNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        ArrayNav.prototype.matches = function(step) {
            return (step instanceof ArrayNav && this.position === step.position);
        };

        return ArrayNav;
    }
);