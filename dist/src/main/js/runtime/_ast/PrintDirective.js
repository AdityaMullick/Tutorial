define(
    /* Class name */
    'main/runtime/_ast/PrintDirective',

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
        function PrintDirective(expression) {

            /* Super constructor */
            Directive.call(this);


            assert(expression instanceof ExpressionDirective);




            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            this.children = [];


            /**
             * The expression that the directive contains. At this moment it could either be path navigation
             * or a function.
             *
             * @public
             * @type {!ExpressionDirective}
             */
            this.expression = expression;

        }

        /* Super class */
        PrintDirective.prototype = new Directive();

        /**
         * Adds a child node to the directive
         * @param {!Directive} child    - The child that will be added
         */
        PrintDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        PrintDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };



        return PrintDirective;
    }
);