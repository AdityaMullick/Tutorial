define(
    /* Class name */
    'main/runtime/_evaluate/Fragmentor',

    /* Class dependencies */
    [
        'main/util/assert', 'lodash', 'main/runtime/_ast/JsonUnitDirective', 'main/runtime/_ast/HtmlUnitDirective',
        'main/runtime/_ast/PlaceHolderDirective', 'main/runtime/_ast/JsonObjectDirective', 'cryptojs',
        'main/runtime/_ast/UnitDirectiveWrapper', 'main/runtime/_ast/TemplateDirective', 'main/api/diff/Path',
        'main/api/path/ArrayNav', 'main/api/path/UnitNav', 'main/api/path/HtmlUnitNav', 'main/api/path/TemplateNav',
        'main/api/path/TupleNav', 'main/runtime/_ast/ForDirective', 'main/api/diff/UpdateDiff', 'main/api/path/ForLoopNav',
        'main/api/diff/AppendDiff', 'main/api/diff/AppendHtmlDiff', 'main/api/diff/HtmlPath', 'main/api/diff/UpdateHtmlDiff',
        'main/runtime/_evaluate/AtiOperations', 'main/runtime/_ast/RefreshDirective'
    ],

    /* Class symbols */
    function (assert, lodash, JsonUnitDirective, HtmlUnitDirective, PlaceHolderDirective, JsonObjectDirective, cryptojs,
              UnitDirectiveWrapper, TemplateDirective, Path, ArrayNav, UnitNav, HtmlUnitNav, TemplateNav, TupleNav,
              ForDirective, UpdateDiff, ForLoopNav, AppendDiff, AppendHtmlDiff, HtmlPath, UpdateHtmlDiff, AtiOperations,
              RefreshDirective) {

        'use strict';

        /**
         * @class The runtime.
         *
         */
        function Fragmentor() {
        }


        Fragmentor.prototype.assignAttributes = function(turn2Json, element) {
            if (lodash.isNull(turn2Json)){
                return element;
            }
            else {
                var attributes =  AtiOperations.generateJsonUnitState(turn2Json);
                for (var i = 0; i< attributes.attributes.length; i++) {
                    for (var key in attributes.attributes[i]) {
                        if (attributes.attributes[i].hasOwnProperty(key)) {
                            element.setAttribute(key, attributes.attributes[i][key]);
                        }
                    }

                }

                return element;
            }

        };

        Fragmentor.prototype.fragmentAstPayload = function(node, node_prefix, parent_reference, child_key) {
            var fragmented_units_map = {};

            if (node_prefix === undefined) {
                // node_prefix is omitted for the call on the root, so it's assumed to be '^'
                var root_id = '^';
                var hashed_node_path = cryptojs.SHA1("^").toString();
                parent_reference = node;

                // The root template, can only have one child
                child_key = 0;
                node = node.children[0];

                // ignore Refresh directives that appear between the template directive and the first unit
                while (node instanceof RefreshDirective) {
                    parent_reference = node;
                    node = node.children[0];
                }

                fragmented_units_map[root_id] = node;
                if (node instanceof JsonUnitDirective) {
                    var nested_fragmented_units = this.fragmentAstPayload(node.children[0], root_id);
                    Object.assign(fragmented_units_map, nested_fragmented_units);
                    // Create the DOM element which is to be this fragmented unit's placeholder.
                    var placeholder_div = document.createElement("div");
                    placeholder_div.id = hashed_node_path;
                    placeholder_div = this.assignAttributes(node.attributes, placeholder_div);

                    var placeholder_directive = new PlaceHolderDirective(hashed_node_path, placeholder_div);
                    var unit_directive_wrapper = new UnitDirectiveWrapper(placeholder_directive, node);


                    // Set this node's reference in its parent to a PlaceHolderDirective as it must be fragmented out.
                    parent_reference.children[child_key] = unit_directive_wrapper;

                    node.addPlaceholderDirective(placeholder_directive);
                }
                else if (node instanceof HtmlUnitDirective) {
                    // Create the DOM element which is to be this fragmented unit's placeholder.
                    var placeholder_div = document.createElement("div");
                    placeholder_div.id = hashed_node_path;
                    placeholder_div = this.assignAttributes(node.attributes, placeholder_div);




                    var placeholder_directive = new PlaceHolderDirective(hashed_node_path, placeholder_div);
                    var unit_directive_wrapper = new UnitDirectiveWrapper(placeholder_directive, node);


                    // Set this node's reference in its parent to a PlaceHolderDirective as it must be fragmented out.
                    parent_reference.children[child_key] = unit_directive_wrapper;

                    node.addPlaceholderDirective(placeholder_directive);
                    for (var i = 0; i < node.children.length; i++) {
                        var next_fragmented_units = this.fragmentAstPayload(node.children[i], root_id + "[" + i + "]", node.children, i);
                        Object.assign(fragmented_units_map, next_fragmented_units);
                    }
                }
            }
            else if (node instanceof JsonUnitDirective || node instanceof HtmlUnitDirective) {
                var node_path = node_prefix + "." + node.unit_class;
                // The hashed ID is generated using SHA1 which is non-deterministic.
                var hashed_node_path = cryptojs.SHA1(node_path).toString();
                fragmented_units_map[node_path] = node;

                // Create the DOM element which is to be this fragmented unit's placeholder.
                var placeholder_div = document.createElement("div");
                placeholder_div.id = hashed_node_path;

                placeholder_div = this.assignAttributes(node.attributes, placeholder_div);

                // *** TODO: This code mutates the ATI tree while it shouldn't. It also fragments the ATI tree. Resolve ***

                var placeholder_directive = new PlaceHolderDirective(hashed_node_path, placeholder_div)
                var unit_directive_wrapper = new UnitDirectiveWrapper(placeholder_directive, node);


                // Set this node's reference in its parent to a PlaceHolderDirective as it must be fragmented out.
                parent_reference[child_key] = unit_directive_wrapper;

                // *********************************************************************************************************

                //node.placeholder = placeholder_directive;
                node.addPlaceholderDirective(placeholder_directive);

                // Continue fragmentation on the unit directive's children.
                for (var child in node.children) {
                    var nested_fragmented_units = this.fragmentAstPayload(node.children[child], node_path);
                    Object.assign(fragmented_units_map, nested_fragmented_units);
                }
            }
            else if (node instanceof JsonObjectDirective) {
                for (var child_key in node.children) {
                    var next_node_prefix = node_prefix + "." + child_key;
                    var nested_fragmented_units = this.fragmentAstPayload(node.children[child_key], next_node_prefix, node.children, child_key);
                    Object.assign(fragmented_units_map, nested_fragmented_units);
                }
            }
            else if (node.children !== undefined) {
                if (node.children.length == 1) {
                    var nested_fragmented_units = this.fragmentAstPayload(node.children[0], node_prefix, node.children, 0);
                    Object.assign(fragmented_units_map, nested_fragmented_units);
                }
                else {
                    for (var i = 0; i < node.children.length; i++) {
                        var next_fragmented_units = this.fragmentAstPayload(node.children[i], node_prefix + "[" + i + "]", node.children, i);
                        Object.assign(fragmented_units_map, next_fragmented_units);
                    }
                }
            }

            return fragmented_units_map;
        };

        function isChildAnAnnotationNode(node) {
            return (node instanceof ForDirective);
        }


        Fragmentor.prototype.obtainUnitInstanceWithPath = function(node, diff) {

            var path = diff.getTarget();
            assert(path instanceof Path);

            var unit_path_steps = [];
            var latest_unit = null;
            for (var i = 0; i < path.steps.length; i++) {
                var curr_step = path.steps[i];
                if (curr_step instanceof TemplateNav) {
                    assert(node instanceof TemplateDirective);
                    assert(node.name === curr_step.unit_class);
                    unit_path_steps.push(curr_step);
                }
                else if (curr_step instanceof ArrayNav){

                    node = node.children[curr_step.position];

                    if (!isChildAnAnnotationNode(node)) {
                        unit_path_steps.push(curr_step);
                    }

                }
                else if (curr_step instanceof UnitNav){
                    node = node.unit_directive;
                    assert(node instanceof JsonUnitDirective);
                    latest_unit = node;
                    node = node.children[0];
                    ++i; // the root token is also in the path ignoring it for now
                    unit_path_steps = [path.steps[i]]; // adding the root
                }
                else if (curr_step instanceof HtmlUnitNav){
                    node = node.unit_directive;
                    assert(node instanceof HtmlUnitDirective);
                    latest_unit = node;
                    i++;
                    assert(path.steps[i] instanceof ArrayNav, 'Fragmentation error');
                    node = node.children[path.steps[i].position];
                    // i++;

                    // The <% html %> visual unit is replaced by a div, with a child that contains the descendants
                    // (therefore ArrayNav(0) needs to be added to the unit_path_steps
                    unit_path_steps = [new ArrayNav(0), path.steps[i]];
                }
                else if (curr_step instanceof TupleNav){
                    node = node.children[curr_step.attribute];
                    unit_path_steps.push(curr_step);
                }
                else if (curr_step instanceof ForLoopNav){
                    assert(node instanceof ForDirective);
                    ++i; // get the ordinal of the child of the for-loop directive
                    unit_path_steps.push(path.steps[i]); // the ordinal
                    node = node.children[path.steps[i].position];

                }
            }

            var d_prime;
            if (latest_unit instanceof HtmlUnitDirective) {
                if (diff instanceof UpdateDiff) {
                    d_prime = new UpdateHtmlDiff(new HtmlPath(unit_path_steps), diff.getPayload());

                }
                else if (diff instanceof AppendDiff) {
                    d_prime = new AppendHtmlDiff(new HtmlPath(unit_path_steps), diff.getPayload())
                }
            }
            else {
                if (diff instanceof UpdateDiff) {
                    d_prime = new UpdateDiff(new Path(unit_path_steps), diff.getPayload());

                }
                else if (diff instanceof AppendDiff) {
                    d_prime = new AppendDiff(new Path(unit_path_steps), diff.getPayload())
                }
            }
            latest_unit._unit_instance.pending_diffs.push(d_prime);

            return latest_unit._unit_instance;

        };

        // Returns the singleton runtime, so that callers do not have to manually construct a runtime object
        return new Fragmentor();
    }
);