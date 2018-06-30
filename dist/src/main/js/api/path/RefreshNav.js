define(
    /* Class name */
    'main/api/path/RefreshNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The for-loop nav step.
         *
         */
        function RefreshNav() {

            /* Super constructor */
            PathStep.call(this, '<%let%>');


            /**
             * The unit class.
             *
             * @public
             * @readonly
             * @type {!String}
             */
            this.directive_class = 'refresh';

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        RefreshNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        RefreshNav.prototype.matches = function(step) {
            return (step instanceof RefreshNav);
        };

        return RefreshNav;
    }
);