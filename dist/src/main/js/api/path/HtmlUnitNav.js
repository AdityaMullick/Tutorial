define(
    /* Class name */
    'main/api/path/HtmlUnitNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The html unit nav step.
         *
         */
        function HtmlUnitNav() {

            /* Super constructor */
            PathStep.call(this, '<*html*>');


            /**
             * The unit class.
             *
             * @public
             * @readonly
             * @type {!String}
             */
            this.unit_class = 'html';

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        HtmlUnitNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        HtmlUnitNav.prototype.matches = function(step) {
            return (step instanceof HtmlUnitNav);
        };
        return HtmlUnitNav;
    }
);