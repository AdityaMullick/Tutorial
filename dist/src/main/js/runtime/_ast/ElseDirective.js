define(
    /* Class name */
    'main/runtime/_ast/ElseDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive',
        'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class For directive constructor
         *
         */
        function ElseDirective(children) {

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
                this.children = children;
            }
        }

        /* Super class */
        ElseDirective.prototype = new Directive();

        /**
         * Adds a child node to the else directive
         * @param {!Directive} child    - The child that will be added
         */
        ElseDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the else directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        ElseDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {ElseDirective}
         */
        ElseDirective.prototype.shallowClone = function() {
            var clone_directive = new ElseDirective(this.variable_name, this.expression);
            return clone_directive;
        };


        return ElseDirective;
    }
);
