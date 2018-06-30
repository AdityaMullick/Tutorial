define(
    /* Class name */
    'test/runtime/_evaluate/TestRuntime',

    /* Class dependencies */
    [ 'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/HtmlElement',
        'main/runtime/_ast/HtmlUnitDirective', 'main/runtime/_ast/ForDirective', 'lodash',
        'main/runtime/_ast/ExpressionDirective', 'main/api/diff/Path', 'main/api/diff/UpdateDiff',
        'main/runtime/_ast/RefreshDirective', 'main/runtime/_ast/PrintDirective',
        'main/runtime/_ast/ValueDirective', 'main/runtime/Runtime', 'main/runtime/Template',
        'jquery', 'lodash', 'main/api/path/KeyNav'
    ],

    /* Class symbols */
    function (TemplateDirective, HtmlElement, HtmlUnitDirective, ForDirective, _, ExpressionDirective, Path,
              UpdateDiff, RefreshDirective, PrintDirective, ValueDirective, Runtime, Template, jQuery, lodash, KeyNav) {

        'use strict';

        describe('The Runtime', function () {




            it('can evaluate an AST in full and display it', function () {

                /*
                The following template AST is for this template:
                 <% template main %>
                    <% refresh array_alias = array_var %>

                    <% html %>

                         <table style="width:100%">
                             <% for element_alias in array_alias %>
                                 <tr>
                                     <td>Jill</td>
                                     <td>Smith</td>
                                     <td> <% print element_alias %></td>
                                 </tr>

                             <% end for %>
                         </table>

                    <% end html %>

                 */

                var template_node = new TemplateDirective('main');
                var vdb_var_expression = new ExpressionDirective(new Path('array_var'), new Path('array_var'), null);
                var refreshArrayAlias = new RefreshDirective('array_alias', vdb_var_expression);
                var html_unit = new HtmlUnitDirective();
                var table = new HtmlElement('table');
                var table_body = new HtmlElement('tbody');

                var for_element_alias_expression = new ExpressionDirective(new Path('array_alias'),
                    new Path('array_alias'), null);
                var for_element_alias = new ForDirective('element_alias', for_element_alias_expression);
                var second_tr = new HtmlElement('tr');
                var td = new HtmlElement('td');
                var td2 = new HtmlElement('td');
                var td3 = new HtmlElement('td');
                var printDir = new PrintDirective(new ExpressionDirective(new Path('element_alias'),
                    new Path('element_alias'), null));
                td.addChild(new ValueDirective("Jill"));
                td2.addChild(new ValueDirective("Smith"));
                td3.addChild(printDir);
                for_element_alias.addChild(second_tr);
                second_tr.addChild(td);
                second_tr.addChild(td2);
                second_tr.addChild(td3);
                html_unit.addChild(table);
                table.addChild(table_body);
                table_body.addChild(for_element_alias);
                template_node.addChild(refreshArrayAlias);
                refreshArrayAlias.addChild(html_unit);
                var template = new Template(template_node);
                var vdb = {};
                vdb['array_var'] = ['bla1', 'bla2', 'bla3'];
                //var template_instance = full_evaluator.evaluateTemplateAst(template, vdb);
                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);
                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template, vdb);
                expect(document.getElementById('unit_instance_test').innerHTML).
                    toEqual('<div><table> <tbody> <tr> <td> Jill</td><td> Smith</td><td> bla1</td></tr><tr> <td> Jill</td><td> Smith</td><td> bla2</td></tr><tr> <td> Jill</td><td> Smith</td><td> bla3</td></tr></tbody></table></div>');

            });


            it('can construct a template and apply a diff to the template', function () {

                /*
                 The following template AST is for this template:
                 <% template main %>
                 <% refresh ^.array_alias = ^.array_var %>

                 <% html %>

                 <table style="width:100%">
                 <% for ^.element_alias in ^.array_alias %>
                 <tr>
                 <td>Jill</td>
                 <td>Smith</td>
                 <td> <% print ^.element_alias %></td>
                 </tr>

                 <% end for %>
                 </table>

                 <% end html %>

                 */

                var template_node = new TemplateDirective('main');
                var vdb_var_expression = new ExpressionDirective(new Path('array_var'), null);
                var refreshArrayAlias = new RefreshDirective('array_alias', vdb_var_expression);
                var html_unit = new HtmlUnitDirective();
                var table = new HtmlElement('table');

                var for_element_alias_expression = new ExpressionDirective(new Path('array_alias'), null);
                var for_element_alias = new ForDirective('element_alias', for_element_alias_expression);


                var second_tr = new HtmlElement('tr');


                var td = new HtmlElement('td');
                var td2 = new HtmlElement('td');
                var td3 = new HtmlElement('td');


                var printDir = new PrintDirective(new ExpressionDirective(new Path('element_alias'), null));
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



                var template = new Template(template_node);


                var vdb = {};
                vdb['array_var'] = ['bla1', 'bla2', 'bla3'];
                //var template_instance = full_evaluator.evaluateTemplateAst(template, vdb);
                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);

                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template, vdb);


                var json = 'a value';
                var update_diff = new UpdateDiff(new Path('array_var[2]'), json);

                Runtime.partiallyEvaluate([update_diff], vdb);


                expect(true).toBe(true);

            });

            it('can construct a template and apply a diff to the template', function () {
                var products = [
                    {fw_id: 1, product_name: 'name1', zipcode: 93091, amount : 5},
                    {fw_id: 2, product_name: 'name2', zipcode: 93093, amount : 15},
                    {fw_id: 3, product_name: 'name2', zipcode: 93091, amount : 55},
                    {fw_id: 4, product_name: 'name1', zipcode: 93093, amount : 45}
                ];

                var vdb = {};
                vdb['^.products'] = products;



                var setVdbObject = function(key, object) {
                    vdb[key] = object;
                };

                var getVdbObject = function(key) {
                    return vdb[key];
                };


                var group_by = function (path, group_by_attribute, parameterized_identifier) {
                    var groups = {};
                    var index = {};
                    var array = vdb[path.string];
                    array.forEach( function(element) {
                        console.log(element);
                        var group = element[group_by_attribute];
                        groups[group] = groups[group] || [];
                        groups[group].push( element );
                        index[element.fw_id] = group;
                    });

                    setVdbObject(parameterized_identifier, index);
                    setVdbObject(parameterized_identifier+'group_by_attr', group_by_attribute);
                    setVdbObject(parameterized_identifier+'input_path', path);
                    return Object.keys(groups).map( function( group )
                    {
                        return {fw_id: group, group: groups[group]};
                    })
                };

                var products_diff = new UpdateDiff(new Path('^.products<1>.amount'), 125);

                var group_by_delta = function (diff, parameterized_identifier, target_path) {

                    var assigned_to = getVdbObject(parameterized_identifier+'input_path');

                    var diff_target_steps = diff.getTarget().steps;

                    var inner_steps = [];
                    var i = 0;
                    for (; i< assigned_to.steps.length; i++) {
                        if (!assigned_to.steps[i].equals(diff_target_steps[i])) {
                            inner_steps.push(diff_target_steps[i]);
                        }
                    }


                    for (; i < diff_target_steps.length; i++) {
                        inner_steps.push(diff_target_steps[i]);
                    }

                    // checking if the incoming diff is targeting the group-by attribute
                    var does_diff_target_group_by_attr = false;
                    var group_by_attr = getVdbObject(parameterized_identifier+'group_by_attr');
                    for (i = 0; i < inner_steps.length; i++) {
                        console.log(inner_steps[i].string, group_by_attr);
                        if (diff_target_steps[i].string === '.'+group_by_attr) {
                            does_diff_target_group_by_attr = true;
                            break;
                        }
                    }

                    // the input diff doesn't target the group-by attribute
                    if (!does_diff_target_group_by_attr) {
                        var primary_key = inner_steps[0].key;
                        var hash_index = getVdbObject(parameterized_identifier);
                        var group_by_key = hash_index[primary_key];
                        inner_steps.unshift(new KeyNav(group_by_key));
                        for (i = (target_path.steps.length - 1); i >= 0 ; i--) {
                            inner_steps.unshift(target_path.steps[i]);
                        }
                        var new_target = new Path(inner_steps);

                        if (diff instanceof UpdateDiff) {
                            var new_diff = new UpdateDiff(new_target, diff.getPayload())
                            return new_diff
                        }
                        else {
                            // TODO: all other cases
                            return null;
                        }

                    }

                };
                var result = group_by(new Path('^.products'), 'product_name', 'group_index');
                vdb['^.group_by_result'] = result;
                var grouped_by_product_name = [
                    { fw_id : 'name1', group:
                        [
                            {fw_id: 1, product_name: 'name1', zipcode: 93091, amount : 5},
                            {fw_id: 4, product_name: 'name1', zipcode: 93093, amount : 45}
                        ]
                    },
                    { fw_id : 'name2', group:
                        [
                            {fw_id: 2, product_name: 'name2', zipcode: 93093, amount : 15},
                            {fw_id: 3, product_name: 'name2', zipcode: 93091, amount : 55}
                        ]
                    }
                ];

                expect(result).toEqual(grouped_by_product_name);


                var group_by_diff = group_by_delta(products_diff, 'group_index', new Path('^.group_by_result'));


                var sort_func = function(array_path, sort_by_term, parameterized_identifier) {
                    var index1 = {};
                    var array = vdb[array_path.string];
                    var new_arr = array.slice(0);
                    new_arr.sort(function (a, b) {
                            if (a[sort_by_term] > b[sort_by_term]) {
                                return 1;
                            }
                            if (a[sort_by_term] < b[sort_by_term]) {
                                return -1;
                            }
                            // a must be equal to b so use the fw_id
                            if (a.fw_id > b.fw_id) {
                                return 1;
                            }

                            if (a.fw_id < b.fw_id) {
                                return -1;
                            }

                            // fail safe mechanism
                            return 0;
                        }
                    );


                    for (var i = 0; i < new_arr.length; i++) {
                        index1[new_arr[i].fw_id] = i;
                    }


                    setVdbObject(parameterized_identifier, index1);
                    return new_arr
                };

                result = sort_func(new Path('^.group_by_result'), 'fw_id', 'first_sort_by');

                var first_sort_result = result;

                expect(result[0].fw_id).toEqual('name1');
                expect(result[1].fw_id).toEqual('name2');


                for (var j = 0; j< result.length; j++) {
                    vdb['^.sort_by_result['+j+'].group'] = first_sort_result[j].group;
                    result = sort_func(new Path('^.sort_by_result['+j+'].group'), 'fw_id', j+'_sort_by');
                    if (j === 0 ) {
                        expect(result[0].fw_id).toEqual(1);
                        expect(result[1].fw_id).toEqual(4);
                    }
                    else if (j === 1) {
                        expect(result[0].fw_id).toEqual(2);
                        expect(result[1].fw_id).toEqual(3);
                    }
                    console.log(result);
                }




            });


        });
    }
);