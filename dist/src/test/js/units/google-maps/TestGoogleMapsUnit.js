define(
    /* Class name */
    'test/units/google-maps/TestGoogleMapsUnit',

    /* Class dependencies */
    ['main/runtime/UnitInstanceTest', 'template!test/units/google-maps/TestGoogleMapsUnit.template',
        'main/api/diff/Path', 'main/api/diff/DeleteDiff', 'main/api/diff/UpdateDiff',
        'main/api/diff/InsertIntoArrayDiff'],

    /* Class symbols */
    function (UnitInstanceTest, template, Path, DeleteDiff, UpdateDiff, InsertIntoArrayDiff) {

        'use strict';

        describe('A Google Maps unit', function () {


            var container = '<div style="width: 100%; height: 500px;"></div>';

            it('can be constructed', function () {

                var test = new UnitInstanceTest(template, container);
                var map_obj = test.getComponent();

                // cross check that the created ui objects have the attributes that appear in the . template file
                expect(map_obj.zoom).toBe(2);
                expect(Math.round(map_obj.center.A * 1000000) / 1000000).toBe(-25.363882);
                expect(Math.round(map_obj.center.F * 1000000) / 1000000).toBe(131.044922);
                expect(map_obj.draggable).toBe(true);
                expect(map_obj.clickable).toBe(true);


                var unit_instance = test.getUnitInstance();
                var marker0 = unit_instance.getUiObject('^.markers[0]');    // accessing the first marker

                expect(Math.round(marker0.position.A * 1000000) / 1000000).toBe(-26.363882);
                expect(Math.round(marker0.position.F * 1000000) / 1000000).toBe(131.044922);
                expect(marker0.title).toBe('marker1');
                expect(marker0.clickable).toBe(true);

                var circle0 = unit_instance.getUiObject('^.circles[0]');    // accessing the first marker

                expect(Math.round(circle0.center.A * 1000000) / 1000000).toBe(41.878113);
                expect(Math.round(circle0.center.F * 1000000) / 1000000).toBe(-87.629798);
                expect(circle0.fillColor).toBe('#FF0000');
                expect(circle0.fillOpacity).toBe(0.35);
                expect(circle0.strokeColor).toBe('#FF0000');
                expect(circle0.strokeOpacity).toBe(0.8);
                expect(circle0.strokeWeight).toBe(2);
                expect(circle0.radius).toBe(271480);

                var polygon0 = unit_instance.getUiObject('^.polygons[0]');    // accessing the first polygon
                expect(polygon0.fillColor).toBe('#FF0000');
                expect(polygon0.fillOpacity).toBe(0.35);
                expect(polygon0.strokeColor).toBe('#FF0000');
                expect(polygon0.strokeOpacity).toBe(0.8);
                expect(polygon0.strokeWeight).toBe(2);
                //expect(polygon.radius).toBe(271480);

                var polyline0 = unit_instance.getUiObject('^.polylines[0]');    // accessing the first polylines
                expect(polyline0.strokeColor).toBe('#FF0001');
                expect(polyline0.strokeOpacity).toBe(1.0);
                expect(polyline0.strokeWeight).toBe(3);
                expect(polyline0.geodesic).toBe(true);

                var rectangle0 = unit_instance.getUiObject('^.rectangles[0]');    // accessing the first polylines
                expect(rectangle0.strokeColor).toBe('#00FF00');
                expect(rectangle0.strokeOpacity).toBe(0.9);
                expect(rectangle0.strokeWeight).toBe(4);
                expect(rectangle0.fillColor).toBe('#00FF00');
                expect(rectangle0.fillOpacity).toBe(0.55);

            });

            it('can update a marker', function () {

                var test = new UnitInstanceTest(template, container);
                var map_obj = test.getComponent();

                // cross check that the created ui objects have the attributes that appear in the . template file
                expect(map_obj.zoom).toBe(2);
                expect(Math.round(map_obj.center.A * 1000000) / 1000000).toBe(-25.363882);
                expect(Math.round(map_obj.center.F * 1000000) / 1000000).toBe(131.044922);
                expect(map_obj.draggable).toBe(true);
                expect(map_obj.clickable).toBe(true);


                var unit_instance = test.getUnitInstance();
                var marker0 = unit_instance.getUiObject('^.markers[0]');    // accessing the first marker

                expect(Math.round(marker0.position.A * 1000000) / 1000000).toBe(-26.363882);
                expect(Math.round(marker0.position.F * 1000000) / 1000000).toBe(131.044922);
                expect(marker0.title).toBe('marker1');
                expect(marker0.clickable).toBe(true);

                var circle0 = unit_instance.getUiObject('^.circles[0]');    // accessing the first marker

                expect(Math.round(circle0.center.A * 1000000) / 1000000).toBe(41.878113);
                expect(Math.round(circle0.center.F * 1000000) / 1000000).toBe(-87.629798);
                expect(circle0.fillColor).toBe('#FF0000');
                expect(circle0.fillOpacity).toBe(0.35);
                expect(circle0.strokeColor).toBe('#FF0000');
                expect(circle0.strokeOpacity).toBe(0.8);
                expect(circle0.strokeWeight).toBe(2);
                expect(circle0.radius).toBe(271480);

                var polygon0 = unit_instance.getUiObject('^.polygons[0]');    // accessing the first polygon
                expect(polygon0.fillColor).toBe('#FF0000');
                expect(polygon0.fillOpacity).toBe(0.35);
                expect(polygon0.strokeColor).toBe('#FF0000');
                expect(polygon0.strokeOpacity).toBe(0.8);
                expect(polygon0.strokeWeight).toBe(2);
                //expect(polygon.radius).toBe(271480);

                var polyline0 = unit_instance.getUiObject('^.polylines[0]');    // accessing the first polylines
                expect(polyline0.strokeColor).toBe('#FF0001');
                expect(polyline0.strokeOpacity).toBe(1.0);
                expect(polyline0.strokeWeight).toBe(3);
                expect(polyline0.geodesic).toBe(true);

                var rectangle0 = unit_instance.getUiObject('^.rectangles[0]');    // accessing the first polylines
                expect(rectangle0.strokeColor).toBe('#00FF00');
                expect(rectangle0.strokeOpacity).toBe(0.9);
                expect(rectangle0.strokeWeight).toBe(4);
                expect(rectangle0.fillColor).toBe('#00FF00');
                expect(rectangle0.fillOpacity).toBe(0.55);


                var json = {
                    position: {
                        lat: -36.363882,
                        lng: 151.044922
                    },
                    title: 'marker_updated',
                    clickable: true
                };

                var update_diff = new UpdateDiff(new Path('^.markers[0]'), json);

                test.render(update_diff);

                var marker_updated = unit_instance.getUiObject('^.markers[0]');    // accessing the first marker

                expect(Math.round(marker_updated.position.A * 1000000) / 1000000).toBe(-36.363882);
                expect(Math.round(marker_updated.position.F * 1000000) / 1000000).toBe(151.044922);
                expect(marker_updated.title).toBe('marker_updated');
                expect(marker_updated.clickable).toBe(true);
            });

            it('can insert a marker', function () {

                var test = new UnitInstanceTest(template, container);
                var map_obj = test.getComponent();

                // cross check that the created ui objects have the attributes that appear in the . template file
                expect(map_obj.zoom).toBe(2);
                expect(Math.round(map_obj.center.A * 1000000) / 1000000).toBe(-25.363882);
                expect(Math.round(map_obj.center.F * 1000000) / 1000000).toBe(131.044922);
                expect(map_obj.draggable).toBe(true);
                expect(map_obj.clickable).toBe(true);


                var unit_instance = test.getUnitInstance();
                var marker0 = unit_instance.getUiObject('^.markers[0]');    // accessing the first marker

                expect(Math.round(marker0.position.A * 1000000) / 1000000).toBe(-26.363882);
                expect(Math.round(marker0.position.F * 1000000) / 1000000).toBe(131.044922);
                expect(marker0.title).toBe('marker1');
                expect(marker0.clickable).toBe(true);

                var circle0 = unit_instance.getUiObject('^.circles[0]');    // accessing the first marker

                expect(Math.round(circle0.center.A * 1000000) / 1000000).toBe(41.878113);
                expect(Math.round(circle0.center.F * 1000000) / 1000000).toBe(-87.629798);
                expect(circle0.fillColor).toBe('#FF0000');
                expect(circle0.fillOpacity).toBe(0.35);
                expect(circle0.strokeColor).toBe('#FF0000');
                expect(circle0.strokeOpacity).toBe(0.8);
                expect(circle0.strokeWeight).toBe(2);
                expect(circle0.radius).toBe(271480);

                var polygon0 = unit_instance.getUiObject('^.polygons[0]');    // accessing the first polygon
                expect(polygon0.fillColor).toBe('#FF0000');
                expect(polygon0.fillOpacity).toBe(0.35);
                expect(polygon0.strokeColor).toBe('#FF0000');
                expect(polygon0.strokeOpacity).toBe(0.8);
                expect(polygon0.strokeWeight).toBe(2);
                //expect(polygon.radius).toBe(271480);

                var polyline0 = unit_instance.getUiObject('^.polylines[0]');    // accessing the first polylines
                expect(polyline0.strokeColor).toBe('#FF0001');
                expect(polyline0.strokeOpacity).toBe(1.0);
                expect(polyline0.strokeWeight).toBe(3);
                expect(polyline0.geodesic).toBe(true);

                var rectangle0 = unit_instance.getUiObject('^.rectangles[0]');    // accessing the first polylines
                expect(rectangle0.strokeColor).toBe('#00FF00');
                expect(rectangle0.strokeOpacity).toBe(0.9);
                expect(rectangle0.strokeWeight).toBe(4);
                expect(rectangle0.fillColor).toBe('#00FF00');
                expect(rectangle0.fillOpacity).toBe(0.55);


                var json = {
                    position: {
                        lat: -80.363882,
                        lng: 101.044922
                    },
                    title: 'marker_inserted',
                    clickable: true
                };

                var insert_into_array_diff = new InsertIntoArrayDiff(new Path('^.markers[2]'), json);

                test.render(insert_into_array_diff);

                var marker_inserted = unit_instance.getUiObject('^.markers[2]');    // accessing the first marker

                expect(Math.round(marker_inserted.position.A * 1000000) / 1000000).toBe(-80.363882);
                expect(Math.round(marker_inserted.position.F * 1000000) / 1000000).toBe(101.044922);
                expect(marker_inserted.title).toBe('marker_inserted');
                expect(marker_inserted.clickable).toBe(true);
            });


            it('can delete a marker', function () {

                var test = new UnitInstanceTest(template, container);
                var map_obj = test.getComponent();

                // cross check that the created ui objects have the attributes that appear in the . template file
                expect(map_obj.zoom).toBe(2);
                expect(Math.round(map_obj.center.A * 1000000) / 1000000).toBe(-25.363882);
                expect(Math.round(map_obj.center.F * 1000000) / 1000000).toBe(131.044922);
                expect(map_obj.draggable).toBe(true);
                expect(map_obj.clickable).toBe(true);


                var unit_instance = test.getUnitInstance();
                var marker0 = unit_instance.getUiObject('^.markers[0]');    // accessing the first marker

                expect(Math.round(marker0.position.A * 1000000) / 1000000).toBe(-26.363882);
                expect(Math.round(marker0.position.F * 1000000) / 1000000).toBe(131.044922);
                expect(marker0.title).toBe('marker1');
                expect(marker0.clickable).toBe(true);

                var circle0 = unit_instance.getUiObject('^.circles[0]');    // accessing the first marker

                expect(Math.round(circle0.center.A * 1000000) / 1000000).toBe(41.878113);
                expect(Math.round(circle0.center.F * 1000000) / 1000000).toBe(-87.629798);
                expect(circle0.fillColor).toBe('#FF0000');
                expect(circle0.fillOpacity).toBe(0.35);
                expect(circle0.strokeColor).toBe('#FF0000');
                expect(circle0.strokeOpacity).toBe(0.8);
                expect(circle0.strokeWeight).toBe(2);
                expect(circle0.radius).toBe(271480);

                var polygon0 = unit_instance.getUiObject('^.polygons[0]');    // accessing the first polygon
                expect(polygon0.fillColor).toBe('#FF0000');
                expect(polygon0.fillOpacity).toBe(0.35);
                expect(polygon0.strokeColor).toBe('#FF0000');
                expect(polygon0.strokeOpacity).toBe(0.8);
                expect(polygon0.strokeWeight).toBe(2);
                //expect(polygon.radius).toBe(271480);

                var polyline0 = unit_instance.getUiObject('^.polylines[0]');    // accessing the first polylines
                expect(polyline0.strokeColor).toBe('#FF0001');
                expect(polyline0.strokeOpacity).toBe(1.0);
                expect(polyline0.strokeWeight).toBe(3);
                expect(polyline0.geodesic).toBe(true);

                var rectangle0 = unit_instance.getUiObject('^.rectangles[0]');    // accessing the first polylines
                expect(rectangle0.strokeColor).toBe('#00FF00');
                expect(rectangle0.strokeOpacity).toBe(0.9);
                expect(rectangle0.strokeWeight).toBe(4);
                expect(rectangle0.fillColor).toBe('#00FF00');
                expect(rectangle0.fillOpacity).toBe(0.55);




                var delete_diff = new DeleteDiff(new Path('^.markers[2]'));

                test.render(delete_diff);

                var marker_deleted = unit_instance.getUiObject('^.markers[2]');

                expect(marker_deleted.title).not.toBe('marker3');

            });
        });
    }
);
