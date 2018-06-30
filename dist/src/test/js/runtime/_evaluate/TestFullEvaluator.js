define(
    /* Class name */
    'test/runtime/_evaluate/TestFullEvaluator',

    /* Class dependencies */
    [ 'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/HtmlElement',
        'main/runtime/_ast/HtmlUnitDirective', 'main/runtime/_ast/ForDirective', 'lodash',
        'main/runtime/_ast/ExpressionDirective', 'main/api/diff/Path', 'main/api/diff/UpdateDiff',
        'main/runtime/_ast/RefreshDirective', 'main/runtime/_ast/PrintDirective',
        'main/runtime/_ast/ValueDirective', 'main/runtime/_evaluate/FullEvaluator', 'main/runtime/Template',
        'jquery', 'lodash', 'main/api/path/PathSignature', 'main/MainForward', 'text!./templates/google-maps-with-no-ifs.fwd',
        'text!./templates/fragmentation-with-json-units.fwd',
        'main/runtime/_ast/JsonUnitDirective', 'main/runtime/_ast/JsonObjectDirective', 'text!./templates/fragmentation-with-html-units.fwd',
        'text!./templates/fragmentation-with-html-unit-as-parent.fwd', 'text!./templates/deep_template.fwd', 'text!./templates/shallow_template.fwd',
        'text!./templates/shallow_template_with_fragment.fwd', 'text!./templates/deep_template_with_fragment.fwd',
        'text!./templates/html_attributes.fwd'
    ],

    /* Class symbols */
    function (TemplateDirective, HtmlElement, HtmlUnitDirective, ForDirective, _, ExpressionDirective, Path,
              UpdateDiff, RefreshDirective, PrintDirective, ValueDirective, FullEvaluator, Template, jQuery, lodash,
              PathSignature, Forward, template, fragmentation_json_template, JsonUnitDirective, JsonObjectDirective, fragmentation_html_template,
              fragmentation_html_as_parent_template, deep_template, shallow_template, shallow_template_with_fragment, deep_template_with_fragment,
              html_attributes_template) {
1
        'use strict';

        describe('The Full Evaluator ', function () {




            it('can evaluate an html template', function () {
                var template_node = new TemplateDirective('main');
                var vdb_var_expression = new ExpressionDirective(new Path('^.array_var'), new PathSignature('^.array_var'), null);

                var refreshArrayAlias = new RefreshDirective('array_alias', vdb_var_expression);


                var html_unit = new HtmlUnitDirective();
                var table = new HtmlElement('table');


                var for_element_alias_expression = new ExpressionDirective(new Path('array_alias'),
                    new PathSignature('array_alias'), null);
                var for_element_alias = new ForDirective('element_alias', for_element_alias_expression);


                var second_tr = new HtmlElement('tr');


                var td = new HtmlElement('td');
                var td2 = new HtmlElement('td');
                var td3 = new HtmlElement('td');


                var printDir = new PrintDirective(new ExpressionDirective(new Path('element_alias'),
                    new PathSignature('element_alias'), null));
                td.addChild(new ValueDirective("Jill"));
                td2.addChild(new ValueDirective("Smith"));
                td3.addChild(printDir);

                for_element_alias.addChild(second_tr);
                second_tr.addChild(td);
                second_tr.addChild(td2);
                second_tr.addChild(td3);
                html_unit.addChild(table);
                table.addChild(for_element_alias);
                template_node.addChild(refreshArrayAlias);
                refreshArrayAlias.addChild(html_unit);
                console.log(template_node);


                //var ast = new Ast(template_node);

                var template = new Template(template_node);

                var json = 'a value';
                var update_diff = new UpdateDiff(new Path('^.products'), json);

                //ast.templateIVM(ast.root, {}, [update_diff]);

                var full_evaluator = new FullEvaluator();

                var vdb = {};
                vdb['^'] = {array_var : ['bla1', 'bla2', 'bla3']};
                //vdb['^']['array_var'] = ['bla1', 'bla2', 'bla3'];
                var template_instance = full_evaluator.evaluateTemplateAst(template, vdb);
                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);

                var unit_instance = template_instance.templateInstance.root_unit_instance;
                unit_instance.container_element = container_element;

                var diffs = unit_instance.pending_diffs;
                lodash.forEach(diffs, function(diff) {
                    unit_instance.render(diff);
                });

                expect(true).toBe(true);

            });

        });


        describe('The Full Evaluator', function () {


            it('can evaluate a google maps unit with a nested highcharts', function () {

                var i;
                function getData(n) {
                    var arr = [];
                    for (i = 0; i < n; i = i + 1) {
                        arr.push(
                            {
                                lat : chance.latitude(),
                                lng : chance.longitude(),
                                opacity: Math.random()
                            }
                        );
                    }
                    return arr;
                }

                var n = 100;
                Forward.vdb.coordinates = getData(n);
                Forward.display(template);
                expect(true).toBe(true);
            });

            function prepareVDB(num_of_markers) {
                function getData(n) {
                    var arr = [];
                    for (var i = 0; i < n; i = i + 1) {
                        arr.push(
                            {
                                lat : chance.latitude(),
                                lng : chance.longitude(),
                                opacity: Math.random(),
                                address: chance.address()
                            }
                        );
                    }
                    return arr;
                }
                Forward.vdb.coordinates = getData(num_of_markers);

                var i;
                function getData2(n) {
                    var arr = [];
                    for (i = 0; i < n; i = i + 1) {
                        arr.push({
                                y: 2 * Math.sin(i / 100) + Math.random()+53
                            }
                        );
                    }
                    return arr;
                }

                var n = 100;
                Forward.vdb.rooms = [
                    {
                        measurements: getData2(n)
                    }
                ];

                Forward.vdb.measurements = getData2(n);


                var percentColors = [
                    { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
                    { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0 } },
                    { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } } ];

                Forward.vdb.getColorForPercentage = function(num) {
                    var pct = (num)/100;
                    //console.log('sup', pct, num);
                    for (var i = 1; i < percentColors.length - 1; i++) {
                        if (pct < percentColors[i].pct) {
                            break;
                        }
                    }
                    var lower = percentColors[i - 1];
                    var upper = percentColors[i];
                    var range = upper.pct - lower.pct;
                    var rangePct = (pct - lower.pct) / range;
                    var pctLower = 1 - rangePct;
                    var pctUpper = rangePct;

                    var color = {
                        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                    };
                    function componentToHex(c) {
                        var hex = c.toString(16);
                        return hex.length == 1 ? "0" + hex : hex;
                    }
                    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
                };
            }

            it('can evaluate and fragment nested json units', function() {
                // NOTE: The template for fragmentation testing only uses Leaflet units because GoogleMaps units do not work offline.
                prepareVDB(10);
                Forward.display(fragmentation_json_template);
                expect(true).toBe(true);
                // TODO: evaluate correctness of fragmentation (basic check)
            });


            it('can evaluate and fragment nested html units', function() {
                prepareVDB(10);
                Forward.display(fragmentation_html_template);
                expect(true).toBe(true);
            });

            it('can evaluate and fragment units within a parent html unit', function() {
                prepareVDB(10);
                Forward.display(fragmentation_html_as_parent_template);
                expect(true).toBe(true);
            });

            it('testing deep template', function() {
                Forward.display(deep_template);
                expect(true).toBe(true);
            });

            it('testing shallow template', function() {
                Forward.display(shallow_template);
                expect(true).toBe(true);
            });

            it('testing shallow template with fragment', function() {
                Forward.display(shallow_template_with_fragment);
                expect(true).toBe(true);
            });

            it('testing deep template with fragment', function() {
                Forward.display(deep_template_with_fragment);
                expect(true).toBe(true);
            });

            it('can evaluate an HTML template with attributes', function() {
                Forward.display(html_attributes_template);
                expect(true).toBe(true);
            });
        });
    }
);