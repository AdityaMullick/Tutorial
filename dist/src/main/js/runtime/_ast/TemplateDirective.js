define(
    /* Class name */
    'main/runtime/_ast/TemplateDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (assert, lodash, Directive) {

        'use strict';

        /**
         * @class A template directive.
         *
         * @param {!string}     name    - the template name.
         */
        function TemplateDirective(name, children) {

            assert(lodash.isString(name));

            if (lodash.isUndefined(children)) {
                children = [];
            }

            /* Super constructor */
            Directive.call(this);

            /**
             * The template name.
             *
             * @public
             * @type {!string}
             */
            this.name = name;

            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            this.children = children;//child;
        }

        /* Super class */
        TemplateDirective.prototype = new Directive();


        /**
         * Adds a child node to the HTML unit
         * @param {!Directive} child    - The child that will be added
         */
        TemplateDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {TemplateDirective}
         */
        TemplateDirective.prototype.shallowClone = function() {
            var clone_directive = new TemplateDirective(this.name);
            return clone_directive;
        };

        return TemplateDirective;
    }
);