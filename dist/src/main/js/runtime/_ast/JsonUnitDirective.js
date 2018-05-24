define(
    /* Class name */
    'main/runtime/_ast/JsonUnitDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/PlaceHolderDirective',
        'main/api/unit/UnitInstance',
        'main/units/highcharts/HighchartsUnit',
        'main/units/leaflet/LeafletUnit', 'main/units/googlemaps/GoogleMapsUnit'],

    //['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/units/highcharts/HighchartsUnit'],

    /* Class symbols */
    function (assert, lodash, Directive, PlaceHolderDirective, UnitInstance) {

        'use strict';

        /**
         * @class An empty JSON Unit constructor
         *
         */
        function JsonUnitDirective(unit_class, json, attributes) {

            assert(!lodash.isNull(unit_class), 'A unit must have a class name');
            assert(!lodash.isUndefined(unit_class), 'A unit must have a class name');
            /* Super constructor */
            Directive.call(this);

            /**
             * JSON object is the first and only element in the children array.
             *
             * @public
             * @type {!array}
             */
            if (lodash.isNull(json) || lodash.isUndefined(json)) {
                this.children = null;
            }
            else {
                this.children = [json];
            }

            if (lodash.isNull(attributes) || lodash.isUndefined(attributes)) {
                this.attributes = null;
            }
            else {
                console.log(attributes);
                this.attributes = attributes;
            }

            /**
             * The unit class.
             *
             * @public
             * @type {!string}
             */
            this.unit_class = unit_class;

            this.placeholder_id = null;

            /**
             * The placeholder directive
             * @type {?PlaceHolderDirective}
             */
            this.placeholder_directive = null;

            /**
             * The Unit Instance.
             *
             * When the Annotated Template Instance is evaluated and fragmented, multiple unit instances will be
             * generated. These unit instances need to be maintained so that the respective renderers, UI objects etc.,
             * are accessible during the partial evaluation.
             * @type {?UnitInstance}
             * @private
             */
            this._unit_instance = null;

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
        JsonUnitDirective.prototype = new Directive();

        /**
         * Adds a child node to the JSON unit
         * @param {!Directive} child    - The child that will be added
         */
        JsonUnitDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Adds a unit instance to this directive
         * @param {!UnitInstance} unit_instance - The unit instance
         */
        JsonUnitDirective.prototype.addUnitInstance = function(unit_instance) {
            assert(unit_instance instanceof UnitInstance);
            this._unit_instance = unit_instance;
        };


        /**
         * Returns the unit instance.
         * @returns {?UnitInstance}
         */
        JsonUnitDirective.prototype.getUnitInstance = function() {
            return this._unit_instance;
        };

        /**
         * Adding a placeholder directive.
         * @param {!PlaceHolderDirective} placeholder - The placeholder directive that will be added that will be added
         */
        JsonUnitDirective.prototype.addPlaceholderDirective = function (placeholder) {
            assert(placeholder instanceof PlaceHolderDirective);
            this.placeholder_directive = placeholder;
        };

        /**
         * Generates a clone of the current directive.
         * @returns {JsonUnitDirective}
         */
        JsonUnitDirective.prototype.shallowClone = function () {
            var clone_directive = new JsonUnitDirective(this.unit_class, this._unit, this.attributes);
            if (!lodash.isNull(this.placeholder_directive)) {
                clone_directive.placeholder_directive = this.placeholder_directive;
            }
            return clone_directive;
        };

        /**
         * Gets the visual unit corresponding to the unit directive.
         *
         * @returns {!Unit} the visual unit.
         */
        JsonUnitDirective.prototype.getUnit = function () {

            // Initialize the visual unit if necessary
            if (this._unit === null) {
                var unit;
                try {
                    // Get the RequireJS module, which has already been loaded
                    unit = require(this.unit_class);
                }
                catch (err) {
                    unit = require('main/units/'+ this.unit_class.toLowerCase()+'/'+this.unit_class+'Unit');
                }

                // Invoke the module constructor to construct a new visual unit
                this._unit = new unit();
            }
            return this._unit;
        };

        return JsonUnitDirective;
    }
);