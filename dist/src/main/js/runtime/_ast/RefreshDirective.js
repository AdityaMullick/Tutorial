define(
    /* Class name */
    'main/runtime/_ast/RefreshDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class An empty HTML Unit constructor
         *
         */
        function RefreshDirective(variable_name, expression) {

            /* Super constructor */
            Directive.call(this);


            assert(lodash.isString(variable_name));
            assert(expression instanceof ExpressionDirective);




            /**
             * The alias of the expression. The variable that the expression gets assigned to
             *
             * @public
             *
             * @type {!string}
             */
            this.variable_name = variable_name;

            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            this.children = [];


            /**
             * The expression that the for loop contains. At this moment it could either be path navigation
             * or a function.
             *
             * @public
             * @type {!ExpressionDirective}
             */
            this.expression = expression;

        }

        /* Super class */
        RefreshDirective.prototype = new Directive();

        /**
         * Adds a child node to the directive
         * @param {!Directive} child    - The child that will be added
         */
        RefreshDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the for directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        RefreshDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {RefreshDirective}
         */
        RefreshDirective.prototype.shallowClone = function () {
            var clone_directive = new RefreshDirective(this.variable_name, this.expression);
            return clone_directive;
        };


        return RefreshDirective;
    }
);