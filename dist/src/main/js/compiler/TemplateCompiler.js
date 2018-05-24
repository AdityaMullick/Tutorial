define(
    /* Class name */
    'main/compiler/TemplateCompiler',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/compiler/_parser/DirectiveParser', 'main/runtime/Template'],

    /* Class symbols */
    function (assert, lodash, DirectiveParser, Template) {

        'use strict';

        /**
         * @class A template compiler.
         */
        function TemplateCompiler() {

            /**
             * The directive parser.
             *
             * @private
             * @type {!DirectiveParser}
             */
            this._directive_parser = new DirectiveParser();

        }

        /**
         * Compiles a template.
         *
         * @param {!string} string - the template string.
         * @returns {!Template} the template.
         */
        TemplateCompiler.prototype.compile = function (string) {

            assert(lodash.isString(string));

            var template_directive = this._directive_parser.parse(string);
            var template = new Template(template_directive);
            return template;
        };

        return TemplateCompiler;
    }
);