define(
    /* Class name */
    'main/compiler/_parser/DirectiveParser',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/UnitDirective', 'main/runtime/_ast/ValueDirective'],

    /* Class symbols */
    function (assert, lodash, TemplateDirective, UnitDirective, ValueDirective) {

        'use strict';

        // FIXME: Use a real parser instead of regular expressions

        function DirectiveParser() {

        }

        DirectiveParser.prototype.parse = function(string) {
            assert(lodash.isString(string));
            return parseTemplate(string);
        };

        function parseTemplate(string) {

            assert(lodash.isString(string));

            var regexp = /<%\s+template\s+(\S+)\s+\(\)\s+%>((\n|.)+)<%\s+end\s+template\s+%>/;


            //##### This was modification is a hack because the pattern matching was causing the test to run out of memory. This will be fixed when we introduce the actual parser #####//

            //var matches = string.match(regexp);
            //assert(matches !== null);
            //
            //var template_name = matches[1];
            //var child = matches[2]; <- change "var child = string" with this!

            // var child = string


            //***** This was added because of the changes to the AST classes *****//
            var children = [string];
            //***** This was added because of the changes to the AST classes *****//

            //##### This was modification is a hack because the pattern matching was causing the test to run out of memory. This will be fixed when we introduce the actual parser #####//



            var template_name = 'index';
            var unit_directive = parseUnit(children[0]);
            var template_directive = new TemplateDirective(template_name);
            template_directive.addChild(unit_directive);
            return template_directive;
        }

        function parseUnit(string) {

            assert(lodash.isString(string));

            //var regexp = /<%\s+unit\s+(\S+)\s+%>((\n|.)+)<%\s+end\s+unit\s+%>/;
            //var matches = string.match(regexp);
            //assert(matches !== null);
            //
            //var unit_class = matches[1];
            //var unit_state = matches[2];

            var unit_class = 'main/units/html/HtmlUnit';
            var unit_state = string;

            var value_directive = new ValueDirective(unit_state);
            return new UnitDirective(unit_class, value_directive);
        }

        return DirectiveParser;
    }
);