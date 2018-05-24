define(
    /* Class name */
    'main/runtime/Template',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/TemplateDirective'],

    /* Class symbols */
    function (assert, lodash, TemplateDirective) {

        'use strict';

        /**
         * @class A template.
         *
         * @param {!TemplateDirective} template_directive - the root template directive.
         *
         */
        function Template(template_directive) {

            assert(template_directive instanceof TemplateDirective);

            /**
             * The root template directive.
             *
             * @private
             * @type {!TemplateDirective}
             */
            this._template_directive = template_directive;

            /**
             * The module dependencies of the template.
             *
             * @private
             * @type {!string[]}
             */

            //  FIXME: uncomment findDependencies function call when I fix the following FIXME...
            //this._dependencies = findDependencies(template_directive);
            this._dependencies = ['main/units/html/HtmlUnit'];
        }

        /**
         * Gets the root template directive.
         *
         * @returns {!TemplateDirective} the root template directive.
         */
        Template.prototype.getTemplateDirective = function () {
            return this._template_directive;
        };


        /**
         * Gets the module dependencies of the template.
         *
         * @returns {!string[]} the module dependencies of the template.
         */
        Template.prototype.getDependencies = function () {
            return this._dependencies;
        };

        /**
         * Finds the module dependencies recursively within a directive tree.
         *
         * @param {!TemplateDirective} template_directive - the root template directive.
         * @returns {!string[]} the module dependencies.
         */
        function findDependencies(template_directive) {

            assert(template_directive instanceof TemplateDirective);

            // FIXME: Recurse within directive tree
            var unit_directive = template_directive.children[0];
            return [unit_directive.unit_class];
        }

        return Template;
    }
);