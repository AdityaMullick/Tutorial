/* eslint new-cap: 0 */

define(
    /* Class name */
    'main/runtime/_ast/UnitDirective',

    /* Class dependencies */
    ['require', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (require, assert, lodash, Directive) {

        'use strict';

        /**
         * @class A unit directive.
         *
         * @param {!string}     unit_class  - the unit class.
         * @param {!Directive}  child       - the child directive.
         */
        function UnitDirective(unit_class, child) {

            assert(lodash.isString(unit_class));
            assert(child instanceof Directive);

            /* Super constructor */
            Directive.call(this);

            /**
             * The unit class.
             *
             * @public
             * @type {!string}
             */
            this.unit_class = unit_class;

            /**
             * The child directive.
             *
             * @public
             * @type {!Directive}
             */
            this.child = child;


            /**
             * The visual unit.
             *
             * A unit directive is constructed when a template is parsed. However, it is only after the template is
             * parsed and compiled that its visual unit dependencies are loaded by RequireJS. Thus, the visual unit is
             * first set to null, and initialized lazily later through getUnit().
             *
             * @private
             * @type {!Unit}
             */
            this._unit = null;
        }

        /* Super class */
        UnitDirective.prototype = new Directive();

        /**
         * Gets the visual unit corresponding to the unit directive.
         *
         * @returns {!Unit} the visual unit.
         */
        UnitDirective.prototype.getUnit = function () {

            // Initialize the visual unit if necessary
            if (this._unit === null) {

                // Get the RequireJS module, which has already been loaded
                var unit = require(this.unit_class);

                // Invoke the module constructor to construct a new visual unit
                this._unit = new unit();
            }
            return this._unit;
        };




        return UnitDirective;
    }
);