define(
    /* Class name */
    'main/runtime/_ast/PlainFunction',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/api/diff/Path', 'main/api/diff/Diff'],

    /* Class symbols */
    function (assert, lodash, Directive, Path, Diff) {

        'use strict';

         function PlainFunction(function_name, args) {


             assert(lodash.isString(function_name));
             var argument_list;
             var path_signature_list = [];


             if (lodash.isNull(args) || lodash.isUndefined(args)) {
                 argument_list = null;
             }
             else {
                 for (var i = 0, n = args.length; i < n; i++) {
                     if (args[i] instanceof Path) {
                         path_signature_list.push(args[i]);
                     }
                 }
                 argument_list = args
             }


             /**
              * The function name
              *
              * @public
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
              * The path signature list
              *
              * @public
              *
              * @type {!Path}
              */
             this.path_signatures = path_signature_list;


        }

        /**
         * Returns the path signatures of this function
         * @returns {!Path}
         */
        PlainFunction.prototype.getPathSignatures = function () {
            return this.path_signatures;
        };


        return PlainFunction;
    }
);