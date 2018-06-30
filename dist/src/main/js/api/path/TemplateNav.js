define(
    /* Class name */
    'main/api/path/TemplateNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The array nav step.
         *
         * @param {!string} name - the name of the template.
         */
        function TemplateNav(name) {

            assert(lodash.isString(name), 'The unit class must be a string');

            /* Super constructor */
            PathStep.call(this, '<#' + name + '#>');


            /**
             * The unit class.
             *
             * @public
             * @readonly
             * @type {!String}
             */
            this.unit_class = name;

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        TemplateNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        TemplateNav.prototype.matches = function(step) {
            return (step instanceof TemplateNav && this.name === step.name);
        };

        return TemplateNav;
    }
);