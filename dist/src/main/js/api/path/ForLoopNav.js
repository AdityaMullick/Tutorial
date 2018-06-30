define(
    /* Class name */
    'main/api/path/ForLoopNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The for-loop nav step.
         *
         */
        function ForLoopNav() {

            /* Super constructor */
            PathStep.call(this, '<%for%>');


            /**
             * The unit class.
             *
             * @public
             * @readonly
             * @type {!String}
             */
            this.directive_class = 'for';

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        ForLoopNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        ForLoopNav.prototype.matches = function(step) {
            return (step instanceof ForLoopNav);
        };

        return ForLoopNav;
    }
);