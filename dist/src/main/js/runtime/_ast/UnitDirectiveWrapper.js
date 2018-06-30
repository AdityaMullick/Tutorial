define(
    /* Class name */
    'main/runtime/_ast/UnitDirectiveWrapper',

    /* Class dependencies */
    ['main/util/Lang', 'main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (util, Diff, assert, lodash, Directive) {

        'use strict';

        /**
         * @class For directive constructor
         *
         */
        function UnitDirectiveWrapper(placeholder_directive, childUnit) {

            /* Super constructor */
            Directive.call(this);

            assert(!util.isNullOrUndefined(placeholder_directive));
            assert(!util.isNullOrUndefined(childUnit));

            /**
             * The placeholder directive.
             *
             * @public
             *
             * @type {!string}
             */
            this.placeholder_directive = placeholder_directive;
            /**
             * Children.
             * Note that units have only one child, so the children should be an array of one.
             *
             * @public
             *
             * @type {!string}
             */

            this.unit_directive = childUnit;
        }

        /* Super class */
        UnitDirectiveWrapper.prototype = new Directive();

        /**
         * Generates a clone of the current directive.
         * @returns {UnitDirectiveWrapper}
         */
        UnitDirectiveWrapper.prototype.shallowClone = function() {
            return new UnitDirectiveWrapper(this.placeholder_directive, this.unit_directive);
        };

        return UnitDirectiveWrapper;
    }
);
