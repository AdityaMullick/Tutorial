define(
    /* Class name */
    'main/runtime/_ast/ElifDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive',
        'main/runtime/_ast/ExpressionDirective'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive, ExpressionDirective) {

        'use strict';

        /**
         * @class Elif directive constructor
         *
         */
        function ElifDirective(condition, children) {

            /* Super constructor */
            Directive.call(this);

            /**
             * The condition for execution of the elif.
             *
             * @public
             *
             * @type {!string}
             */
            this.condition = condition;

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
        ElifDirective.prototype = new Directive();

        /**
         * Adds a child node to the else directive
         * @param {!Directive} child    - The child that will be added
         */
        ElifDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Checks if the input diff matches the expression of the else directive
         * @param {!Diff } diff     - The incoming diff
         * @returns {boolean}       - True if diff matches expression, false otherwise.
         */
        ElifDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return this.expression.match(diff);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {ElifDirective}
         */
        ElifDirective.prototype.shallowClone = function() {
            var clone_directive = new ElifDirective(this.variable_name, this.expression);
            return clone_directive;
        };


        return ElifDirective;
    }
);
