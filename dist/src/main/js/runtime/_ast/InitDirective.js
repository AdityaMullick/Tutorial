define(
    /* Class name */
    'main/runtime/_ast/InitDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class An Init Directive constructor
         *
         */
        function InitDirective(value, expression) {

            /* Super constructor */
            Directive.call(this);


            assert(lodash.isString(value));
            assert(expression instanceof ExpressionDirective);




            /**
             * The alias of the expression. The variable that the expression gets assigned to
             *
             * @public
             *
             * @type {!string}
             */
            this.value = value;

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
        InitDirective.prototype = new Directive();

        /**
         * Adds a child node to the directive
         * @param {!Directive} child    - The child that will be added
         */
        InitDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        InitDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {InitDirective}
         */
        InitDirective.prototype.shallowClone = function () {
            var clone_directive = new InitDirective(this.value, this.expression);
            return clone_directive;
        };


        return InitDirective;
    }
);