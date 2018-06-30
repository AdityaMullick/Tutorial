define(
    /* Class name */
    'main/runtime/_evaluate/AtiOperations',

    /* Class dependencies */
    [
        'main/util/assert', 'lodash', 'main/runtime/_ast/JsonUnitDirective', 'main/runtime/_ast/JsonObjectDirective',
        'main/runtime/_ast/ValueDirective', 'main/runtime/_ast/IfStatementDirective', 'main/runtime/_ast/UnitDirectiveWrapper',
        'main/runtime/_ast/Directive', 'main/runtime/_ast/JsonListDirective', 'main/runtime/_ast/HtmlUnitDirective',
        'main/runtime/_ast/HtmlElement', 'main/runtime/_ast/HtmlBalancedTagElement', 'main/runtime/_ast/HtmlSelfTagClosingElement',
        'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/PlaceHolderDirective', 'main/runtime/_ast/ActionDirective'
    ],

    /* Class symbols */
    function (assert, lodash, JsonUnitDirective, JsonObjectDirective, ValueDirective, IfStatementDirective,
              UnitDirectiveWrapper, Directive, JsonListDirective, HtmlUnitDirective, HtmlElement, HtmlBalancedTagElement,
              HtmlSelfTagClosingElement, TemplateDirective, PlaceHolderDirective, ActionDirective) {

        'use strict';

        /**
         * @class A full evaluator evaluates a template in its entirety.
         *
         */
        function AtiOperations() {
        }

        AtiOperations.prototype.generateJsonUnitState = function(directive) {
            assert(directive instanceof Directive);
            var child_key;
            var current_obj;
            var current_arr;
            var i;
            var len;
            if (directive instanceof JsonUnitDirective) {
                // TODO(nick): Fragmentation sets nested units to null, so skip their evaluation for now.
                if (directive.children != null) {
                    return this.generateJsonUnitState(directive.children[0]);
                }
                else {
                    return null;
                }
            }

            else if (directive instanceof ActionDirective) {
                return directive.expression.expression_instance;
            }
            else if (directive instanceof JsonObjectDirective) {
                current_obj = {};
                for (child_key in directive.children) {
                    if (directive.children.hasOwnProperty(child_key)) {
                        var value = this.generateJsonUnitState(directive.children[child_key]);
                        current_obj[child_key] = value;
                    }
                }
                if (directive.hasOwnProperty('expression')) {
                    current_obj.expression = directive.expression;
                }
                return current_obj;
            }
            else if (directive instanceof ValueDirective) {
                return directive.contents;
            }
            else if (directive instanceof JsonListDirective) {
                current_arr = [];
                for (i = 0, len = directive.children.length; i < len; i++) {
                    current_arr.push(this.generateJsonUnitState(directive.children[i]));
                }
                return current_arr;
            }
            // TODO: the below evaluation for IfStatementDirective is deprecated. Remove once stable.
            else if (directive instanceof IfStatementDirective) {
                current_obj = {};
                for (i = 0; i < directive.children.length; i++) {
                    for (child_key in directive.children[i]) {
                        // check also if property is not inherited from prototype
                        if (directive.children[i].hasOwnProperty(child_key)) {
                            var key_values = this.generateJsonUnitState(directive.children[i]);
                            for (var key in key_values) {
                                current_obj[key] = key_values[key];
                            }
                        }
                    }
                }
                return current_obj;
            }
            else if (directive instanceof UnitDirectiveWrapper) {
                return directive.placeholder_directive.placeholderDiv;
            }
            else {
                assert(false, 'Payload cannot be instantiated. Directive:'+JSON.stringify(directive)+' is not supported.')
            }
        };

        AtiOperations.prototype.generateHtmlUnitStateUsingDOM = function(directive, placeholder_map) {
            assert(directive instanceof Directive);

            if (directive instanceof ValueDirective) {
                return directive.contents;
            }
            else if (directive instanceof UnitDirectiveWrapper) {
                return placeholder_map[directive.placeholder_directive.placeholderID];
            }
            else if (directive instanceof HtmlSelfTagClosingElement) {
                var newNode = document.createElement(directive.tag);
                for (var attribute in directive.attributes) {
                    newNode[attribute] = String(directive.attributes[attribute]);
                }
                return newNode;
            }
            else if (directive instanceof HtmlUnitDirective) {
                return this.generateHtmlUnitStateUsingDOM(directive.children[0], placeholder_map);
            }
            else {
                var element_type = 'div';
                if (directive instanceof HtmlBalancedTagElement) {
                    // TODO: Add set of attributes to the returning object
                    element_type = directive.tag;
                }

                var newNode = document.createElement(element_type);

                for (var attribute in directive.attributes) {
                    //newNode[attribute] = String(directive.attributes[attribute]);
                    newNode.setAttribute(attribute, directive.attributes[attribute]);
                }

                for (var i = 0; i < directive.children.length; i++) {
                    // Note: use append instead of appendChild because we also must support addition of strings when the child is a ValueDirective.
                    newNode.append(this.generateHtmlUnitStateUsingDOM(directive.children[i], placeholder_map));
                }

                return newNode;
            }
        }


        AtiOperations.prototype.generateHtmlUnitState = function(directive) {
            assert(directive instanceof Directive);
            if (directive instanceof TemplateDirective) {
                //var newNode = '<div> <!-- template directive: ' + directive.name + ' -->';
                var newNode = '<div>';
                for (var i = 0; i < directive.children.length; i++) {
                    //children_list.push(evaluateAstNode(node.children[i], model));
                    newNode += this.generateHtmlUnitState(directive.children[i]);
                }
                newNode += '</div>';
                return newNode;
            }
            else if (directive instanceof HtmlUnitDirective) {
                //var newNode = '<div> <!-- HTML unit directive -->';
                var newNode = '<div>';
                for (i = 0; i < directive.children.length; i++) {
                    //children_list.push(evaluateAstNode(node.children[i], model));
                    newNode += this.generateHtmlUnitState(directive.children[i]);
                }
                newNode += '</div>';
                return newNode;
            }
            else if (directive instanceof HtmlElement) {
                // TODO: Add set of attributes to the returning object
                var newNode = '<' + directive.tag +'> ';
                for (i = 0; i < directive.children.length; i++) {
                    //children_list.push(evaluateAstNode(node.children[i], model));
                    newNode += this.generateHtmlUnitState(directive.children[i]);
                }
                newNode += '</' + directive.tag +'>';
                return newNode;
            }
            else if (directive instanceof HtmlBalancedTagElement) {
                // TODO: Add set of attributes to the returning object
                var newNode = '<' + directive.tag +'>';
                for (i = 0; i < directive.children.length; i++) {
                    //children_list.push(evaluateAstNode(node.children[i], model));
                    newNode += this.generateHtmlUnitState(directive.children[i]);
                }
                newNode += '</' + directive.tag +'>';
                return newNode;
            }
            else if (directive instanceof HtmlSelfTagClosingElement) {
                // TODO: Add set of attributes to the returning object
                var newNode = '<' + directive.tag +'/>';
                return newNode;
            }
            else if (directive instanceof ValueDirective) {
                var newNode = directive.contents;
                return newNode;
            }
            else if (directive instanceof PlaceHolderDirective) {
                //console.log(directive.placeholderID);
                return '<div class="_placeholder" id="' + directive.placeholderID + '"></div>';
            }
            else if (directive instanceof UnitDirectiveWrapper) {
                return '<div class="_placeholder" id="' + directive.placeholder_directive.placeholderID + '"></div>';
            }
            else {
                assert(false, 'Payload cannot be instantiated. Directive:'+JSON.stringify(directive)+' is not supported.');
            }
        };

        return new AtiOperations();
    }
);