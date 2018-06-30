define(
    /* Class name */
    'main/runtime/_ast/HtmlElement',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class An HTML Element Directive
         *
         * @param {!string}     tag     - the HTML element's tag.
         */
        function HtmlElement(tag) {

            assert(lodash.isString(tag));

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
            this.children = [];


            /**
             * The set of the attributes. They have to be key value pairs for example for "<div class='class_name'></div>"
             * the key will be "class" and the value will be "class_name"
             * @type {{}}
             */
            this.attributes = {};
        }

        /* Super class */
        HtmlElement.prototype = new Directive();

        /**
         * Adds a child node to the HTML unit
         * @param {!Directive} child    - The child that will be added
         */
        HtmlElement.prototype.addChild = function (child) {
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
        HtmlElement.prototype.addAttribute = function (attribute_name, attribute_value) {
            assert(lodash.isString(attribute_name));
            assert(lodash.isString(attribute_value) || attribute_value instanceof ExpressionDirective);

            this.attributes[attribute_name] = attribute_value;
        };


        /**
         * Generates a clone of the current directive.
         * @returns {HtmlElement}
         */
        HtmlElement.prototype.shallowClone = function() {
            var clone_directive = new HtmlElement(this.tag);
            //clone_directive.children = this.children;
            clone_directive.attributes = this.attributes;
            return clone_directive;
        };




        return HtmlElement;
    }
);