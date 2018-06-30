define(
    /* Class name */
    'main/runtime/_evaluate/FullEvaluator',

    /* Class dependencies */
    [
        'main/util/assert', 'lodash', 'main/api/diff/ConstructDiff', 'main/api/diff/ConstructHtmlDiff',
        'main/runtime/Template', 'main/runtime/_evaluate/TemplateInstance', 'main/api/unit/UnitInstance',
        'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/UnitDirective',
        'main/runtime/_ast/ValueDirective', 'main/runtime/_ast/Directive',
        'jquery', 'main/util/Lang', 'main/runtime/_ast/ForDirective', 'main/runtime/_ast/PrintDirective',
        'main/runtime/_ast/RefreshDirective', 'main/runtime/_ast/HtmlUnitDirective', 'main/runtime/_ast/HtmlElement',
        'main/runtime/_ast/HtmlBalancedTagElement', 'main/runtime/_ast/HtmlSelfTagClosingElement', 'main/api/diff/Path',
        'main/runtime/_ast/JsonUnitDirective', 'main/runtime/_ast/JsonObjectDirective',
        'main/runtime/_ast/JsonListDirective', 'main/runtime/_ast/PlainFunction', 'main/runtime/_ast/IfStatementDirective',
        'main/runtime/_ast/ElseDirective', 'main/runtime/_ast/ConditionDirective', 'main/runtime/_ast/ExpressionDirective',
        'main/runtime/_ast/IfStatementDirectives', 'main/runtime/_ast/PlaceHolderDirective', 'cryptojs',
        'main/runtime/_ast/UnitDirectiveWrapper', 'main/runtime/_evaluate/Fragmentor', 'main/api/path/TupleNav',
        'main/api/path/ArrayNav', 'main/runtime/_evaluate/AtiOperations', 'main/runtime/_ast/ActionDirective',
        'main/runtime/_ast/PlainAction', 'main/runtime/_ast/BindDirective',

        'main/activeFunctions/Sql' // Active function list
    ],

    /* Class symbols */
    function (assert, lodash, ConstructDiff, ConstructHtmlDiff, Template,
              TemplateInstance, UnitInstance, TemplateDirective,
              UnitDirective, ValueDirective, Directive, jquery, Lang, ForDirective, PrintDirective,
              RefreshDirective, HtmlUnitDirective, HtmlElement, HtmlBalancedTagElement, HtmlSelfTagClosingElement,
              Path, JsonUnitDirective, JsonObjectDirective, JsonListDirective, PlainFunction, IfStatementDirective,
              ElseDirective, ConditionDirective, ExpressionDirective, IfStatementDirectives, PlaceHolderDirective,
              cryptojs, UnitDirectiveWrapper, Fragmentor, TupleNav, ArrayNav, AtiOperations, ActionDirective,
              PlainAction, BindDirective) {

        'use strict';

        /**
         * @class A full evaluator evaluates a template in its entirety.
         *
         */
        function FullEvaluator() {

            this.nested_units = [];

        }

        /**
         * Evaluates the template.
         *
         * @param {!Template} template - the template.
         * @return {!TemplateInstance} the template instance.
         */
        FullEvaluator.prototype.evaluate = function (template) {
            assert(template instanceof Template);
            if (template.getDependencies()[0] === 'main/units/html/HtmlUnit') {
                return evaluateHtmlTemplate(template.getTemplateDirective());
            }
            else {
                return evaluateTemplate(template.getTemplateDirective());
            }
        };

        FullEvaluator.prototype.evaluateTemplateAst = function (template, model, FORWARD) {
            assert(template instanceof Template);
            console.log('template', template);

            // Generating ATI
            var annotated_template_instance = this.evaluateAstNode(template.getTemplateDirective(), model, FORWARD);
            console.log('evaluated AST', annotated_template_instance);


            var fragmented_units_map = Fragmentor.fragmentAstPayload(annotated_template_instance);

            // start new version
            assert((fragmented_units_map["^"] instanceof JsonUnitDirective) ||
                (fragmented_units_map["^"] instanceof HtmlUnitDirective),
                'FORWARD only supports units that are present at the root of the template!');

            var unit_instance_map = {};
            var placeholder_map = {};
            for (var key in fragmented_units_map) {
                if (key != "^") {
                    var fragmented_unit = fragmented_units_map[key];
                    var placeholder_id = fragmented_unit.placeholder_directive.placeholderID;
                    var placeholder_div = fragmented_unit.placeholder_directive.placeholderDiv;
                    placeholder_map[placeholder_id] = placeholder_div;
                }
            }

            for (var key in fragmented_units_map) {
                var unit_specific_evaluated_ast_with_ommited_constructs =
                    this.omitDynamicDirectives(fragmented_units_map[key]);


                if (fragmented_units_map[key] instanceof JsonUnitDirective) {
                    var unit_instance = this.evaluateJsonUnit(unit_specific_evaluated_ast_with_ommited_constructs, FORWARD);
                }
                else if (fragmented_units_map[key] instanceof HtmlUnitDirective) {
                    var unit_instance = evaluateHtmlUnit(unit_specific_evaluated_ast_with_ommited_constructs, placeholder_map, FORWARD);
                }

                fragmented_units_map[key].addUnitInstance(unit_instance);
                unit_instance_map[key] = unit_instance;
            }

            return {
                'templateInstance': new TemplateInstance(unit_instance),
                'evaluatedAstWithDynamicConstructs': annotated_template_instance,
                'unitInstanceMap': unit_instance_map
            };
        };


        /**
         * This function simply omits the dynamic directives (for-loops, refresh statements) from the
         * d AST
         *
         * Notes:
         *      - Currently this function only works with for loops that iterate over arrays... Extensions need to be
         *      made for bags and tuples
         *      -
         * @param node
         * @returns {*|JsonUnitDirective|BindDirective|TemplateDirective|EventDirective|HtmlSelfTagClosingElement}
         */
        FullEvaluator.prototype.omitDynamicDirectives = function(node) {
            assert(node instanceof Directive);
            var newNode = node.shallowClone();

            var children_list = [];
            var children_object = {};
            var child_key;
            var children_list2;

            if (node.hasOwnProperty('children')) {
                if (lodash.isPlainObject(node.children)) {
                    for (child_key in node.children) {
                        // check also if property is not inherited from prototype
                        if (node.children.hasOwnProperty(child_key)) {

                            current_child = node.children[child_key];
                            if ( (current_child instanceof ForDirective) || (current_child instanceof RefreshDirective)) {
                                if (lodash.isPlainObject(current_child.children)) {
                                    for (var childs_child_key in current_child.children) {
                                        if (current_child.children.hasOwnProperty(childs_child_key)) {
                                            children_object[childs_child_key] = current_child.children[childs_child_key];
                                        }
                                    }
                                }
                                for (var i = 0; i < current_child.children.length; i++) {
                                    children_list.push(current_child.children[i]);
                                }
                            }
                            else {
                                children_object[child_key] = current_child;
                            }
                        }
                    }

                    var children_object2 = {};
                    for (child_key in children_object) {
                        if (children_object[child_key] instanceof IfStatementDirectives) {
                            var ifStatementDirectives = children_object[child_key];
                            for (var i = 0; i < ifStatementDirectives.children.length; i++) {
                                var active_directive = this.omitDynamicDirectives(ifStatementDirectives.children[i]);
                                for (var key in active_directive.children) {
                                    children_object2[key] = active_directive.children[key];
                                }
                            }
                        }
                        else if (children_object[child_key] instanceof IfStatementDirective) {
                            var active_directive = this.omitDynamicDirectives(children_object[child_key]);
                            children_object2[child_key] = active_directive;
                        }
                        else if (children_object.hasOwnProperty(child_key)) {
                            children_object2[child_key] = this.omitDynamicDirectives(children_object[child_key]);
                        }
                    }
                    newNode.children = children_object2;

                    // Bind Directives require the expression to be passed to the visual unit
                    if (node.hasOwnProperty('expression')) {
                        newNode.expression = node.expression;
                    }

                    return newNode;
                }
                else if (node instanceof IfStatementDirective) {
                    var statement = node;
                    var active_index = statement.children.length > 1 ? statement.active_index : 0;
                    var active_directive = statement.children[active_index].children;
                    var result = this.omitDynamicDirectives(active_directive);
                    return result;
                }
                else if (node.children instanceof IfStatementDirective) {
                    var statement = node.children;
                    var active_index = statement.children.length > 1 ? statement.active_index : 0;
                    var active_directive = statement.children[active_index].children;
                    var result = this.omitDynamicDirectives(active_directive);
                    return result;
                }
                else if (node instanceof ActionDirective) {
                    return node;
                }
                else if (lodash.isArray(node.children)) {
                    for (var j = 0; j < node.children.length; j++) {
                        var current_child = node.children[j];
                        if ( (current_child instanceof ForDirective) || (current_child instanceof RefreshDirective)
                             || (current_child instanceof IfStatementDirective) ) {
                            for (var i = 0; i < current_child.children.length; i++) {
                                children_list.push(current_child.children[i]);
                            }
                        }
                        else {
                            children_list.push(current_child);
                        }
                    }
                    children_list2 = [];
                    for (j = 0; j < children_list.length; j++) {
                        children_list2.push(this.omitDynamicDirectives(children_list[j]));
                    }
                    newNode.children = children_list2;
                    return newNode;
                }
            }
            else if (node instanceof UnitDirectiveWrapper) {
                newNode.unit_directive = null;//this.omitDynamicDirectives(node.unit_directive);
                return newNode;

            }
            else if (node.hasOwnProperty('child')) {
                children_list.push(node.child);
                children_list2 = [];
                for (j = 0; j < children_list.length; j++) {
                    children_list2.push(this.omitDynamicDirectives(children_list[j]));
                }
                newNode.children = children_list2;
                return newNode;
            }
            else if (!node.hasOwnProperty('child')) {
                return newNode;
            }
        };


        FullEvaluator.prototype.evaluateAstNode = function(node, model, FORWARD, preserveIfStatements = true, unit_node) {
            assert(node instanceof Directive, 'AST Node: '+JSON.stringify(node)+' is not of type: Directive');
            var children_list = [];
            var children_object = {};
            if (node instanceof ForDirective) {
                var loop_var = evaluateExpression(model, node.expression, FORWARD);

                assert(!lodash.isUndefined(loop_var),
                    'Variable: ' + node.expression.expression_instance.string + ' does not appear in the VDB');
                assert(!lodash.isNull(loop_var),
                    'Variable: ' + node.expression.expression_instance.string + ' does not appear in the VDB');
                var len;
                for (i = 0, len = loop_var.length; i < len; i++) {
                    model[node.variable_name] = loop_var[i];
                    for (var j = 0; j < node.children.length; j++) {
                        children_list.push(this.evaluateAstNode(node.children[j], model, FORWARD, preserveIfStatements, unit_node));
                    }
                }
                // higher directives should have no access to that model item
                //delete model[node.expression.expression_instance.string];
                delete model[node.variable_name];

                var newNode = node.shallowClone();
                newNode.children = children_list;
                return newNode;
            }
            else if (node instanceof RefreshDirective) {
                var refresh_var_contents = evaluateExpression(model, node.expression, FORWARD);

                assert(!lodash.isUndefined(refresh_var_contents),
                    'Variable: ' + node.expression.expression_instance.string + ' does not appear in the VDB');
                assert(!lodash.isNull(refresh_var_contents),
                    'Variable: ' + node.expression.expression_instance.string + ' does not appear in the VDB');
                model[node.variable_name] = refresh_var_contents;
                for (var j = 0; j < node.children.length; j++) {
                    children_list.push(this.evaluateAstNode(node.children[j], model, FORWARD, preserveIfStatements, unit_node));
                }

                // higher directives should have no access to that model item
                delete model[node.variable_name];

                var newNode = node.shallowClone();
                newNode.children = children_list;
                return newNode;
            }
            else if (node instanceof BindDirective) {
                var value = evaluatePrintExpression(model, node.expression.expression_instance, FORWARD);
                console.log(value);
                value.expression = node.expression.expression_instance;
                return value
            }
            else if (node instanceof PrintDirective) {

                var value = evaluatePrintExpression(model, node.expression.expression_instance, FORWARD);
                var newNode = value;
                return newNode;
            }
            else if (node instanceof ActionDirective) {

                /*
                 * Creating Plain Action (from Plain Function) and generating a new ActionDirective to encompass the new
                 * Expression Directive that contains it.
                 */
                var function_reference = retrieveReferenceToPlainFunction(model, node.expression.expression_instance);
                var instantiated_args = evaluateFunctionArgs(model, node.expression.expression_instance, FORWARD);
                var newAction = new PlainAction(node.expression.expression_instance.function_name,
                    instantiated_args, function_reference);
                return new ActionDirective(new ExpressionDirective(newAction, null, null));
            }
            else if (node instanceof IfStatementDirectives) {
                var newNode = node.shallowClone();
                for (var i = 0; i < node.children.length; i++) {
                    var ifStatementDirective = node.children[i];
                    var newIfStatementDirective = ifStatementDirective.shallowClone();

                    var seen_true_condition = false;
                    for (var j = 0; j < ifStatementDirective.children.length; j++) {
                        var statement = ifStatementDirective.children[j];
                        if (preserveIfStatements) {
                            var newStatement = statement.shallowClone();
                            newStatement.condition = statement.condition;
                            newStatement.children = this.evaluateAstNode(statement.children, model, FORWARD, preserveIfStatements, unit_node);
                            newIfStatementDirective.children.push(newStatement);
                        }

                        if (!seen_true_condition) {
                            // stop if statement is the last one, and is an else. Otherwise, evaluate condition, and mark accordingly.
                            if (j === (ifStatementDirective.children.length - 1) && !lodash.has(statement, 'condition')) {
                                newIfStatementDirective.active_index = j;
                                seen_true_condition = true;
                            }
                            else if (evaluateCondition(model, statement.condition, FORWARD)) {
                                newIfStatementDirective.active_index = j;
                                seen_true_condition = true;
                            }
                            if (seen_true_condition && !preserveIfStatements) {
                                var newStatement = statement.shallowClone();
                                newStatement.condition = statement.condition;
                                newStatement.children = this.evaluateAstNode(statement.children, model, FORWARD, preserveIfStatements, unit_node);
                                newIfStatementDirective.children.push(newStatement);
                                break;
                            }
                        }
                    }
                    children_list.push(newIfStatementDirective);
                }
                newNode.children = children_list;
                return newNode;
            }
            else if (node instanceof IfStatementDirective) {
                var newNode = node.shallowClone();
                var seen_true_condition = false;
                for (var j = 0; j < node.children.length; j++) {
                    var statement = node.children[j];
                    if (preserveIfStatements) {
                        var newStatement = statement.shallowClone();
                        newStatement.condition = statement.condition;
                        newStatement.children = this.evaluateAstNode(statement.children, model, FORWARD, preserveIfStatements, unit_node);
                        newNode.children.push(newStatement);
                    }

                    if (!seen_true_condition) {
                        // stop if statement is the last one, and is an else. Otherwise, evaluate condition, and mark accordingly.
                        if (j === (node.children.length - 1) && !lodash.has(statement, 'condition')) {
                            newNode.active_index = j;
                            seen_true_condition = true;
                        }
                        else if (evaluateCondition(model, statement.condition)) {
                            newNode.active_index = j;
                            seen_true_condition = true;
                        }
                        if (seen_true_condition && !preserveIfStatements) {
                            var newStatement = statement.shallowClone();
                            newStatement.condition = statement.condition;
                            newStatement.children = this.evaluateAstNode(statement.children, model, FORWARD, preserveIfStatements, unit_node);
                            newNode.children.push(newStatement);
                            break;
                        }
                    }
                }
                return newNode;
            }
            else  if (node instanceof JsonUnitDirective) {
                var newNode = node.shallowClone();
                if (!lodash.isUndefined(unit_node)){
                    this.nested_units.push(unit_node);
                }
                if (node.hasOwnProperty('children')) {
                    for (var i = 0; i < node.children.length; i++) {
                        children_list.push(this.evaluateAstNode(node.children[i], model, FORWARD, preserveIfStatements, newNode));
                    }
                    newNode.children = children_list;
                }
                return newNode;
            }
            else {
                //if (node.expression === undefined) {
                var newNode = node.shallowClone(); //Lang.clone(node); //jquery.extend(false, Object.create(Object.getPrototypeOf(node)), node);
                //}

                if (node.hasOwnProperty('children')) {
                    if (lodash.isPlainObject(node.children)) {
                        for (var child in node.children) {
                            // check also if property is not inherited from prototype
                            if (node.children.hasOwnProperty(child)) {
                                var value = node.children[child];
                                children_object[child] = this.evaluateAstNode(value, model, FORWARD, preserveIfStatements, unit_node);
                            }
                        }
                        newNode.children = children_object;
                    }
                    else if (lodash.isArray(node.children)) {
                        for (var i = 0; i < node.children.length; i++) {
                            children_list.push(this.evaluateAstNode(node.children[i], model, FORWARD, preserveIfStatements, unit_node));
                        }
                        newNode.children = children_list;
                    }
                }
                else if (node.hasOwnProperty('child')) {
                    children_list.push(this.evaluateAstNode(node.child, model, FORWARD, preserveIfStatements, unit_node));
                    newNode.children = children_list;
                }

                return newNode;
            }
        };


        /**
         * This function inputs the model (VDB) variable and a path or PlainFunction 'expression' and outputs
         * the nested model variable with path p or the result of the PlainFunction
         * @param model - The model variable (VDB Instance)
         * @param expressionInstance  - The soon-to-be evaluated expression.
         * @returns {*} - VDB variable.
         */
        function evaluateExpression(model, expressionDirective, FORWARD) {
            var expression = expressionDirective.expression_instance;
            assert((expression instanceof Path) || (expression instanceof PlainFunction));
            assert(model !== undefined, 'VDB variable is undefined');
            var model_value = model;
            if (expression instanceof Path) {
                return evaluatePath(model_value, expression)
            }
            else if (expression instanceof PlainFunction) {
                if (Lang.isNullOrUndefined(model_value[expression.function_name])) {
                    // It must be an active function!
                    var activeFunction =  getAndInitActiveFunction(expression);

                    // replace plain function with active function on the expression instance
                    expressionDirective.expression_instance = activeFunction;
                    return evaluateActiveFunction(model, activeFunction, FORWARD);


                }
                else {
                    return evaluatePlainFunction(model_value, expression, FORWARD);
                }
            }
        }

        /**
         * Imports, initializes and returns the active function with name: <name>
         * @param name - The name of the active function
         * @returns {ActiveFunction?} - The instantiated active function or null if active function is not found
         */
        function getAndInitActiveFunction(expression) {

            var name = expression.function_name;
            // Get the RequireJS module, which has already been loaded
            // obtaining active function from module: 'main/activeFunctions/<name of active function>'
            // <name of active function> have the first char uppercase and the remaining lowercase
            var activeFunctionName = 'main/activeFunctions/'+name.charAt(0).toUpperCase() + name.slice(1);
            var activeFunction = require(activeFunctionName);
            if (Lang.isNullOrUndefined(activeFunction)) {
                return null;
            }

            // Calling the constructor, after unrolling the arguments. Lastly return the instantiated active function!
            return new activeFunction(...expression.args);

            // return new (activeFunction.bind.apply(activeFunction, expression.args));


        }


        /**
         * This function inputs the model (VDB) variable and a path or PlainFunction 'expression' and outputs
         * the ATI subtree that captures the nested model variable p or the result fo the PlainFunction
         * @param model - The model variable (VDB Instance)
         * @param expression - The soon-to-be evaluated expression.
         * * @returns {*} - ATI subtree.
         */
        function evaluatePrintExpression(model, expression, FORWARD) {
            assert((expression instanceof Path) || (expression instanceof PlainFunction));
            assert(model !== undefined, 'VDB variable is undefined');
            var model_value = model;
            if (expression instanceof Path) {
                return evaluatePrintPath(model_value, expression)
            }
            else if (expression instanceof PlainFunction) {
                return evaluatePrintedPlainFunction(model, expression, FORWARD);

                // assert(false, "This case hasn't been implemented yet");
            }
        }

        FullEvaluator.prototype.evaluatePrintedPlainFunction = function(model, expression, FORWARD){
            return evaluatePrintedPlainFunction(model, expression, FORWARD)
        };

        function evaluatePrintedPlainFunction(model, expression, FORWARD) {

            var model_value = evaluatePlainFunction(model, expression, FORWARD);
            if (lodash.isBoolean(model_value) || (lodash.isString(model_value)) || (lodash.isNumber(model_value)) ) {
                return new ValueDirective(model_value);
            }
            else if (lodash.isPlainObject(model_value)) {
                var children = {};
                for (var key in model_value) {
                    if (model_value.hasOwnProperty(key)) {
                        children[key] = generateAstNodes(model_value[key]);
                    }
                }
                var construct = new JsonObjectDirective(children);
                return construct;
            }
            else if (lodash.isArray(model_value)) {
                var children = [];
                for (var i = 0; i< model_value.length; i++) {
                    children.push(generateAstNodes(model_value[i]));
                }
                var construct = new JsonListDirective(children);
                return construct;
            }
        }

        function evaluateCondition(model, condition, FORWARD) {
            var operand1 = condition.operand1 instanceof ExpressionDirective ?
                evaluateExpression(model, condition.operand1.expression_instance, FORWARD) : condition.operand1;
            var operand2 = condition.operand2 instanceof ExpressionDirective ?
                    evaluateExpression(model, condition.operand2.expression_instance, FORWARD) : condition.operand2;
            return condition.eval(operand1, operand2);
        }

        function evaluatePlainFunction(model_value, plainFunction, FORWARD) {
            // var instantiated_args = [];
            // for (var i = 0; i< plainFunction.args.length; i++) {
            //     var arg = plainFunction.args[i];
            //     if (lodash.isString(arg)) {
            //         instantiated_args.push(arg);
            //     }
            //     else {
            //         instantiated_args.push(evaluateExpression(model_value, arg, FORWARD));
            //     }
            // }
            var instantiated_args = evaluateFunctionArgs(model_value, plainFunction, FORWARD);
            var function_reference = retrieveReferenceToPlainFunction(model_value, plainFunction);
            return function_reference.apply(function_reference, instantiated_args);
        }

        function evaluateFunctionArgs(model_value, plainFunctionOrAction, FORWARD) {

            var instantiated_args = [];
            for (var i = 0; i< plainFunctionOrAction.args.length; i++) {
                var arg = plainFunctionOrAction.args[i];
                if (lodash.isString(arg)) {
                    instantiated_args.push(arg);
                }
                else {
                    instantiated_args.push(evaluateExpression(model_value, new ExpressionDirective(arg, null, null), FORWARD));
                }
            }
            return instantiated_args;

        }

        /**
         * Accesses and returns reference to plain function from the model/vdb.
         * @param model_value
         * @param plainFunction
         * @returns {*}
         */
        function retrieveReferenceToPlainFunction(model_value, plainFunction) {
            return model_value[plainFunction.function_name];
        }

        function evaluateActiveFunction(model_value, activeFunction, FORWARD) {
            var init_function = activeFunction.getInitFunction();
            var args = [FORWARD];
            var ret = init_function.apply(init_function, args);
            return ret;

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

        function evaluatePrintPath(model_value, path) {
            // TODO: Currently only supports attribute navigation, extend it using ordinal positions as well.
            // for (var i = 0; i < path.steps.length; i++) {
            //     model_value = model_value[path.steps[i].string];
            //     assert(model_value !== undefined, 'Invalid VDB Path:' + path.string);
            // }
            var model_value = evaluatePath(model_value, path);
            if (lodash.isBoolean(model_value) || (lodash.isString(model_value)) || (lodash.isNumber(model_value)) ) {
                return new ValueDirective(model_value);
            }
            else if (lodash.isPlainObject(model_value)) {
                var children = {};
                for (var key in model_value) {
                    if (model_value.hasOwnProperty(key)) {
                        children[key] = generateAstNodes(model_value[key]);
                    }
                }
                var construct = new JsonObjectDirective(children);
                return construct;
            }
            else if (lodash.isArray(model_value)) {
                var children = [];
                for (var i = 0; i< model_value.length; i++) {
                    children.push(generateAstNodes(model_value[i]));
                }
                var construct = new JsonListDirective(children);
                return construct;
            }

        }

        function generateAstNodes(node) {
            if (lodash.isBoolean(node) || (lodash.isString(node)) || (lodash.isNumber(node)) ) {
                return new ValueDirective(node);
            }
            else if (lodash.isPlainObject(node)) {
                var children = {};
                for (var key in node) {
                    if (node.hasOwnProperty(key)) {
                        children[key] = generateAstNodes(node[key]);
                    }
                }
                var construct = new JsonObjectDirective(children);
                return construct;
            }
            else if (lodash.isArray(node)) {
                var children = [];
                for (var i = 0; i< node.length; i++) {
                    children.push(generateAstNodes(node[i]));
                }
                var construct = new JsonListDirective(children);
                return construct;
            }
        }

        function evaluateHtmlTemplate(directive) {

            assert(directive instanceof TemplateDirective);

            var unit_instance = evaluateHtmlUnitDeprecated(directive.children[0]);
            return new TemplateInstance(unit_instance);
        }


        FullEvaluator.prototype.evaluateJsonUnit = function(directive, forward) {
            assert(directive instanceof JsonUnitDirective);
            var unit_state = AtiOperations.generateJsonUnitState(directive);

            var unit_instance = new UnitInstance(directive.getUnit(), unit_state, forward);
            var construct_diff = new ConstructDiff(unit_state);
            unit_instance.pending_diffs.push(construct_diff);
            unit_instance.container_element = directive.placeholder_directive.placeholderDiv;
            return unit_instance;
        };

        FullEvaluator.prototype.generateUnitState = function(directive) {
            if ( (directive instanceof HtmlBalancedTagElement) ||
                    (directive instanceof HtmlSelfTagClosingElement) ||
                    (directive instanceof HtmlElement)  ) {
                return AtiOperations.generateHtmlUnitState(directive)
            }
            else {
                return AtiOperations.generateJsonUnitState(directive)
            }
        };


        // FullEvaluator.prototype.generateJsonUnitState = function(directive) {
        //     assert(directive instanceof Directive);
        //     var child_key;
        //     var current_obj;
        //     var current_arr;
        //     var i;
        //     var len;
        //     if (directive instanceof JsonUnitDirective) {
        //         // TODO(nick): Fragmentation sets nested units to null, so skip their evaluation for now.
        //         if (directive.children != null) {
        //             return this.generateJsonUnitState(directive.children[0]);
        //         }
        //         else {
        //             return null;
        //         }
        //     }
        //     else if (directive instanceof JsonObjectDirective) {
        //         current_obj = {};
        //         for (child_key in directive.children) {
        //             if (directive.children.hasOwnProperty(child_key)) {
        //                 var value = this.generateJsonUnitState(directive.children[child_key]);
        //                 current_obj[child_key] = value;
        //             }
        //         }
        //         return current_obj;
        //     }
        //     else if (directive instanceof ValueDirective) {
        //         return directive.contents;
        //     }
        //     else if (directive instanceof JsonListDirective) {
        //         current_arr = [];
        //         for (i = 0, len = directive.children.length; i < len; i++) {
        //             current_arr.push(this.generateJsonUnitState(directive.children[i]));
        //         }
        //         return current_arr;
        //     }
        //     // TODO: the below evaluation for IfStatementDirective is deprecated. Remove once stable.
        //     else if (directive instanceof IfStatementDirective) {
        //         current_obj = {};
        //         for (i = 0; i < directive.children.length; i++) {
        //             for (child_key in directive.children[i]) {
        //                 // check also if property is not inherited from prototype
        //                 if (directive.children[i].hasOwnProperty(child_key)) {
        //                     var key_values = this.generateJsonUnitState(directive.children[i]);
        //                     for (var key in key_values) {
        //                         current_obj[key] = key_values[key];
        //                     }
        //                 }
        //             }
        //         }
        //         return current_obj;
        //     }
        //     else if (directive instanceof UnitDirectiveWrapper) {
        //         return directive.placeholder_directive.placeholderDiv;
        //     }
        //     else {
        //         assert(false, 'Payload cannot be instantiated. Directive:'+JSON.stringify(directive)+' is not supported.')
        //     }
        // };

        /**
         * This function traverses the AST directives and constructs the respective HTML string. The HTML string will
         * be used by the HTML unit to generate the page by calling the respective renderers.
         *
         * Note:
         * Make sure that no artificial spaces (new lines and so on) are added as it might contaminate the template
         * instance with additional DOM elements that do not exist in the template. This might cause issues when the
         * Template IVM generates template instance diffs.
         *
         * @param {HtmlUnitDirective} directive - The root HTML Unit  directive
         * @returns {UnitInstance}              - The instantiated template (Template Instance)
         */
        function evaluateHtmlUnit(directive, placeholder_map, forward) {
            assert(directive instanceof HtmlUnitDirective);

            var eval_html_by_creating_dom = true;

            // TODO: Decide which implementation is faster
            // Currently, the first method which creates the dom elements appears much faster than the second method which creates the html string.
            //            (5-10 times faster for the working example of this test case).
            // Need to test this on more complicated html examples, but the first method should be even faster.
            if (eval_html_by_creating_dom) {
                var t0 = performance.now();
                var template = AtiOperations.generateHtmlUnitStateUsingDOM(directive, placeholder_map);
                var t1 = performance.now();
            }
            else {
                var t0 = performance.now();
                var unit_state = AtiOperations.generateHtmlUnitState(directive);
                var template = document.createElement('div');
                template.innerHTML = unit_state;

                var placeholderWrappers = template.getElementsByClassName("_placeholder");
                for (var i = 0; i < placeholderWrappers.length; i++) {
                    placeholderWrappers[i].appendChild(placeholder_map[placeholderWrappers[i].id]);
                }
                var t1 = performance.now();
            }
            // TODO: remove the performance logging once no longer needed.
            // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate html state using ', (eval_html_by_creating_dom ? 'dom element creation' : 'string creation'));

            var unit_instance = new UnitInstance(directive.getUnit(), template, forward);
            var construct_diff = new ConstructHtmlDiff(template);
            unit_instance.pending_diffs.push(construct_diff);
            if (lodash.has(directive, 'placeholder_directive')) {
                unit_instance.container_element = directive.placeholder_directive.placeholderDiv;
            }
            return unit_instance;
        }

        FullEvaluator.prototype.generateHtmlUnitState = function(directive) {

        };
        // FullEvaluator.prototype.generateHtmlUnitState = function(directive) {
        //     assert(directive instanceof Directive);
        //     if (directive instanceof TemplateDirective) {
        //         //var newNode = '<div> <!-- template directive: ' + directive.name + ' -->';
        //         var newNode = '<div>';
        //         for (var i = 0; i < directive.children.length; i++) {
        //             //children_list.push(evaluateAstNode(node.children[i], model));
        //             newNode += this.generateHtmlUnitState(directive.children[i]);
        //         }
        //         newNode += '</div>';
        //         return newNode;
        //     }
        //     else if (directive instanceof HtmlUnitDirective) {
        //         //var newNode = '<div> <!-- HTML unit directive -->';
        //         var newNode = '<div>';
        //         for (i = 0; i < directive.children.length; i++) {
        //             //children_list.push(evaluateAstNode(node.children[i], model));
        //             newNode += this.generateHtmlUnitState(directive.children[i]);
        //         }
        //         newNode += '</div>';
        //         return newNode;
        //     }
        //     else if (directive instanceof HtmlElement) {
        //         // TODO: Add set of attributes to the returning object
        //         var newNode = '<' + directive.tag +'> ';
        //         for (i = 0; i < directive.children.length; i++) {
        //             //children_list.push(evaluateAstNode(node.children[i], model));
        //             newNode += this.generateHtmlUnitState(directive.children[i]);
        //         }
        //         newNode += '</' + directive.tag +'>';
        //         return newNode;
        //     }
        //     else if (directive instanceof HtmlBalancedTagElement) {
        //         // TODO: Add set of attributes to the returning object
        //         var newNode = '<' + directive.tag +'>';
        //         for (i = 0; i < directive.children.length; i++) {
        //             //children_list.push(evaluateAstNode(node.children[i], model));
        //             newNode += this.generateHtmlUnitState(directive.children[i]);
        //         }
        //         newNode += '</' + directive.tag +'>';
        //         return newNode;
        //     }
        //     else if (directive instanceof HtmlSelfTagClosingElement) {
        //         // TODO: Add set of attributes to the returning object
        //         var newNode = '<' + directive.tag +'/>';
        //         return newNode;
        //     }
        //     else if (directive instanceof ValueDirective) {
        //         var newNode = directive.contents;
        //         return newNode;
        //     }
        //     else if (directive instanceof PlaceHolderDirective) {
        //         //console.log(directive.placeholderID);
        //         return '<div class="_placeholder" id="' + directive.placeholderID + '"></div>';
        //     }
        //     else if (directive instanceof UnitDirectiveWrapper) {
        //         return '<div class="_placeholder" id="' + directive.placeholder_directive.placeholderID + '"></div>';
        //     }
        //     else {
        //         assert(false, 'Payload cannot be instantiated. Directive:'+JSON.stringify(directive)+' is not supported.');
        //     }
        // };

        // function generateHtmlUnitStateUsingDOM(directive, placeholder_map) {
        //     assert(directive instanceof Directive);
        //
        //     if (directive instanceof ValueDirective) {
        //         return directive.contents;
        //     }
        //     else if (directive instanceof UnitDirectiveWrapper) {
        //         return placeholder_map[directive.placeholder_directive.placeholderID];
        //     }
        //     else if (directive instanceof HtmlSelfTagClosingElement) {
        //         var newNode = document.createElement(directive.tag);
        //         for (var attribute in directive.attributes) {
        //             newNode[attribute] = String(directive.attributes[attribute]);
        //         }
        //         return newNode;
        //     }
        //     else {
        //         var element_type = 'div';
        //         if (directive instanceof HtmlBalancedTagElement) {
        //             // TODO: Add set of attributes to the returning object
        //             element_type = directive.tag;
        //         }
        //
        //         var newNode = document.createElement(element_type);
        //
        //         for (var attribute in directive.attributes) {
        //             //newNode[attribute] = String(directive.attributes[attribute]);
        //             newNode.setAttribute(attribute, directive.attributes[attribute]);
        //         }
        //
        //         for (var i = 0; i < directive.children.length; i++) {
        //             // Note: use append instead of appendChild because we also must support addition of strings when the child is a ValueDirective.
        //             newNode.append(generateHtmlUnitStateUsingDOM(directive.children[i], placeholder_map));
        //         }
        //
        //         return newNode;
        //     }
        // }


        function evaluateHtmlUnitDeprecated(directive) {

            assert(directive instanceof UnitDirective);

            var unit_state = directive.child;
            var unit_instance = new UnitInstance(directive.getUnit(), unit_state);
            var construct_diff = new ConstructHtmlDiff(unit_state);
            unit_instance.pending_diffs.push(construct_diff);
            return unit_instance;
        }

        function evaluateTemplate(directive) {

            assert(directive instanceof TemplateDirective);

            var unit_instance = evaluateUnit(directive.child);
            return new TemplateInstance(unit_instance);
        }

        function evaluateUnit(directive) {

            assert(directive instanceof UnitDirective);

            var unit_state = evaluateValue(directive.child);
            var unit_instance = new UnitInstance(directive.getUnit(), unit_state);
            var construct_diff = new ConstructDiff(unit_state);
            unit_instance.pending_diffs.push(construct_diff);
            return unit_instance;
        }

        function evaluateValue(directive) {

            assert(directive instanceof ValueDirective);

            // FIXME: Fix the parser to return JSON, instead of using eval() to convert from a string
            return eval('var x = ' + directive.contents + '; x;');
        }

        return FullEvaluator;
    }
);