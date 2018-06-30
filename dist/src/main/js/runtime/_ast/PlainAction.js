/**
 * Plain Action is similar to Plain Function, but with less attributes. Only the attributes that would be relevant
 * to visual unit developers and app developers are included, thus achieving a more developer-friendly design
 */
define(
    /* Class name */
    'main/runtime/_ast/PlainAction',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/api/diff/Path', 'main/api/diff/Diff'],

    /* Class symbols */
    function (assert, lodash, Directive, Path, Diff) {

        'use strict';

        function PlainAction(function_name, args, function_reference) {


            assert(lodash.isString(function_name));
            var argument_list;
            var path_sigature_list = [];


            if (lodash.isNull(args) || lodash.isUndefined(args)) {
                argument_list = null;
            }
            else {
                for (var i = 0, n = args.length; i < n; i++) {
                    if (args[i] instanceof Path) {
                        path_sigature_list.push(args[i]);
                    }
                }
                argument_list = args
            }


            /**
             * The function name
             *
             * @private
             *
             * @type {!string}
             */
            this.function_name = function_name;


            /**
             * The argument list, is a list of input values
             *
             * @public
             *
             * @type {!Path}
             */
            this.args = argument_list;

            /**
             * A reference to the action
             */
            this.action = function_reference;



        }


        return PlainAction;
    }
);