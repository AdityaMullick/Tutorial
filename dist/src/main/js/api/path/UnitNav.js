define(
    /* Class name */
    'main/api/path/UnitNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The unit nav step.
         *
         * @param {!string} unit_class - the class of the unit (i.e., Google Maps, Highcharts etc.).
         */
        function UnitNav(unit_class) {

            assert(lodash.isString(unit_class), 'The unit class must be a string');

            /* Super constructor */
            PathStep.call(this, '<*' + unit_class + '*>');


            /**
             * The unit class.
             *
             * @public
             * @readonly
             * @type {!String}
             */
            this.unit_class = unit_class;

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        UnitNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        UnitNav.prototype.matches = function(step) {
            return (step instanceof UnitNav && this.unit_class === step.unit_class);
        };

        return UnitNav;
    }
);