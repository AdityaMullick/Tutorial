define(
    /* Class name */
    'main/runtime/Runtime',

    /* Class dependencies */
    [
        'main/util/assert', 'lodash', 'main/runtime/Template', 'main/runtime/_evaluate/FullEvaluator',
        'main/runtime/_render/FullRenderer', 'main/runtime/_evaluate/PartialEvaluator',
        'main/runtime/_evaluate/EvaluatedAstWithConstructs', 'main/runtime/_evaluate/Fragmentor',
        'main/api/path/TupleNav', 'main/api/path/ArrayNav'
    ],

    /* Class symbols */
    function (assert, lodash, Template, FullEvaluator, FullRenderer, PartialEvaluator, EvaluatedAstWithConstructs,
              Fragmentor, TupleNav, ArrayNav) {

        'use strict';

        /**
         * @class The runtime.
         *
         */
        function Runtime() {

            /**
             * @private
             * @type {TemplateInstance}
             */
            this._template_instance = null;

            /**
             *
             * @type {null}
             * @private
             */
            this._evaluated_AST_with_constructs = null;

            /**
             * @private
             * @type {!FullEvaluator}
             */
            this._full_evaluator = new FullEvaluator();

            /**
             * @private
             * @type {!FullRenderer}
             */
            this._full_renderer = new FullRenderer();


            this._partial_evaluator = new PartialEvaluator();

            this._template = null;

            this._unit_instance_map;

            this.vdb = null;

        }

        /**
         * Displays a template.
         *
         * @param {!string}     html_id     - the id of the HTML element to render into.
         * @param {!Template}   template    - the template.
         */
        Runtime.prototype.display = function(html_id, template) {

            assert(lodash.isString(html_id), 'The HTML element id must be a string');
            assert(document.getElementById(html_id) !== null,
                'The HTML document must have an element with id "' + html_id + '"');
            assert(template instanceof Template, 'Template must be provided');

            if (this._template_instance === null) {
                // Use the full evaluator and full renderer if there is no existing template instance

                var template_instance = this._full_evaluator.evaluate(template);
                this._full_renderer.render(html_id, template_instance);
                this._template_instance = template_instance;
            } else {
                assert(false, 'FIXME');
            }

        };


        Runtime.prototype.fullyEvaluate = function(html_id, template, vdb) {
            assert(template instanceof Template, 'Template must be provided');
            assert(lodash.isString(html_id), 'The HTML element id must be a string');
            assert(document.getElementById(html_id) !== null,
                'The HTML document must have an element with id "' + html_id + '"');
            this._template = template;
            this.vdb = vdb;
            var FORWARD = this;
            var evaluated_template_constructs = this._full_evaluator.evaluateTemplateAst(template, vdb, FORWARD);
            this._template_instance = evaluated_template_constructs.templateInstance;
            this._unit_instance_map = evaluated_template_constructs.unitInstanceMap;


            this._evaluated_AST_with_constructs = new EvaluatedAstWithConstructs(evaluated_template_constructs.evaluatedAstWithDynamicConstructs);
            var root_template_div = document.getElementById(html_id);
            root_template_div.appendChild(this._unit_instance_map['^'].container_element);
            this._full_renderer.render(this._unit_instance_map['^'].container_element,  this._unit_instance_map['^']);
            var me = this;

            for (var key in me._unit_instance_map) {
                if (key != "^") {
                    me._full_renderer.render(me._unit_instance_map[key].container_element, me._unit_instance_map[key]);
                }
            }

            return this;

        };

        function mutateVdb(model_value, diff) {
            // TODO: Currently only supports attribute navigation, extend it using ordinal positions as well.
            var path = diff.getTarget();
            var model_nav = model_value;
            var len  = path.steps.length;
            for (var i = 0; i < len-1; i++) {
                if (path.steps[i] instanceof TupleNav) {
                    model_nav = model_nav[path.steps[i].string];
                }
                else if (path.steps[i] instanceof ArrayNav) {
                    model_nav = model_nav[path.steps[i].position];
                }

                assert(model_nav !== undefined, 'Invalid VDB Path:' + path.string);
            }
            if (path.steps[len-1] instanceof TupleNav) {
                model_nav[path.steps[len-1].string] = diff.getPayload();
            }
            else if (path.steps[len-1] instanceof ArrayNav) {
                model_nav[path.steps[len-1].position] = diff.getPayload();
            }


        }

        function ApplyDiffsToVdb(diff_list, vdb) {
            for (var i = 0; i<diff_list.length; i++) {
                mutateVdb(vdb, diff_list[i]);
            }
        }


        Runtime.prototype.partiallyEvaluate = function(diff_list, vdb) {
            ApplyDiffsToVdb(diff_list, vdb);
            var diffs = this._partial_evaluator.templateIVM(this._template, vdb, diff_list, this._evaluated_AST_with_constructs);
            var unit_instance;
            for (var i = 0; i < diffs.length; i++) {
                unit_instance = Fragmentor.obtainUnitInstanceWithPath(this._evaluated_AST_with_constructs._evaluatedAstWithConstructs, diffs[i]);
                this._full_renderer.partialRender(unit_instance)
            }
        };

        Runtime.prototype.applyDiffs = function(diffs) {
            this.partiallyEvaluate(diffs, this.vdb);
        };

        // Returns the singleton runtime, so that callers do not have to manually construct a runtime object
        return new Runtime();
    }
);