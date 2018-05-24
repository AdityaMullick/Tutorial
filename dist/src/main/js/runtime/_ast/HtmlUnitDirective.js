define(
    /* Class name */
    'main/runtime/_ast/HtmlUnitDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/PlaceHolderDirective',
        'main/api/unit/UnitInstance',
        'main/units/html/HtmlUnit'],

    /* Class symbols */
    function (assert, lodash, Directive, PlaceHolderDirective, UnitInstance) {

        'use strict';

        /**
         * @class An empty HTML Unit constructor
         *
         */
        function HtmlUnitDirective(children, attributes) {

            /* Super constructor */
            Directive.call(this);

            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            if (lodash.isNull(children) || lodash.isUndefined(children)) {
                this.children = [];
            }
            else {
                var children_array = [];
                for (var i=0; i<children.length; i++) {
                    if (children[i] !== undefined) {
                        children_array.push(children[i]);
                    }
                }
                this.children = children_array;
            }

            if (lodash.isNull(attributes) || lodash.isUndefined(attributes)) {
                this.attributes = null;
            }
            else {
                this.attributes = attributes;
            }

            /**
             * The unit class.
             *
             * @public
             * @type {!string}
             */
            this.unit_class = 'main/units/html/HtmlUnit';


            /**
             * The placeholder directive
             * @type {PlaceHolderDirective}?
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
        HtmlUnitDirective.prototype = new Directive();

        /**
         * Adds a child node to the HTML unit
         * @param {!Directive} child    - The child that will be added
         */
        HtmlUnitDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Adds a unit instance to this directive
         * @param {!UnitInstance} unit_instance - The unit instance
         */
        HtmlUnitDirective.prototype.addUnitInstance = function(unit_instance) {
            assert(unit_instance instanceof UnitInstance);
            this._unit_instance = unit_instance;
        };


        /**
         * Returns the unit instance.
         * @returns {?UnitInstance}
         */
        HtmlUnitDirective.prototype.getUnitInstance = function() {
            return this._unit_instance;
        };


        /**
         * Adding a placeholder directive.
         * @param {!PlaceHolderDirective} placeholder - The placeholder directive that will be added that will be added
         */
        HtmlUnitDirective.prototype.addPlaceholderDirective = function (placeholder) {
            assert(placeholder instanceof PlaceHolderDirective);
            this.placeholder_directive = placeholder;
        };

        /**
         * Generates a clone of the current directive.
         * @returns {HtmlUnitDirective}
         */
        HtmlUnitDirective.prototype.shallowClone = function () {
            var clone_directive = new HtmlUnitDirective(this.children, this.attributes);
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
        HtmlUnitDirective.prototype.getUnit = function () {

            // Initialize the visual unit if necessary
            if (this._unit === null) {

                // Get the RequireJS module, which has already been loaded
                var unit = require(this.unit_class);

                // Invoke the module constructor to construct a new visual unit
                this._unit = new unit();
            }
            return this._unit;
        };




        return HtmlUnitDirective;
    }
);