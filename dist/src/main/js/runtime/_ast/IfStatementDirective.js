define(
    /* Class name */
    'main/runtime/_ast/IfStatementDirective',

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
        function IfStatementDirective(children) {

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
                this.children = children;
            }
            this.active_index = -1;
        }

        /* Super class */
        IfStatementDirective.prototype = new Directive();

        /**
         * Adds a child node to the if statement directive
         * @param {!Directive} child    - The child that will be added
         */
        IfStatementDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the for directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        IfStatementDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {IfStatementDirective}
         */
        IfStatementDirective.prototype.shallowClone = function() {
            var clone_directive = new IfStatementDirective(this.variable_name, this.expression);
            clone_directive.active_index = this.active_index;
            return clone_directive;
        };


        return IfStatementDirective;
    }
);
