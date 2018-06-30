define(
    /* Class name */
    'main/runtime/_evaluate/PartialEvaluator',

    /* Class dependencies */
    [
        'main/util/assert', 'lodash', 'main/api/diff/ConstructDiff', 'main/api/diff/ConstructHtmlDiff',
        'main/runtime/Template', 'main/runtime/_evaluate/TemplateInstance', 'main/api/unit/UnitInstance',
        'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/UnitDirective',
        'main/runtime/_ast/ValueDirective', 'main/runtime/_ast/Directive',
        'jquery', 'main/util/Lang', 'main/runtime/_ast/ForDirective', 'main/runtime/_ast/PrintDirective',
        'main/runtime/_ast/RefreshDirective', 'main/runtime/_ast/HtmlUnitDirective', 'main/runtime/_ast/HtmlElement',
        'main/api/diff/Diff', 'main/api/diff/UpdateDiff', 'main/api/diff/Path', 'main/api/diff/InsertIntoArrayDiff',
        'main/api/diff/UpdateHtmlDiff', 'main/api/diff/HtmlPath', 'main/api/path/ArrayNav', 'main/api/path/TupleNav',
        'main/api/diff/AppendDiff', 'main/runtime/_evaluate/FullEvaluator', 'main/api/path/Root',
        'main/runtime/_ast/JsonListDirective', 'main/runtime/_ast/JsonUnitDirective',
        'main/runtime/_ast/IfStatementDirective', 'main/runtime/_ast/IfDirective', 'main/api/path/HtmlUnitNav',
        'main/api/path/UnitNav', 'main/api/path/TemplateNav', 'main/api/path/ForLoopNav', 'main/api/path/RefreshNav',
        'main/api/diff/AppendHtmlDiff', 'main/runtime/_ast/PlainFunction'
    ],

    /* Class symbols */
    function (assert, lodash, ConstructDiff, ConstructHtmlDiff, Template,
              TemplateInstance, UnitInstance, TemplateDirective,
              UnitDirective, ValueDirective, Directive, jquery, Lang, ForDirective, PrintDirective,
              RefreshDirective, HtmlUnitDirective, HtmlElement, Diff, UpdateDiff, Path, InsertIntoArrayDiff,
              UpdateHtmlDiff, HtmlPath, ArrayNav, TupleNav, AppendDiff, FullEvaluator, Root, JsonListDirective,
              JsonUnitDirective, IfStatementDirective, IfDirective, HtmlUnitNav, UnitNav, TemplateNav, ForLoopNav,
              RefreshNav, AppendHtmlDiff, PlainFunction) {

        'use strict';

        /**
         * @class A full evaluator evaluates a template in its entirety.
         *
         */
        function PartialEvaluator() {

        }


        PartialEvaluator.prototype.templateIVM = function (template, vdb, din, annotatedAst) {
            assert(template instanceof Template);
            var d_out = templateIVMNode(template.getTemplateDirective(), vdb, din, annotatedAst, [new TupleNav('TemplateDirective')]);

            return d_out;
        };

        function templateIVMNode (template_directive, vdb, din, annotatedAst, templateInstancePathSteps) {
            assert(template_directive instanceof Directive);


            // this variable will be used to maintain the clone of the template instance path steps so that
            // it only contains that path that led to the current subtree.
            var currentTemplateInstancePathSteps = null;
            var d_out = [];
            var din_prime = [];
            var i, j;
            var delta_expression;

            for (i = 0; i < din.length ; i++) {
                din_prime.push(din[i])
            }
            if (template_directive instanceof RefreshDirective) {

                // Refresh directives cause instantiations of VDB variables,
                // therefore the template IVM phase can also generate VDB Diffs given VDB diffs

                delta_expression = ivmExpression(template_directive.expression, vdb, din, 'JSON++');

                // if null there is no diff matching the expression
                if (!lodash.isNull(delta_expression)) {

                    var var_name = template_directive.variable_name;
                    var var_path = new Path(var_name);

                    // Prefix Diff target with the refresh variable
                    var prefixed_diffs = prefixDiffs(var_path, [delta_expression], 'JSON++');
                    for (i = 0; i < prefixed_diffs.length; i++) {
                        din_prime.push(prefixed_diffs[i]);
                    }


                }

                var currentTemplateInstancePathStepsClone = templateInstancePathSteps.slice(0);
                currentTemplateInstancePathStepsClone.push(new RefreshNav());

                // Visit subtree and append the generated visual diffs into the d_out array
                if (template_directive.hasOwnProperty('children')) {
                    for (i = 0; i < template_directive.children.length; i++) {

                        currentTemplateInstancePathStepsClone.push(new ArrayNav(i));

                        var out_diffs = templateIVMNode(template_directive.children[i], vdb, din_prime,
                            annotatedAst, currentTemplateInstancePathStepsClone);
                        out_diffs = prefixDiffs(new HtmlPath('[' + i + ']'), out_diffs, 'HTML');
                    }
                    for (i = 0; i < out_diffs.length; i++) {
                        d_out.push(out_diffs[i]);
                    }
                }
                return d_out;
            }
            else if (template_directive instanceof PrintDirective) {

                // Diffs that target expressions of Print Directives generate visual layer diffs

                delta_expression = ivmExpression(template_directive.expression, vdb, din, 'JSON++', templateInstancePathSteps);
                if (! Lang.isNullOrUndefined(delta_expression)) {
                    d_out.push(delta_expression);
                }
                return d_out;
            }
            else if (template_directive instanceof IfDirective) {
                annotatedAst.findNode(currentTemplateInstancePathSteps);
                delta_expression = ivmExpression(template_directive.condition.operand1, vdb, din, 'JSON++', templateInstancePathSteps);
            }
            else if (template_directive instanceof ForDirective) {
                delta_expression = ivmExpression(template_directive.expression, vdb, din, 'JSON++', templateInstancePathSteps);

                // if null there is no diff matching the expression
                if (!lodash.isNull(delta_expression)) {

                    // TODO: extend appropriately...
                    assert((delta_expression instanceof UpdateDiff) || (delta_expression instanceof AppendDiff),
                        'only ``update" and ``AppendDiff" diffs are supported at this point');

                    if (delta_expression.getTarget().steps.length == 0) {
                        if (delta_expression instanceof AppendDiff) {
                            vdb[template_directive.variable_name] = din[0].payload; // This will lead to a bug, when we apply multiple diffs at once
                            var fullEvaluator = new FullEvaluator();
                            var evaluated_tree = fullEvaluator.evaluateAstNode(template_directive.children[0], vdb);
                            var directive = fullEvaluator.omitDynamicDirectives(evaluated_tree);
                            // var payload = fullEvaluator.generateJsonUnitState(directive);
                            var payload = fullEvaluator.generateUnitState(directive);


                            var out_diffs = [new AppendDiff(new Path(), payload)];
                        }
                        else if (delta_expression instanceof UpdateDiff) {

                            // generateModelGivenExpression(vdb, template_directive.expression, delta_expression.payload); // This will lead to a bug, when we apply multiple diffs at once
                            vdb[template_directive.expression.expression_instance.string] = delta_expression.payload;
                            var fullEvaluator = new FullEvaluator();
                            var evaluated_tree = fullEvaluator.evaluateAstNode(template_directive, vdb);
                            var directive = fullEvaluator.omitDynamicDirectives(evaluated_tree);
                            // var payload = fullEvaluator.generateJsonUnitState(directive);

                            var newDir = new JsonListDirective(directive.children);
                            var payload = fullEvaluator.generateUnitState(newDir);


                            var out_diffs = [new UpdateDiff(new Path(), payload)];
                        }

                    }
                    else if (delta_expression instanceof InsertIntoArrayDiff) {

                        console.log('got here!');
                        // do something else
                    }
                    else { // if t = [k]s

                        // Get the For-Loop variable
                        var var_name = template_directive.variable_name;

                        // Get [k]s
                        var old_diff_path = delta_expression.target;

                        // Replace [k]s with For-Loop variable
                        var var_path = new TupleNav(var_name);


                        // if diff target is [k]s
                        if (old_diff_path.steps[0] instanceof ArrayNav) {
                            var path_steps = [var_path];
                            for (i = 1; i < old_diff_path.steps.length; i++) {
                                path_steps.push(old_diff_path.steps[i])
                            }
                            delta_expression.target = new Path(path_steps);
                        }
                        else { //TODO: identify this case and make sure it makes sense
                            delta_expression.target = var_path;
                        }

                        // Add it to collection of VDB diffs
                        din_prime.push(delta_expression);

                        if (template_directive.hasOwnProperty('children')) {
                            var out_diffs = [];
                            currentTemplateInstancePathSteps = templateInstancePathSteps.slice(0);
                            currentTemplateInstancePathSteps.push(new ForLoopNav());
                            for (i = 0; i < template_directive.children.length; i++) {
                                if (old_diff_path.steps[0] instanceof ArrayNav) {


                                    var ordinal_step = old_diff_path.steps[0].position * template_directive.children.length + i;

                                    var currentTemplateInstancePathStepsClone = templateInstancePathSteps.slice(0);
                                    currentTemplateInstancePathStepsClone.push(new ArrayNav(ordinal_step));
                                    annotatedAst.findNode(currentTemplateInstancePathSteps);
                                    var current_out_diffs = templateIVMNode(template_directive.children[i], vdb, din_prime,
                                        annotatedAst, currentTemplateInstancePathSteps);

                                    //FIXME: I need to find a better way to differentiate between JSON and HTML units

                                    if (current_out_diffs.length > 0) {
                                        if (current_out_diffs[0].target instanceof Path) {
                                            current_out_diffs = prefixDiffs(new Path([new ForLoopNav(), new ArrayNav(ordinal_step) ]), current_out_diffs, 'JSON++');
                                        }
                                        else if (current_out_diffs[0].target instanceof HtmlPath) {
                                            current_out_diffs = prefixDiffs(new Path([new ArrayNav(ordinal_step)]), current_out_diffs, 'HTML');
                                        }
                                    }

                                    for (j = 0; j < current_out_diffs.length; j++) {
                                        out_diffs.push(current_out_diffs[j]);
                                    }
                                    //out_diffs = prefixDiffs(old_diff_path, out_diffs, 'HTML');
                                }
                            }
                        }
                    }

                    return out_diffs;
                }
                else { // no diff need to implement the last case of the for rule
                    return d_out;
                }
            }

            else if (template_directive instanceof HtmlUnitDirective) {
                if (lodash.isArray(template_directive.children)) {
                    // Clone the template instance path steps so that it only contains that path that led to the current subtree

                    if (template_directive.hasOwnProperty('children')) {
                        for (i = 0; i < template_directive.children.length; i++) {
                            currentTemplateInstancePathSteps = templateInstancePathSteps.slice(0); // efficient way of dublicating an array
                            currentTemplateInstancePathSteps.push(new HtmlUnitNav());
                            currentTemplateInstancePathSteps.push(new ArrayNav(i));
                            var diff_list = templateIVMNode(template_directive.children[i], vdb, din_prime,
                                annotatedAst, currentTemplateInstancePathSteps);
                            var prefixed = prefixDiffs(new Path([new HtmlUnitNav(), new ArrayNav(i)]), diff_list, 'JSON++');
                            d_out = d_out.concat(prefixed);

                        }
                    }
                }
                return d_out;
            }

            else if (template_directive instanceof JsonUnitDirective) {
                if (lodash.isArray(template_directive.children)) {
                    // Clone the template instance path steps so that it only contains that path that led to the current subtree

                    if (template_directive.hasOwnProperty('children')) {
                        for (i = 0; i < template_directive.children.length; i++) {
                            currentTemplateInstancePathSteps = templateInstancePathSteps.slice(0); // efficient way of dublicating an array
                            currentTemplateInstancePathSteps.push(new UnitNav(template_directive.unit_class));
                            currentTemplateInstancePathSteps.push(new ArrayNav(i));
                            var diff_list = templateIVMNode(template_directive.children[i], vdb, din_prime,
                                annotatedAst, currentTemplateInstancePathSteps);
                            if (!((template_directive.children[i] instanceof PrintDirective) ||
                                (template_directive.children[i] instanceof ForDirective) ||
                                (template_directive.children[i] instanceof RefreshDirective))) {


                                var html_diffs = [];
                                for (j = 0; j < diff_list.length; j++) {
                                    //TODO: fix this case!
                                    if (!((diff_list[j] instanceof AppendDiff) || (diff_list[j] instanceof UpdateDiff))) {
                                        html_diffs.push(diff_list[j])
                                    }
                                }
                                if (html_diffs.length > 0) {
                                    out_diffs = prefixDiffs(new HtmlPath('[' + i + ']'), html_diffs, 'HTML');
                                }
                                else {
                                    out_diffs = diff_list;
                                }
                            }

                            if (out_diffs === undefined) {
                                for (j = 0; j < diff_list.length; j++) {
                                    d_out.push(diff_list[j]);
                                }
                            }
                            else {
                                for (j = 0; j < out_diffs.length; j++) {
                                    d_out.push(out_diffs[j]);
                                }
                            }

                            if ((template_directive.children[i] instanceof ForDirective) && (d_out.length > 0)) {
                                // do nothing!
                                d_out = d_out;
                            }
                            else if ((template_directive instanceof JsonUnitDirective) && (d_out.length > 0)) {
                                d_out = prefixDiffs(new Path([new UnitNav(template_directive.unit_class), new Root()]), d_out, 'JSON++');
                            }

                        }
                    }
                }
                return d_out;
            }

            else if (template_directive instanceof TemplateDirective) {
                if (lodash.isArray(template_directive.children)) {
                    // Clone the template instance path steps so that it only contains that path that led to the current subtree

                    if (template_directive.hasOwnProperty('children')) {
                        for (i = 0; i < template_directive.children.length; i++) {
                            currentTemplateInstancePathSteps = templateInstancePathSteps.slice(0); // efficient way of dublicating an array
                            currentTemplateInstancePathSteps.push(new TemplateNav(template_directive.name));
                            currentTemplateInstancePathSteps.push(new ArrayNav(i));
                            var diff_list = templateIVMNode(template_directive.children[i], vdb, din_prime,
                                annotatedAst, currentTemplateInstancePathSteps);

                            var prefixed = prefixDiffs(new Path([new TemplateNav(template_directive.name), new ArrayNav(i)]), diff_list, 'JSON++');
                            d_out = d_out.concat(prefixed);
                        }
                    }
                }
                return d_out;
            }

            else {
                if (lodash.isPlainObject(template_directive.children)) {
                    for (var child_key in template_directive.children) {
                        // check also if property is not inherited from prototype
                        if (template_directive.children.hasOwnProperty(child_key)) {
                            // Clone the template instance path steps so that it only contains that path that led to the current subtree
                            currentTemplateInstancePathSteps = templateInstancePathSteps.slice(0);
                            currentTemplateInstancePathSteps.push(new TupleNav(child_key));
                            var out_diffs = templateIVMNode(template_directive.children[child_key], vdb, din_prime,
                                annotatedAst, currentTemplateInstancePathSteps);

                            if (out_diffs.length > 0) {
                                out_diffs = prefixDiffs(new Path(child_key), out_diffs, 'JSON++');
                            }
                            // probably have to verify that no print, for or refresh directives are immediate children
                            // of current directive
                            for (j=0; j< out_diffs.length; j++) {
                                d_out.push(out_diffs[j]);
                            }
                        }
                    }
                }

                else if (lodash.isArray(template_directive.children)) {
                    if (template_directive.hasOwnProperty('children')) {
                        for (i = 0; i < template_directive.children.length; i++) {
                            // Clone the template instance path steps so that it only contains that path that led to the current subtree
                            currentTemplateInstancePathSteps = templateInstancePathSteps.slice(0);
                            currentTemplateInstancePathSteps.push(new ArrayNav(i));
                            var diff_list = templateIVMNode(template_directive.children[i], vdb, din_prime,
                                annotatedAst, currentTemplateInstancePathSteps);
                            

                            if (diff_list.length > 0) {
                                if (!((template_directive.children[i] instanceof PrintDirective) ||
                                        (template_directive.children[i] instanceof ForDirective) ||
                                        (template_directive.children[i] instanceof RefreshDirective))) {


                                    var html_diffs = [];
                                    for (j = 0; j < diff_list.length; j++) {
                                        //TODO: fix this case!
                                        if (!((diff_list[j] instanceof AppendDiff) || (diff_list[j] instanceof UpdateDiff))) {
                                            html_diffs.push(diff_list[j])
                                        }
                                    }
                                    if (html_diffs.length > 0) {
                                        out_diffs = prefixDiffs(new HtmlPath('[' + i + ']'), html_diffs, 'HTML');
                                    }
                                    else {
                                        out_diffs = diff_list;
                                    }
                                }

                                var local_d_out = [];
                                if (out_diffs === undefined) {
                                    for (j = 0; j < diff_list.length; j++) {
                                        local_d_out.push(diff_list[j]);
                                    }
                                }
                                else {
                                    for (j = 0; j < out_diffs.length; j++) {
                                        local_d_out.push(out_diffs[j]);
                                    }
                                }

                                if ((template_directive instanceof JsonUnitDirective) && (local_d_out.length > 0)) {
                                    local_d_out = prefixDiffs(new Path([new Root()]), local_d_out, 'JSON++');
                                }
                                else if ((template_directive instanceof JsonListDirective ) && (local_d_out.length > 0)) {
                                    local_d_out = prefixDiffs(new Path([new ArrayNav(i)]), local_d_out, 'JSON++');
                                }
                                else {
                                    local_d_out = prefixDiffs(new Path([new ArrayNav(i)]), local_d_out, 'JSON++');
                                }

                                for (j=0; j< local_d_out.length; j++) {
                                    d_out.push(local_d_out[j]);
                                }
                            }
                        }
                    }
                }
                else if (template_directive.hasOwnProperty('child')) {
                    var out_diffs = templateIVMNode(template_directive.child, vdb, din);
                    if (out_diffs.length > 0) {
                        out_diffs = prefixDiffs(new HtmlPath('[' + i + ']'), out_diffs, 'HTML');
                    }
                    for (i = 0 ; i < out_diffs.length ; i++) {
                        d_out.push(out_diffs[i]);
                    }
                }
                return d_out;
            }
        }

        function prefixDiffs(prefix_path, set_of_diffs, type) {
            if (set_of_diffs.length === 0) {
                return set_of_diffs;
            }
            var d_out = [];
            for (var i = 0; i< set_of_diffs.length; i++) {
                var current_diff = set_of_diffs[i];
                assert(current_diff instanceof Diff);
                var new_diff_path_arr = [];
                for (var j = 0; j < prefix_path.steps.length; j++) {
                    new_diff_path_arr.push(prefix_path.steps[j]);
                }
                if (!(lodash.isUndefined(current_diff.getTarget().steps))) {
                    for (j = 0; j < current_diff.getTarget().steps.length; j++) {
                        new_diff_path_arr.push(current_diff.getTarget().steps[j]);
                    }
                }
                if (current_diff instanceof UpdateDiff) {

                    if (type === 'JSON++') {
                        var new_diff_path = new Path(new_diff_path_arr);
                        d_out.push(new UpdateDiff(new_diff_path, current_diff.getPayload()));
                    }
                    else if (type === 'HTML') {
                        var new_diff_path = new HtmlPath(new_diff_path_arr);
                        d_out.push(new UpdateHtmlDiff(new_diff_path, current_diff.getPayload()));
                    }
                }
                else if (current_diff instanceof UpdateHtmlDiff) {
                    if (type === 'JSON++') {
                        var new_diff_path = new Path(new_diff_path_arr);
                        d_out.push(new UpdateDiff(new_diff_path, current_diff.getPayload()));
                    }
                    else if (type === 'HTML') {
                        var new_diff_path = new HtmlPath(new_diff_path_arr);
                        d_out.push(new UpdateHtmlDiff(new_diff_path, current_diff.getPayload()));
                    }
                }
                else if (current_diff instanceof AppendHtmlDiff) {
                    if (type === 'JSON++') {
                        var new_diff_path = new Path(new_diff_path_arr);
                        d_out.push(new AppendDiff(new_diff_path, current_diff.getPayload()));
                    }
                    else if (type === 'HTML') {
                        var new_diff_path = new HtmlPath(new_diff_path_arr);
                        d_out.push(new AppendHtmlDiff(new_diff_path, current_diff.getPayload()));
                    }
                }
                else if (current_diff instanceof AppendDiff) {
                    if (type === 'JSON++') {
                        var new_diff_path = new Path(new_diff_path_arr);
                        d_out.push(new AppendDiff(new_diff_path, current_diff.getPayload()));
                    }
                    else if (type === 'HTML') {
                        var new_diff_path = new HtmlPath(new_diff_path_arr);
                        d_out.push(new AppendHtmlDiff(new_diff_path, current_diff.getPayload()));
                    }
                }
            }
            return d_out;
        }

        function ivmExpression(expression, vdb, din, type, templateInstancePathSteps) {

            var use_template_instance_path_flag = false;

            // If the expression is a plain function without any parameters or a source active function
            // without any diff signatures. It won't contain any path signatures so no diff will be affecting it
            if ( Lang.isNullOrUndefined(expression.getPathSignatures())) {
                return null;
            }


            var path_signatures = expression.getPathSignatures();
            for (var path_signature_index = 0; path_signature_index< path_signatures.length; path_signature_index++) {
                var path_signature = path_signatures[path_signature_index];
                var expression_steps = path_signature.steps;
                for (var i = 0; i < din.length; i++) {
                    var current_diff = din[i];
                    assert(current_diff instanceof Diff);
                    var target = current_diff.getTarget();
                    var diff_steps = target.steps;
                    var len;
                    if (diff_steps.length >= expression_steps.length) {
                        // the expression partially matches the diff
                        // diff_path = expr_path.s
                        var is_there_a_match = true;
                        for (var step_index = 0; step_index < expression_steps.length; step_index++) {
                            var diff_step_i = diff_steps[step_index];
                            var expre_step_i = expression_steps[step_index];
                            if (!diff_steps[step_index].equals(expression_steps[step_index])) {
                                // no match!
                                is_there_a_match = false;
                                break;
                            }
                        }
                        if (is_there_a_match) {
                            var s = [];
                            for (; step_index < diff_steps.length; step_index++) {
                                s.push(diff_steps[step_index])
                            }

                            if (expression.expression_instance instanceof Path) {

                                if (type === 'JSON++') {
                                    if (current_diff instanceof UpdateDiff) {
                                        var new_diff_path = new Path(s);
                                        return new UpdateDiff(new_diff_path, current_diff.getPayload());
                                    }
                                    else if (current_diff instanceof AppendDiff) {
                                        var new_diff_path = new Path(s);
                                        return new AppendDiff(new_diff_path, current_diff.getPayload());
                                    }
                                }
                                else if (type === 'HTML') {
                                    if (current_diff instanceof UpdateDiff) {
                                        var new_diff_path = new HtmlPath(s);
                                        return new UpdateHtmlDiff(new_diff_path, current_diff.getPayload());

                                    }
                                }
                            }
                            else if (expression.expression_instance instanceof PlainFunction) {
                                if (type === 'JSON++') {
                                    if (current_diff instanceof UpdateDiff) {
                                        var new_diff_path = new Path(s);
                                        var fullEvaluator = new FullEvaluator();
                                        var evaluated_node = fullEvaluator.evaluatePrintedPlainFunction(vdb, expression.expression_instance, null);
                                        // var evaluated_tree = fullEvaluator.evaluateAstNode(template_directive.children[0], vdb);
                                        var directive = fullEvaluator.omitDynamicDirectives(evaluated_node);
                                        // var payload = fullEvaluator.generateJsonUnitState(directive);
                                        var payload = fullEvaluator.generateUnitState(directive);
                                        return new UpdateDiff(new_diff_path, payload);
                                    }
                                    else if (current_diff instanceof AppendDiff) {
                                        var new_diff_path = new Path(s);
                                        return new AppendDiff(new_diff_path, current_diff.getPayload());
                                    }
                                }
                            }
                        }

                    }
                    else {
                        var is_there_a_match = true;
                        var step_index = 0;
                        for (; step_index < diff_steps.length; step_index++) {
                            var diff_step_i = diff_steps[step_index];
                            var expre_step_i = expression_steps[step_index];
                            if (!diff_steps[step_index].equals(expression_steps[step_index])) {
                                // no match!
                                is_there_a_match = false;
                                break;
                            }
                        }
                        if (is_there_a_match) {
                            var s = [];
                            for (; step_index < expression_steps.length; step_index++) {
                                s.push(expression_steps[step_index])
                            }
                            // var new_diff_path = new Path(s);
                            // evaluatePath(current_diff.getPayload(), new Path(new_diff_path));
                            if (current_diff instanceof UpdateDiff) {
                                var atiPath;
                                if (use_template_instance_path_flag) {
                                    atiPath = new Path(templateInstancePathSteps);
                                }
                                else {
                                    atiPath = new Path([]);
                                }
                                return new UpdateDiff(atiPath, current_diff.getPayload());
                            }
                            else {
                                assert(false, 'this case hasn\'t been dealt with');
                            }
                        }
                    }

                }
            }
            // No diff matches this expression
            return null;

        }

        function evaluatePath(model_value, path) {
            // TODO: Currently only supports attribute navigation, extend it using ordinal positions as well.
            var model_nav = model_value;
            for (var i = 0; i < path.steps.length; i++) {
                if (path.steps[i] instanceof TupleNav) {
                    model_nav = model_nav[path.steps[i].string];
                }
                else if (path.steps[i] instanceof ArrayNav) {
                    model_nav = model_nav[path.steps[i].position];
                }

                assert(model_nav !== undefined, 'Invalid VDB Path:' + path.string);
            }
            return model_nav;

        }

        function generateModelGivenExpression(model_value, exp, val) {

            if (exp.expression_instance instanceof Path) {
                var path = exp.expression_instance;
                var model_nav = model_value;
                for (var i = 0; i < path.steps.length; i++) {
                    if (path.steps[i] instanceof TupleNav) {
                        if (path.steps.length-1 === i) {
                            model_nav[path.steps[i].string] = val;
                        }
                        else {
                            model_nav[path.steps[i].string] = {};
                            model_nav = model_nav[path.steps[i].string];
                        }
                    }
                    else if (path.steps[i] instanceof ArrayNav) {
                        if (path.steps.length-1 === i) {
                            model_nav[path.steps[i].string] = [val];
                        }
                        else {
                            console.log('Test this case before proceeding');
                            model_nav[path.steps[i].position] = [];
                            // no currently tested tests have covered this feel free to change
                            model_nav = model_nav[path.steps[i].position];
                        }
                    }
                    assert(model_nav !== undefined, 'Invalid VDB Path:' + path.string);
                }
                // model_nav = JSON.parse(JSON.stringify(val));
                // return model_nav;
                return model_value;
            }
            assert(false, "Something's wrong!");


        }



        return PartialEvaluator;
    }
);