define(
    /* Class name */
    'main/api/path/TupleNav',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (PathStep, assert, lodash) {

        'use strict';

        /**
         * @class The tuple nav step.
         *
         * @param {!string} attribute - the attribute.
         */
        function TupleNav(attribute) {

            assert(lodash.isString(attribute), 'Attribute must be a string');

            /* Super constructor */
            //PathStep.call(this, PathStep.ENCODER.escape(attribute));
            PathStep.call(this, attribute);

            /**
             * The attribute.
             *
             * @public
             * @readonly
             * @type {!string}
             */
            this.attribute = attribute;

            // Immutable object
            Object.freeze(this);
        }

        /* Super class */
        TupleNav.prototype = new PathStep();

        /**
         * Returns whether this path step matches the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        TupleNav.prototype.matches = function(step) {
            return (step instanceof TupleNav && this.attribute === step.attribute);
        };

        return TupleNav;
    }
);