define(
    /* Class name */
    'main/runtime/_ast/JsonObjectDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive', 'main/runtime/_ast/IfStatementDirectives'],

    /* Class symbols */
    function (assert, lodash, Directive, IfStatementDirectives) {

        'use strict';

        /**
         * @class An empty JSON object constructor
         *
         */
        function JsonObjectDirective(json_elements) {

            /* Super constructor */
            Directive.call(this);

            /**
             * JSON object is the first and only element in the children array.
             *
             * @public
             * @type {!array}
             */
            if (lodash.isNull(json_elements) || lodash.isUndefined(json_elements)) {
                this.children = null;
            }
            else {
                this.children = {};
                var if_statement_directives = [];
                if (lodash.isPlainObject(json_elements)) {
                    // check if the input argument is a plain object. This happens when the JsonObjectDirective
                    // is generated as a result a print statement, that prints a complex object
                    // The code path originates from the full evaluator (generateAstNodes, evaluatePrintPath etc).
                    this.children = json_elements;
                }
                else {
                    // If this is invoked then the code path originates from the parser
                    var length = json_elements.length;
                    for (var i = 0; i < length; i++) {
                        if (json_elements[i].key === 'if_statement_directive') {
                            if_statement_directives.push(json_elements[i].value);
                        }
                        else {
                            this.children[json_elements[i].key] = json_elements[i].value;
                        }
                    }
                    if (if_statement_directives.length === 0) {
                        delete this.children.if_statement_directives;
                    }
                    else {
                        this.children.if_statement_directives = new IfStatementDirectives(if_statement_directives);
                    }
                }
            }
        }

        /* Super class */
        JsonObjectDirective.prototype = new Directive();

        /**
         * Adds a child node to the JSON unit
         * @param {!Directive} child    - The child that will be added
         */
        JsonObjectDirective.prototype.addChild = function (key, value) {
            assert(value instanceof Directive);
            this.children[key] = value;
        };

        /**
         * Generates a clone of the current directive.
         * @returns {JsonUnitDirective}
         */
        JsonObjectDirective.prototype.shallowClone = function () {
            var clone_directive = new JsonObjectDirective();
            return clone_directive;
        };

        return JsonObjectDirective;
    }
);