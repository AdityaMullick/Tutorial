define(
    /* Class name */
    'main/runtime/_ast/HtmlBalancedTagElement',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class An HTML Balanced Tag Element Directive
         *
         * @param {!string}     tag     - the HTML element's tag.
         */
        function HtmlBalancedTagElement(tag, children, attributes) {

            assert(lodash.isString(tag));
            assert(lodash.isArray(children) || lodash.isNull(children) || lodash.isUndefined(children));

            /* Super constructor */
            Directive.call(this);

            /**
             * The tag of the HTML element
             *
             * @public
             * @type {!string}
             */
            this.tag = tag;


            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            if (lodash.isArray(children)) {
                var children_array = [];
                for (var i=0; i<children.length; i++) {
                    if (children[i] !== undefined) {
                        children_array.push(children[i]);
                    }
                }
                this.children = children_array;
            }
            else {
                this.children = [];
            }


            /**
             * The set of the attributes. They have to be key value pairs for example for "<div class='class_name'></div>"
             * the key will be "class" and the value will be "class_name"
             * @type {{}}
             */
            this.attributes = attributes;
        }

        /* Super class */
        HtmlBalancedTagElement.prototype = new Directive();

        /**
         * Adds a child node to the directive
         * @param {!Directive} child    - The child that will be added
         */
        HtmlBalancedTagElement.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        //TODO: check if the attribute value is an expression

        /**
         * Add a new attribute and the corresponding value to the node
         *
         * @param {!string } attribute_name                 - The attribute name
         * @param {!string| !Expression } attribute_value   - The attribute value
         */
        HtmlBalancedTagElement.prototype.addAttribute = function (attribute_name, attribute_value) {
            assert(lodash.isString(attribute_name));
            assert(lodash.isString(attribute_value) || attribute_value instanceof ExpressionDirective);

            this.attributes[attribute_name] = attribute_value;
        };


        /**
         * Generates a clone of the current directive.
         * @returns {HtmlBalancedTagElement}
         */
        HtmlBalancedTagElement.prototype.shallowClone = function() {
            var clone_directive = new HtmlBalancedTagElement(this.tag);
            //clone_directive.children = this.children;
            clone_directive.attributes = this.attributes;
            return clone_directive;
        };




        return HtmlBalancedTagElement;
    }
);