define(
    /* Class name */
    'main/runtime/_ast/ExpressionDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/api/diff/Path', 'main/api/diff/Diff',
        'main/runtime/_ast/PlainFunction', 'main/runtime/_ast/PlainAction'],

    /* Class symbols */
    function (assert, lodash, Directive, Path, Diff, PlainFunction, PlainAction) {

        'use strict';

        /**
         * TODO: currently an ExpressionDirective only contains paths, extend it so that it contains function calls and  more... (such as numeric operations e.g: 1+1)
         * @class Expression constructor
         *
         */
        function ExpressionDirective(expression, path_signature, delta_function) {

            /* Super constructor */
            Directive.call(this);

            assert((expression instanceof Path) || (expression instanceof PlainFunction) ||
                (expression instanceof PlainAction)); // TODO: add check for function call

            // TODO: In case of PlainFunction instantiate the deltas appropriately!

            if (!(expression instanceof Path) && !(expression instanceof PlainFunction)) {
                assert((path_signature instanceof Path) || (path_signature === null));
                assert(delta_function instanceof Function || (delta_function === null));
            }



            /**
             * The expression string
             *
             * @public
             *
             * @type {!string}
             */
            this.expression_instance = expression;


            /**
             * The delta function that gets called when the target of the diff matches this particular expression
             *
             * @public
             *
             * @type {!Function}
             */
            this.delta_function = delta_function;


            /**
             * The path signature of the expression. When the target of the diff matches this the delta function will
             * be called.
             *
             * @public
             *
             * @type {!Path}
             */
            this.path_signature = path_signature;

        }

        /* Super class */
        ExpressionDirective.prototype = new Directive();

        ExpressionDirective.prototype.match = function (diff) {
            assert(diff instanceof Diff);

            var path_steps = {};

            for (var i = 0; i < diff.target.steps.length; i++) {
                path_steps[diff.target.steps[i]] = 1;
            }

            for (i = 0; i < this.path_signature.steps.length; i++) {
                path_steps[this.path_signature.steps[i]] += 1;
            }

            for (var step in path_steps) {
                if (path_steps[step] !== 2) {
                    return null;
                }
            }

            return this.delta_function(diff);
        };

        ExpressionDirective.prototype.getPathSignatures = function () {
            if (lodash.isNull(this.path_signature) || lodash.isUndefined(this.path_signature)) {
                if (this.expression_instance instanceof Path) {
                    return [this.expression_instance];
                }
                else if(this.expression_instance instanceof PlainFunction) {
                    return this.expression_instance.getPathSignatures();
                }
            }


            // assert(false, 'TODO: need to fix these cases');
            //return this.delta_function(diff);
        };




        return ExpressionDirective;
    }
);