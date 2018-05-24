define(
    /* Class name */
    'main/runtime/_ast/ActionDirective',

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
        function ActionDirective(expression) {

            /* Super constructor */
            Directive.call(this);


            assert(expression instanceof ExpressionDirective);


            /**
             * The expression that the directive contains.
             *
             * @public
             * @type {!ExpressionDirective}
             */
            this.expression = expression;

        }

        /* Super class */
        ActionDirective.prototype = new Directive();



        /**
         * Checks if the input diff matches the expression of the directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        ActionDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        ActionDirective.prototype.shallowClone = function () {
            var clone_directive = new ActionDirective(this.expression);
            return clone_directive;
        };



        return ActionDirective;
    }
);