define(
    /* Class name */
    'main/runtime/_ast/IfStatementDirectives',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive',
        'main/runtime/_ast/ExpressionDirective', 'main/runtime/_ast/IfStatementDirective'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive, ExpressionDirective, IfStatementDirective) {

        'use strict';

        /**
         * @class For directive constructor
         *
         */
        function IfStatementDirectives(children) {

            /* Super constructor */
            Directive.call(this);

            /**
             * Array of children. NOTE: Order of children preserves execution order.
             *
             * @public
             * @type {!Array}
             */
            if (lodash.isNull(children) || lodash.isUndefined(children)) {
                this.children = [];
            }
            else {
                for (var i = 0; i < children .length; i++) {
                    assert(children[i] instanceof IfStatementDirective);
                }
                this.children = children;
            }
        }

        /* Super class */
        IfStatementDirectives.prototype = new Directive();

        /**
         * Adds a child node to the if statement directive
         * @param {!Directive} child    - The child that will be added
         */
        IfStatementDirectives.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            assert(child instanceof IfStatementDirective);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the for directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        IfStatementDirectives.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {IfStatementDirectives}
         */
        IfStatementDirectives.prototype.shallowClone = function() {
            var clone_directive = new IfStatementDirectives(this.variable_name, this.expression);
            return clone_directive;
        };


        return IfStatementDirectives;
    }
);
