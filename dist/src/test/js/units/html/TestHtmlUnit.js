define(
    /* Class name */
    'test/units/html/TestHtmlUnit',

    /* Class dependencies */
    ['main/runtime/UnitInstanceTest', 'template!test/units/html/TestHtmlUnit2.template', 'main/api/diff/HtmlPath',
        'main/api/diff/DeleteHtmlDiff', 'main/api/diff/UpdateDiff', 'main/api/diff/UpdateHtmlDiff',
        'main/api/diff/InsertHtmlDiff', 'main/api/diff/AppendDiff', 'main/api/diff/AppendHtmlDiff'
    ],

    /* Class symbols */
    function (UnitInstanceTest, template, HtmlPath, DeleteHtmlDiff, UpdateDiff, UpdateHtmlDiff,
              InsertHtmlDiff, AppendDiff, AppendHtmlDiff) {

        'use strict';

        describe('An HTML unit', function () {

            it('can be constructed', function () {
                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);
            });

            it('can delete a dom element', function () {

                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);
                //var delete_diff = new DeleteHtmlDiff(new HtmlPath('^/[2]/[21]/[1]/[1]/[3]'));
                var delete_diff = new DeleteHtmlDiff(new HtmlPath('^/[1]/[1]/[3]'));
                test.render(delete_diff);
                var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str_updated).toBe(html_str_updated);
            });


            it('can update a text element', function () {

                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);

                var innerHTML = 'NOT JACKSON';
                //var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[2]/[22]/[1]/[1]/[3]/[3]/[0]'), innerHTML);
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[1]/[1]/[3]/[3]/[0]'), innerHTML);
                test.render(update_diff);
                var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>NOT JACKSON</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str_updated).toBe(html_str_updated);
            });

            it('can update a complex element', function () {

                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);

                var innerHTML = '<td>NOT JACKSON COMPLEX</td>';
                //var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[2]/[22]/[1]/[1]/[3]/[3]'), innerHTML);
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[1]/[1]/[3]/[3]'), innerHTML);
                test.render(update_diff);
                var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>NOT JACKSON COMPLEX</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str_updated).toBe(html_str_updated);
            });

            function readTextFile(file)
            {
                var rawFile = new XMLHttpRequest();
                rawFile.open("GET", file, false);
                rawFile.onreadystatechange = function ()
                {
                    if(rawFile.readyState === 4)
                    {
                        if(rawFile.status === 200 || rawFile.status == 0)
                        {
                            var allText = rawFile.responseText;
                            alert(allText);
                        }
                    }
                };
                rawFile.send(null);
            }

            it('running example experiment', function () {

                var test = new UnitInstanceTest(template);
                //var unit_instance = test.getUnitInstance();
                var innerHTML1 = '<span ng-style="colorizeMe(cell)" class="ng-binding" style="background-color: rgba(255, 0, 0, 0.498039);">25490</span>';
                var innerHTML2 = '<span ng-style="colorizeMe(cell)" class="ng-binding" style="background-color: rgba(0, 255, 0, 0.498039);">75490</span>';

                //var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[2]/[22]/[1]/[1]/[3]/[3]'), innerHTML);

                console.time("Update1");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML1);
                test.render(update_diff);

                console.timeEnd("Update1");

                console.time("Update2");
                var update_diff2 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                test.render(update_diff2);

                console.timeEnd("Update2");

                console.time("Update3");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML1);
                test.render(update_diff);

                console.timeEnd("Update3");

                console.time("Update4");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                test.render(update_diff);

                console.timeEnd("Update4");



                console.time("Update1");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML1);
                test.render(update_diff);

                console.timeEnd("Update1");

                console.time("Update2");
                var update_diff2 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                test.render(update_diff2);

                console.timeEnd("Update2");

                console.time("Update3");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML1);
                test.render(update_diff);

                console.timeEnd("Update3");

                console.time("Update4");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                test.render(update_diff);

                console.timeEnd("Update4");

                console.time("Update1");
                var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML1);
                test.render(update_diff);

                console.timeEnd("Update1");

                console.time("5diffs");
                var update_diff1 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[4]/[1]'), innerHTML1);
                //var update_diff2 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                var update_diff3 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[6]/[1]'), innerHTML1);
                var update_diff4 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                var update_diff5 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[10]/[1]'), innerHTML1);
                //var update_diff6 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[2]/[1]'), innerHTML2);
                var update_diff7 = new UpdateHtmlDiff(new HtmlPath('^/[7]/[2]/[1]/[8]/[1]'), innerHTML2);
                test.render(update_diff1);
                //test.render(update_diff2);
                test.render(update_diff3);
                test.render(update_diff4);
                test.render(update_diff5);
                //test.render(update_diff6);
                test.render(update_diff7);

                console.timeEnd("5diffs");


                //var hook = unit_instance.container_element;
                //var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                //var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                //var html_str = readTextFile('//home/xhrdx/Desktop/template-engine/src/test/js/units/html/table.html');
                //console.log(html_str);
                //html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                //expect(hook_str).toBe(html_str);
                //
                //var innerHTML = '<td>NOT JACKSON COMPLEX</td>';
                ////var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[2]/[22]/[1]/[1]/[3]/[3]'), innerHTML);
                //var update_diff = new UpdateHtmlDiff(new HtmlPath('^/[1]/[1]/[3]/[3]'), innerHTML);
                //test.render(update_diff);
                //var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                //var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>NOT JACKSON COMPLEX</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                //html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                //expect(hook_str_updated).toBe(html_str_updated);
            });

            it('can insert a element', function () {
                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);

                var innerHTML = '<tr><td>Yannis</td><td>Papakonstantinou</td><td>32</td></tr>';
                //var insert_diff = new InsertHtmlDiff(new HtmlPath('^/[2]/[22]/[1]/[1]/[3]'), innerHTML);
                var insert_diff = new InsertHtmlDiff(new HtmlPath('^/[1]/[1]/[3]'), innerHTML);
                test.render(insert_diff);
                var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Yannis</td><td>Papakonstantinou</td><td>32</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str_updated).toBe(html_str_updated);
            });

            it('can append an element', function () {
                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);

                var innerHTML = '<tr><td>Yannis</td><td>Papakonstantinou</td><td>32</td></tr>';
                //var append_diff = new AppendHtmlDiff(new HtmlPath('^/[2]/[22]/[1]/[1]'), innerHTML);
                var append_diff = new AppendHtmlDiff(new HtmlPath('^/[1]/[1]'), innerHTML);
                test.render(append_diff);
                var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr><tr><td>Yannis</td><td>Papakonstantinou</td><td>32</td></tr></tbody></table>';
                html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str_updated).toBe(html_str_updated);
            });

            it('can append another element', function () {
                var test = new UnitInstanceTest(template);
                var unit_instance = test.getUnitInstance();
                var hook = unit_instance.container_element;
                var hook_str = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str = html_str.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str).toBe(html_str);

                var innerHTML = '<td>Yannis</td>';
                var append_diff = new AppendHtmlDiff(new HtmlPath('^/[1]/[1]/[3]'), innerHTML);
                test.render(append_diff);
                var hook_str_updated = String(hook.innerHTML).replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                var html_str_updated = '<table style="width:100%"><tbody><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td><td>Yannis</td></tr><tr><td>Costas</td><td>Zarifis</td><td>131</td></tr></tbody></table>';
                html_str_updated = html_str_updated.replace(/(\r\n|\n|\r|\t|\s)/gm, '');
                expect(hook_str_updated).toBe(html_str_updated);
            });

        });
    }
);