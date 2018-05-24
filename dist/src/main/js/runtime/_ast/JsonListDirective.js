define(
    /* Class name */
    'main/runtime/_ast/JsonListDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (assert, lodash, Directive) {

        'use strict';

        /**
         * @class An empty JSON object constructor
         *
         */
        function JsonListDirective(json_elements) {

            /* Super constructor */
            Directive.call(this);

            if (lodash.isNull(json_elements) || lodash.isUndefined(json_elements)) {
                this.children = null;
            }
            else {
                this.children = json_elements;
            }
        }

        /* Super class */
        JsonListDirective.prototype = new Directive();

        /**
         * Adds a child node to the JSON unit
         * @param {!Directive} child    - The child that will be added
         */
        JsonListDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {JsonUnitDirective}
         */
        JsonListDirective.prototype.shallowClone = function () {
            var clone_directive = new JsonListDirective();
            return clone_directive;
        };

        return JsonListDirective;
    }
);