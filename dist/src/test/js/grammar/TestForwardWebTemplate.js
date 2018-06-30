define(
    /* Class name */
    'test/grammar/TestForwardWebTemplate',

    /* Class dependencies */
    ['jquery', 'main/util/assert', 'main/runtime/Runtime', '../../../main/js/grammar/forward-web', 'text!test/grammar/template1.fwd',
        'text!test/grammar/template2.fwd', 'text!test/grammar/template3.1.fwd',
        'text!test/grammar/template3.fwd', 'text!test/grammar/template4.fwd', 'text!test/grammar/template5.fwd',
        'text!test/grammar/decimals.fwd', 'text!test/grammar/if-else.fwd', 'text!test/grammar/if-else-syntax.fwd',
        'main/api/diff/UpdateDiff', 'main/api/diff/Path', 'main/api/path/TupleNav','main/api/path/ArrayNav',
        'text!test/grammar/highcharts_template.fwd', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/AppendDiff',
        'text!test/grammar/leaflet.fwd', 'main/runtime/_ast/IfDirective', 'main/runtime/_ast/ElifDirective',
        'main/runtime/_ast/ElseDirective', 'main/runtime/_ast/ConditionDirective', 'main/runtime/_ast/IfStatementDirective',
        'main/runtime/_ast/IfStatementDirectives'
    ],

    /* Class symbols */
//<<<<<<< HEAD
//    function (jQuery, Runtime, parser, file, file2, file31, file3, file4, file5, UpdateDiff, Path,
//              TupleNav, ArrayNav, highcharts_template, InsertIntoArrayDiff, AppendDiff, leaflet_template) {
//=======
    function (jQuery, assert, Runtime, parser, file, file2, file31, file3, file4, file5, decimalsFile, ifElseFile,
              ifElseSyntaxFile, UpdateDiff, Path, TupleNav, ArrayNav, highcharts_template, InsertIntoArrayDiff, AppendDiff,
              leaflet_template, IfDirective, ElifDirective, ElseDirective, ConditionDirective, IfStatementDirective,
              IfStatementDirectives) {
//>>>>>>> 6a851b345c6f934409385d8f6d5ea9b0a0e8c5c3

        'use strict';

        describe('The grammar', function () {
            var i;
            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
            function getData(n) {
                var arr = [],
                    a,
                    b,
                    c,
                    spike;
                for (i = 0; i < n; i = i + 1) {
                    if (i % 100 === 0) {
                        a = 2 * Math.random();
                    }
                    if (i % 1000 === 0) {
                        b = 2 * Math.random();
                    }
                    if (i % 10000 === 0) {
                        c = 2 * Math.random();
                    }
                    if (i % 50000 === 0) {
                        spike = 10;
                    } else {
                        spike = 0;
                    }
                    arr.push(
                      2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
                    );

                    //arr.push({
                    //    name: 'Point '+i,
                    //    color: getRandomColor(),
                    //    y: 2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
                    //});

                }
                return arr;
            }

            it('works on template1.fwd', function () {
                //console.log(parser.parse('sada.dsa.dasdas'));
                expect(true).toBe(true);
                console.log('template:', file);
                var template = parser.parse(file);
                console.log('AST:', template);

            });

            it('works on template3.1.fwd', function() {

                //var file = readTextFile('template1.fwd');
                var vdb = {};
                vdb['array_var'] = ['bla10', 'bla20', 'bla30'];
                console.log('template 2:', file31);
                var template2 = parser.parse(file31);

                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);

                console.log('AST:', template2);

                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template2, vdb);
                console.log(template_instance);

            });

            it('works on JSON template3.fwd', function() {
                var vdb = {};
                vdb.delivery_trucks_var = [
                    { latitude: 100, longitude: 200 },
                    { latitude: 200, longitude: 200 }
                ];
                var template3 = parser.parse(file3);

                console.log(template3);
            });

            function getMarkerData(n) {
                var arr = [];
                for (i = 0; i < n; i = i + 1) {
                    arr.push(
                        {
                            lat : Math.floor(Math.random() * 80) + 1 ,
                            lng : Math.floor(Math.random() * 80) + 1
                        }
                    );
                }
                return arr;
            }


            it('works on JSON leaflet.fwd', function() {
                var vdb = {};
                var template_ast = parser.parse(leaflet_template);
                console.log(template_ast);



                var vdb = {};


                var n = 100,
                    data = getMarkerData(n);

                vdb.coordinates = data;


                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);


                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template_ast, vdb);
                console.log(template_instance);

                var value = {
                    lat : Math.floor(Math.random() * 80) + 1 ,
                    lng : Math.floor(Math.random() * 80) + 1
                };
                var diff = new UpdateDiff(new Path('coordinates[1]'), value);

                Runtime.partiallyEvaluate([diff], vdb);
            });

            function testJsonObjectDirective(json_object_directive_content, expected_key_value_pairs) {
                for (var key in expected_key_value_pairs) {
                    assert(key in json_object_directive_content, 'json object directive is missing key: ' + key);
                    var parsed_content = json_object_directive_content[key].contents;
                    assert(expected_key_value_pairs[key] == parsed_content,
                        'JSON object_directive has incorrect value for key "' + key + '".\n' +
                        '\t\tExpected value was:   "' + expected_key_value_pairs[key] + '"\n' +
                        '\t\tBut parsed value was: "' + parsed_content + '"');
                }
            }

            it('works on decimals.fwd', function() {
                var vdb = {};
                var template = parser.parse(decimalsFile);
                console.log(template);

                var json_unit_directive = template._template_directive.children[0].children[0];
                var json_object_directive = json_unit_directive.children[0];
                var json_object_directive_content = json_object_directive.children;

                var expected_key_value_pairs = {
                    'test0' : 10.5,
                    'test1' : 0.25,
                    'test2' : 0.123456789,
                    'test3' : 550.55,
                    'test4' : -10,
                    'test5' : -10.5
                };
                testJsonObjectDirective(json_object_directive_content, expected_key_value_pairs);
            });

            it('works on JSON highcharts_template.fwd', function() {
                var vdb = {};
                var template_ast = parser.parse(highcharts_template);
                console.log(template_ast);



                var vdb = {};

                var n = 10000,
                    data = getData(n);

                vdb.measurements = data;
                vdb.rgb = function(value) {
                    //return value;
                    var letters = '0123456789ABCDEF';
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };
                console.log('vdb', vdb);

                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);


                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template_ast, vdb);
                console.log(template_instance);

                var value = 100;
                var append_diff = new AppendDiff(new Path('measurements'), value);

                Runtime.partiallyEvaluate([append_diff], vdb);
            });

            it('works on template4.fwd', function() {

                //var file = readTextFile('template1.fwd');
                var vdb = {};
                vdb['array_var'] = ['bla10', 'bla20', 'bla30'];
                console.log('template 4:', file4);
                var template2 = parser.parse(file4);

                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);

                console.log('AST:', template2);

                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template2, vdb);
                console.log(template_instance);


                var json = 'a value';
                var update_diff = new UpdateDiff(new Path('array_var[1]'), json);

                Runtime.partiallyEvaluate([update_diff], vdb);
            });

            function testConditionDirective(condition_directive, expected_has_operator, expected_is_binary,
                expected_operand1, expected_operand2, expected_operator, operand1_is_var, operand2_is_var) {
                assert(condition_directive.has_operator === expected_has_operator, 'condition directive has_operator field mismatch-- ' +
                    'got: ' + condition_directive.has_operator + ', expecting: ' + expected_has_operator);
                assert(condition_directive.is_binary === expected_is_binary, 'condition directive is_binary field mismatch-- ' +
                    'got: ' + condition_directive.is_binary + ', expecting: ' + expected_is_binary);

                if (operand1_is_var) {
                    assert(condition_directive.operand1.expression_instance.string === expected_operand1, 'condition directive operand1 field mismatch-- ' +
                        'got: ' + condition_directive.operand1 + ', expecting: ' + expected_operand1);
                } else {
                    assert(condition_directive.operand1 === expected_operand1, 'condition directive operand1 field mismatch-- ' +
                        'got: ' + condition_directive.operand1 + ', expecting: ' + expected_operand1);
                }

                if (operand2_is_var) {
                    assert(condition_directive.operand2.expression_instance.string === expected_operand2, 'condition directive operand2 field mismatch-- ' +
                        'got: ' + condition_directive.operand2 + ', expecting: ' + expected_operand2);
                } else {
                    assert(condition_directive.operand2 === expected_operand2, 'condition directive operand2 field mismatch-- ' +
                        'got: ' + condition_directive.operand2 + ', expecting: ' + expected_operand2);
                }

                assert(condition_directive.operator === expected_operator, 'condition directive operator field mismatch-- ' +
                    'got: ' + condition_directive.operator + ', expecting: ' + expected_operator);
            }

            it('works on if-else.fwd', function() {
                var template = parser.parse(ifElseFile);
                console.log(template);

                var json_unit_directive = template._template_directive.children[0].children[0];
                var json_object_directive_content = json_unit_directive.children;

                var expected_key_value_pairs = {
                    'staticKey1' : "100",
                    'staticKey2' : "200",
                    'staticKey3' : "300",
                    'staticKey4' : "400"
                };

                for (var key in expected_key_value_pairs) {
                    assert(key in json_object_directive_content, 'json object directive is missing key: ' + key);
                    var parsed_content = json_object_directive_content[key].contents;
                    assert(expected_key_value_pairs[key] === parsed_content,
                        'JSON object_directive has incorrect value for key "' + key + '".\n' +
                        '\t\tExpected value was:   "' + expected_key_value_pairs[key] + '"\n' +
                        '\t\tBut parsed value was: "' + parsed_content + '"');
                }

                // tests for if-statement structure
                var if_statement_directives = json_object_directive_content.if_statement_directives;
                assert(if_statement_directives instanceof IfStatementDirectives);

                // test first if-statement block
                var if_statement_directive = if_statement_directives.children[0];
                assert(if_statement_directive instanceof IfStatementDirective);

                assert(if_statement_directive.children[0] instanceof IfDirective);
                var expected_if_statement_json_content = {key1: 'value1'};
                testJsonObjectDirective(if_statement_directive.children[0].children.children, expected_if_statement_json_content);
                assert(if_statement_directive.children[0].condition instanceof ConditionDirective);
                testConditionDirective(if_statement_directive.children[0].condition, true, true, 10, 100, '>');

                assert(if_statement_directive.children[1] instanceof ElifDirective);
                expected_if_statement_json_content = {key1: 'value2'};
                testJsonObjectDirective(if_statement_directive.children[1].children.children, expected_if_statement_json_content);
                assert(if_statement_directive.children[1].condition instanceof ConditionDirective);
                testConditionDirective(if_statement_directive.children[1].condition, true, true, 'x', 1000, '<=', true);

                // the last elif has a nested if-statement inside of it, so we also need to check that one is properly parsed.
                assert(if_statement_directive.children[2] instanceof ElifDirective);
                expected_if_statement_json_content = {key1: "value3"};
                testJsonObjectDirective(if_statement_directive.children[2].children.children, expected_if_statement_json_content);
                assert(if_statement_directive.children[2].condition instanceof ConditionDirective);
                testConditionDirective(if_statement_directive.children[2].condition, false, false, true, undefined, undefined);
                // checking nested if statement directives.
                var nested_if_statement_directives = if_statement_directive.children[2].children.children.if_statement_directives;
                assert(nested_if_statement_directives instanceof IfStatementDirectives);
                assert(nested_if_statement_directives.children[0].children[0] instanceof IfDirective);
                expected_if_statement_json_content = {key2: 'value'};
                testJsonObjectDirective(nested_if_statement_directives.children[0].children[0].children.children, expected_if_statement_json_content);
                testConditionDirective(nested_if_statement_directives.children[0].children[0].condition, false, false, false, undefined, undefined);


                // test second if-statement block
                if_statement_directive = if_statement_directives.children[1];
                assert(if_statement_directive instanceof IfStatementDirective);

                assert(if_statement_directive.children[0] instanceof IfDirective);
                expected_if_statement_json_content = {keyX: 'value1'};
                testJsonObjectDirective(if_statement_directive.children[0].children.children, expected_if_statement_json_content);
                assert(if_statement_directive.children[0].condition instanceof ConditionDirective);
                testConditionDirective(if_statement_directive.children[0].condition, true, true, 'asdf', 'wxyz', '===');

                assert(if_statement_directive.children[1] instanceof ElifDirective);
                expected_if_statement_json_content = {keyX: 'value2'};
                testJsonObjectDirective(if_statement_directive.children[1].children.children, expected_if_statement_json_content);
                assert(if_statement_directive.children[1].condition instanceof ConditionDirective);
                testConditionDirective(if_statement_directive.children[1].condition, true, true, 'asdf', 'asdf', '!=');

                assert(if_statement_directive.children[2] instanceof ElseDirective);
                expected_if_statement_json_content = {keyX: "value3"};
                testJsonObjectDirective(if_statement_directive.children[2].children.children, expected_if_statement_json_content);
                assert(if_statement_directive.children[2].condition === undefined);


                // tests for if-statements as 'value' for keys
                assert('ifStmtValueKey1' in json_object_directive_content);
                var if_statement_directive_value = json_object_directive_content.ifStmtValueKey1;
                assert(if_statement_directive_value.children.length === 2);

                assert(if_statement_directive_value.children[0] instanceof IfDirective);
                assert(if_statement_directive_value.children[0].children.contents === 'value1');
                assert(if_statement_directive_value.children[0].condition instanceof ConditionDirective);
                testConditionDirective(if_statement_directive_value.children[0].condition, false, false, true, undefined, undefined);

                assert(if_statement_directive_value.children[1] instanceof ElseDirective);
                assert(if_statement_directive_value.children[1].children.contents === 'value2');
                assert(if_statement_directive_value.children[1].condition === undefined);
            });

            it('works on if-else-syntax.fwd', function() {
                var template = parser.parse(ifElseSyntaxFile);
                console.log(template);

                //TODO(nick): verify contents once the diff via expected AST function is ready.
            });

            it('works on running example', function() {
                var product_names = ['Microsoft Surface Book', 'Lenovo ThinkPad W540', 'MSI GT80 Titan SLI',
                    'Gigabyte P37X', 'Apple MacBook Air',
                    'HP Pavilion x360 13', 'Dell XPS 13', 'Lenovo ThinkPad X250', 'Lenovo ThinkPad T450s',
                    'Toshiba Satellite C55DT',  'Apple MacBook (2015)',
                    'HP Spectre x360', 'Lenovo Yoga 900', 'Microsoft Surface Book', 'Dell Chromebook 13',
                    'Apple iMac', 'Asus Zen AiO Pro Z240IC',
                    'Origin Genesis (2015)', 'HP Envy Phoenix', 'MSI 24GE All-in-One',
                    'Lenovo ThinkCentre M83 Tiny in One', 'Dell OptiPlex 9020 Micro', 'Zotac Zbox Magnus EN970',
                    'Acer Revo RL85', 'Intel Compute Stick', 'Apple iMac with Retina 5K Display (2015)',
                    'Microsoft Surface Pro 4', 'Samsung Galaxy Tab S2 8.0', 'Lenovo Tab 2 A10', 'Dell Venue 10 7000',
                    'Apple iPad Pro', 'Asus ZenPad S 8.0', 'Amazon Fire', 'Lenovo Yoga Tablet 2 (8-Inch Windows)',
                    'Microsoft Surface Pro 4', 'Amazon Kindle Paperwhite (2015)', "	HP's Instant Ink Line",
                    'Canon Maxify iB4020', 'Epson SureColor P800', 'Epson WorkForce Pro WF-5690', 'Epson WorkForce ET-4550 EcoTank',
                    'Canon Color ImageClass MF820Cdn', 'OKI B412dn Monochrome Printer', 'OKI MB492 Multifunction Printer',
                    'Brother MFC-J6520DW', 'Seagate Backup Plus Desktop Drive (8TB)', 'Seagate Wireless (500GB)',
                    'Seagate Backup Plus (4TB)', 'Samsung SSD 850 EVO (2TB)', 'Intel SSD 750 Series', 'Crucial MX200',
                    'Seagate Personal Cloud (2-Bay)','QNAP TS-469L', 'D-Link AC3200 Ultra Wi-Fi Router (DIR-890L/R)',
                    'Corsair Strafe', 'Logitech G910 Orion Spark', 'Corsair Gaming K65 RGB', 'Roccat Tyon',
                    'Cougar 600M Gaming Mouse', 'Logitech MX Master', 'Logitech MX Anywhere 2', 'Dell UltraSharp U3415W',
                    'Acer H257HU', 'BenQ XL2730Z', 'Lenovo ThinkPad Stack ', 'Apple iPhone 6s', 'Google Nexus 6P',
                    'Apple iPhone, 6s Plus', 'Pebble Time', 'Marshall Kilburn', 'Sennheiser HD 598', 'Olympus Toug,  TG-4',
                    'Samsung NX1', 'Olympus PEN E-PL6', 'Canon E, S Rebel T6s', 'Roku 4', 'Nvidia Shield',
                    'Alienware 15 (with Graphics Amplifier)', 'Asus Transformer Book T100HA', 'Asus Chromebook Flip C100'
                ];


                var products =[];
                for (var i = 0; i< product_names.length; i++) {
                    if (i === 1) {
                        products.push(
                            {
                                id: i,
                                name: product_names[i],
                                user_rating: 10, //chance.floating({fixed: 2, min: 2, max: 5}),
                                units_in_stock : 144, //chance.floating({fixed: 0, min: 2, max: 700}),
                                release_year : 2015 //chance.floating({fixed: 0, min: 2011, max: 2016})
                            }
                        )
                    }
                    else {
                        products.push(
                            {
                                id: i,
                                name: product_names[i],
                                user_rating: 5, //chance.floating({fixed: 2, min: 2, max: 5}),
                                units_in_stock : 144, //chance.floating({fixed: 0, min: 2, max: 700}),
                                release_year : 2015 //chance.floating({fixed: 0, min: 2011, max: 2016})
                            }
                        )
                    }
                }
                var vdb = {};
                vdb.products = products;
                console.log('template 5:', file5);
                var template2 = parser.parse(file5);

                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);

                console.log('AST:', template2);

                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template2, vdb);
                console.log(template_instance);


                var json = 'a value';
                var update_diff = new UpdateDiff(new Path('products[1].user_rating'), json);

                Runtime.partiallyEvaluate([update_diff], vdb);

            });
        });
    }



);