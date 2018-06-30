define(
    /* Class name */
    'main/runtime/_render/FullRenderer',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/unit/UnitInstance'],

    /* Class symbols */
    function (assert, lodash, UnitInstance) {

        'use strict';

        /**
         * @class A full renderer renders a template instance in its entirety.
         *
         */
        function FullRenderer() {

        }

        /**
         * Renders the template instance into the HTML element of the given id.
         *
         * @param {!string}             html_id             - the id of the HTML element.
         * @param {!TemplateInstance}   template_instance   - the template instance.
         */
        FullRenderer.prototype.render = function(container_element, unit_instance) {

            //assert(lodash.isString(html_id));
            //assert(template_instance instanceof TemplateInstance);

            /*var container_element = document.getElementById(html_id);
            // var unit_instance = template_instance.root_unit_instance;
            unit_instance.container_element = container_element;
            unit_instance.container_element_id = html_id;*/

            // FIXME: Simulate diffs for each unit instance

            var diffs = unit_instance.pending_diffs;
            lodash.forEach(diffs, function(diff) {
                unit_instance.render(diff);
            });
            unit_instance.pending_diffs = [];

        };

        // TODO: Move to another module with name: "PartialRenderer"
        FullRenderer.prototype.partialRender = function(unit_instance) {
            assert(unit_instance instanceof UnitInstance);
            var diffs = unit_instance.pending_diffs;
            lodash.forEach(diffs, function(diff) {
                unit_instance.render(diff);
            });
            unit_instance.pending_diffs = [];
        };

        return FullRenderer;
    }
);