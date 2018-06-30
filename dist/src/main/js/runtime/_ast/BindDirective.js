define(
    /* Class name */
    'main/runtime/_ast/BindDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive',
        'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class Directive constructor
         *
         */
        function BindDirective(expression) {

            /* Super constructor */
            Directive.call(this);


            assert(expression instanceof ExpressionDirective);


            /**
             * The Bind expression.
             *
             * @public
             *
             * @type {!ExpressionDirective}
             */

            this.expression = expression;

            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            this.children = [];



        }

        /* Super class */
        BindDirective.prototype = new Directive();

        /**
         * Adds a child node to the directive
         * @param {!Directive} child    - The child that will be added
         */
        BindDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {BindDirective}
         */
        BindDirective.prototype.shallowClone = function() {
            var clone_directive = new BindDirective(this.value);
            return clone_directive;
        };


        /**
         * Checks if the input diff matches the expression of the directive. The result is always false since
         * Diffs are not propagated to bind directives
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        BindDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return false;
        };



        return BindDirective;
    }
);