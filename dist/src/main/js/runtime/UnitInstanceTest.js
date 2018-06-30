define(
    /* Class name */
    'main/runtime/UnitInstanceTest',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'jquery', 'main/runtime/Runtime', 'main/runtime/Template', 'main/api/diff/Diff'],

    /* Class symbols */
    function (assert, lodash, jQuery, Runtime, Template, Diff) {

        'use strict';

        var CONTAINER_ID = 'unit_instance_test';

        /**
         * @class Tests a unit instance for incremental rendering.
         *
         * @param {!Template}   template                - the initial template to be incrementally rendered.
         * @param {string}      [container='<div />']   - the container for the unit instance, defaults to '<div />'.
         *
         */
        function UnitInstanceTest(template, container) {
            assert(template instanceof Template, 'Template must be provided');

            if (container === undefined) {
                container = '<div />';
            } else {
                assert(lodash.isString(container),
                    'Optional container must be the string representation of a HTML element. ' +
                    'For example: <div style="width: 50%" />');
            }

            display(template, container);
        }

        /**
         * Displays the initial template.
         *
         * @param {!Template} template  - the initial template.
         * @param {!string}   container - the container for the unit instance.
         */
        function display(template, container) {

            // Remove any existing container element(s)
            lodash.forEach(document.body.children, function (child) {
                if (child.getAttribute('id') === CONTAINER_ID) {
                    document.body.removeChild(child);
                }
            });

            // Create new container element
            var container_element = jQuery.parseHTML(container)[0];
            container_element.setAttribute('id', CONTAINER_ID);
            document.body.appendChild(container_element);

            // Reset the runtime
            Runtime._template_instance = null;

            // Display the template within the container element
            Runtime.display(CONTAINER_ID, template);
        }

        /**
         * Gets the unit instance.
         *
         * @returns {!UnitInstance} the unit instance.
         */
        UnitInstanceTest.prototype.getUnitInstance = function() {
            return Runtime._template_instance.root_unit_instance;
        };

        /**
         * Gets the UI component.
         *
         * @returns {!Object} the UI component.
         */
        UnitInstanceTest.prototype.getComponent = function() {
            return this.getUnitInstance().getUiObject('^');
        };

        /**
         * Renders a diff.
         *
         * @param {!Diff} diff - the diff.
         */
        UnitInstanceTest.prototype.render = function(diff) {

            assert(diff instanceof Diff, 'Diff must be provided');

            return this.getUnitInstance().render(diff);
        };

        return UnitInstanceTest;
    }
);