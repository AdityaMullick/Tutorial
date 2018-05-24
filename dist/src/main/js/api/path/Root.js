define(
    /* Class name */
    'main/api/path/Root',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert'],

    /* Class symbols */
    function (PathStep, assert) {

        'use strict';

        /**
         * @class The root step.
         */
        function Root() {

            assert(arguments.length === 0, 'No arguments');

            /* Super constructor */
            PathStep.call(this, '^');

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        Root.prototype = new PathStep();


        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        Root.prototype.matches = function(step) {
            return step instanceof Root;
        }

        return Root;
    }
);