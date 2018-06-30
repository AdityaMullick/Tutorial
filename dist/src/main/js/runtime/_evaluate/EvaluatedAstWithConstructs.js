define(
    /* Class name */
    'main/runtime/_evaluate/EvaluatedAstWithConstructs',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/TemplateDirective'],

    /* Class symbols */
    function (assert, lodash, TemplateDirective) {

        'use strict';

        /**
         * @class A Fully Evaluated AST that contains dynamic constructs such as if-then-else for loops etc...
         * @param {!TemplateDirective} evaluatedAst - the root of the template AST
         * @constructor
         */

        function EvaluatedAstWithConstructs(evaluatedAst) {
            assert(evaluatedAst instanceof TemplateDirective);
            this._evaluatedAstWithConstructs = evaluatedAst;
            console.log(evaluatedAst)
        }

        EvaluatedAstWithConstructs.prototype.findNode = function(path){
            //console.log('path:', path, 'evaluatedAstWithConstructs:', this._evaluatedAstWithConstructs);
            return this._evaluatedAstWithConstructs;
        };
        return EvaluatedAstWithConstructs;
    }
);