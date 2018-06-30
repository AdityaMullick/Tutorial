define(
    /* Class name */
    'test/runtime/TestPartialEvaluationWithNestedUnits',

    /* Class dependencies */
    [ 'main/runtime/_ast/TemplateDirective', 'main/runtime/_ast/HtmlElement',
        'main/runtime/_ast/HtmlUnitDirective', 'main/runtime/_ast/ForDirective', 'lodash',
        'main/runtime/_ast/ExpressionDirective', 'main/api/diff/Path', 'main/api/diff/UpdateDiff',
        'main/runtime/_ast/RefreshDirective', 'main/runtime/_ast/PrintDirective',
        'main/runtime/_ast/ValueDirective', 'main/runtime/_evaluate/FullEvaluator', 'main/runtime/Template',
        'jquery', 'lodash', 'main/api/path/PathSignature', 'main/MainForward', 'text!./templates/html-unit-with-nested-map-and-highcharts.fwd',
        'text!./templates/html-unit-with-nested-map-and-highcharts-fully-nested-model.fwd', 'main/api/diff/AppendDiff'
    ],

    /* Class symbols */
    function (TemplateDirective, HtmlElement, HtmlUnitDirective, ForDirective, _, ExpressionDirective, Path,
              UpdateDiff, RefreshDirective, PrintDirective, ValueDirective, FullEvaluator, Template, jQuery, lodash,
              PathSignature, Forward, html_with_nested_map_and_charts, html_with_nested_map_and_charts_fully_nested_model,
              AppendDiff
    ) {

        'use strict';

        describe('The Partial Evaluator', function () {

            function getCoordinates(n) {
                var arr = [];
                for (var i = 0; i < n; i = i + 1) {
                    arr.push(
                        {
                            lat : chance.latitude(),
                            lng : chance.longitude()
                        }
                    );
                }
                return arr;
            }
            function getMeasurements(n) {
                var arr = [];
                var i;
                for (i = 0; i < n; i = i + 1) {
                    arr.push(2 * Math.sin(i / 100) + Math.random()+53);
                }
                return arr;
            }
            function prepareVDB(num_of_markers) {

                Forward.vdb.coordinates = getCoordinates(num_of_markers);

                var n = 100;
                Forward.vdb.rooms = [
                    {
                        measurements: getMeasurements(n)
                    }
                ];

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
            function prepareVDBNestedData(num_of_markers) {

                Forward.vdb.users = [];
                var n = 100;
                var coordinates = getCoordinates(num_of_markers);

                for (var i = 0; i < coordinates.length; i++) {
                    Forward.vdb.users.push({
                        coord : coordinates[i],
                        rooms : [
                                {
                                    measurements: getMeasurements(n)
                                }
                            ]
                    })
                }
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
                var n = 10;
                prepareVDB(n);
                Forward.display(html_with_nested_map_and_charts);
                var i = 0;
                i++;
                var value = {
                    lat : chance.latitude(),
                    lng : chance.longitude()
                };
                var diff = new UpdateDiff(new Path('coordinates['+i%n+']'), value);
                Forward.applyDiffs([diff]);
                var unit_instance = Forward._runtime._unit_instance_map['^[2].GoogleMaps'];
                var marker = unit_instance.getUiObject(new Path('^.markers['+i%n+']'));
                expect(Math.round(marker.position.lat() * 1000000) / 1000000).toBe(value.lat);
                expect(Math.round(marker.position.lng() * 1000000) / 1000000).toBe(value.lng);
            });


            xit('can evaluate and fragment nested json units using fully nested model', function() {
                // NOTE: The template for fragmentation testing only uses Leaflet units because GoogleMaps units do not work offline.
                var n = 100;
                prepareVDB(n);
                Forward.display(html_with_nested_map_and_charts);

                var i = 0;
                setInterval(function() {
                    i++;
                    var value = {
                        lat : chance.latitude(),
                        lng : chance.longitude()
                    };
                    var diff = new UpdateDiff(new Path('coordinates['+i%n+']'), value);
                    Forward.applyDiffs([diff]);
                }, 2);
                expect(true).toBe(true);
                // TODO: evaluate correctness of fragmentation (basic check)
            });

            it('can evaluate and fragment nested json units using fully nested model', function() {
                // NOTE: The template for fragmentation testing only uses Leaflet units because GoogleMaps units do not work offline.
                var n = 100;
                prepareVDBNestedData(n);
                Forward.display(html_with_nested_map_and_charts_fully_nested_model);

                var i = 0;
                setInterval(function() {
                    i++;
                    var value = {
                        lat : chance.latitude(),
                        lng : chance.longitude()
                    };
                    var diff = new UpdateDiff(new Path('users['+i%n+'].coord'), value);
                    Forward.applyDiffs([diff]);
                }, 2);
                expect(true).toBe(true);
                // TODO: evaluate correctness of fragmentation (basic check)
            });

            it('can evaluate and fragment nested json units using fully nested model', function() {
                // NOTE: The template for fragmentation testing only uses Leaflet units because GoogleMaps units do not work offline.
                var n = 100;
                prepareVDBNestedData(n);
                Forward.display(html_with_nested_map_and_charts_fully_nested_model);

                var i = 0;
                i++;
                var value = {
                    lat : chance.latitude(),
                    lng : chance.longitude()
                };
                var diff = new UpdateDiff(new Path('users['+i%n+'].coord'), value);
                Forward.applyDiffs([diff]);
                var unit_instance = Forward._runtime._unit_instance_map['^[2].GoogleMaps'];
                var marker = unit_instance.getUiObject(new Path('^.markers['+i%n+']'));
                expect(Math.round(marker.position.lat() * 1000000) / 1000000).toBe(value.lat);
                expect(Math.round(marker.position.lng() * 1000000) / 1000000).toBe(value.lng);
                expect(true).toBe(true);
                // TODO: evaluate correctness of fragmentation (basic check)
            });


            it('can evaluate and fragment nested json units using fully nested model', function() {
                // NOTE: The template for fragmentation testing only uses Leaflet units because GoogleMaps units do not work offline.
                var n = 100;
                prepareVDBNestedData(n);
                Forward.display(html_with_nested_map_and_charts_fully_nested_model);

                var i = 0;
                var value = 10000;//getMeasurements(0)[0];

                setInterval(function() {
                    i++;
                    var diff = new AppendDiff(new Path('users['+i%n+'].rooms[0].measurements'), value);
                    Forward.applyDiffs([diff]);
                }, 2);



                //var unit_instance = Forward._runtime._unit_instance_map['^[2].GoogleMaps'];
                //var marker = unit_instance.getUiObject(new Path('^.markers['+i%n+']'));
                //expect(Math.round(marker.position.lat() * 1000000) / 1000000).toBe(value.lat);
                //expect(Math.round(marker.position.lng() * 1000000) / 1000000).toBe(value.lng);
                expect(true).toBe(true);
                // TODO: evaluate correctness of fragmentation (basic check)
            });

            it('can evaluate and fragment nested json units using fully nested model', function() {
                // NOTE: The template for fragmentation testing only uses Leaflet units because GoogleMaps units do not work offline.
                var n = 100;
                prepareVDBNestedData(n);
                Forward.display(html_with_nested_map_and_charts_fully_nested_model);

                var i1 = 0;
                var i2 = 0;
                var value = 10000;//getMeasurements(0)[0];

                var j = 0;
                setInterval(function() {
                    j++;
                    var diff;
                    if (j%2==0){
                        i1++;
                        diff = new AppendDiff(new Path('users['+i1%n+'].rooms[0].measurements'), value);
                    }
                    else {
                        i2++;
                        diff = new UpdateDiff(new Path('users[' + i2 % n + '].coord'), {
                            lat: chance.latitude(),
                            lng: chance.longitude()
                        });
                    }

                    //= new AppendDiff(new Path('users['+i%n+'].rooms[0].measurements'), value);
                    Forward.applyDiffs([diff]);
                }, 2);

                expect(true).toBe(true);
                // TODO: evaluate correctness of fragmentation (basic check)
            });


            //it('can evaluate and fragment nested html units', function() {
            //    prepareVDB(10);
            //    Forward.display(fragmentation_html_template);
            //    expect(true).toBe(true);
            //});
            //
            //fit('can evaluate and fragment units within a parent html unit', function() {
            //    prepareVDB(10);
            //    Forward.display(fragmentation_html_as_parent_template);
            //    expect(true).toBe(true);
            //});


        });
    }
);