define(
    /* Class name */
    'main/api/path/KeyNav',

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
        function KeyNav(local_key) {


            /* Super constructor */
            PathStep.call(this, '<' + local_key + '>');


            /**
             * The local key.
             *
             * @public
             * @readonly
             * @type {}
             */
            this.key = local_key;

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        KeyNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        KeyNav.prototype.matches = function(step) {
            return (step instanceof KeyNav && this.key === step.key);
        };

        return KeyNav;
    }
);