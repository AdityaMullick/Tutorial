//require.config({
//
//    paths : {
        //create alias to plugins (not needed if plugins are on the baseUrl)
        //async: '/bower_components/requirejs-plugins/src/async'
        //async: 'https://dl.dropboxusercontent.com/u/15585964/services-online%20Docs/async'
    //}
//});
define(
    /* Class name */
    'main/units/googlemaps/GoogleMapsUnit',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/unit/Unit', 'main/api/diff/Op', 'main/api/diff/UpdateDiff',
        'main/api/diff/Path',
        'async!http://maps.google.com/maps/api/js?key=AIzaSyAR12AwxK_g0Dykcoy1r9-NhfOg6oprNcA'],

    /* Class symbols */
    function (assert, lodash, Unit, Op, UpdateDiff, Path) {

        'use strict';

        /**
         * @class A Google Maps unit.
         *
         */
        function GoogleMapsUnit() {

            /* Super constructor */
            Unit.call(this);

            this.addRenderer(Op.CONSTRUCT, '^', construct);
            this.addRenderer(Op.DESTRUCT, '^', destruct);
            this.addRenderer(Op.UPDATE, '^.options.center', updateCenter);
            this.addRenderer(Op.UPDATE, '^.markers', updateMarkers);
            this.addRenderer(Op.UPDATE, '^.markers[*]', updateMarker);
            this.addRenderer(Op.UPDATE, '^.markers[*].position', updatePosition);
            this.addRenderer(Op.UPDATE, '^.markers[*].position.lat', updateLat);
            this.addRenderer(Op.INSERT_INTO_ARRAY, '^.markers[*]', insertMarker);
            this.addRenderer(Op.DELETE, '^.markers[*]', deleteMarker);
            this.addRenderer(Op.APPEND, '^.markers', appendMarker);
            //this.addRenderer(Op.ATTACH, '^.markers[*].infowindow', attachinfowindow);
        }

        /* Super class */
        GoogleMapsUnit.prototype = new Unit();

        function updateCenter(unit_instance, diff) {
            var mapUIObject = unit_instance.getUiObject('^');
            mapUIObject.setCenter(diff.getPayload());
        }

        function construct(unit_instance, diff) {
            var unit_state = diff.getPayload();
            console.log(unit_state);
            var mapOptions = unit_state.options;
            var element = unit_instance.container_element;
            var map = new google.maps.Map(element, mapOptions);

            // map.addListener('center_changed', function() {
            //     // var args = unit_state.options.events.center_changed.args;
            //     // unit_state.options.events.center_changed.action(...args, {lat: map.getCenter().lat(), lng: map.getCenter().lng()});
            //
            //     // Bind specific code
            //     if (unit_state.options.center.hasOwnProperty("expression")) {
            //         // var p = new Path(unit_state.options.center.expression.steps);
            //         // var diff = new UpdateDiff(p, {lat: map.getCenter().lat(), lng: map.getCenter().lng()});
            //
            //
            //         unit_instance.applyBindDiff(new UpdateDiff(new Path('^.options.center')),
            //             {lat: map.getCenter().lat(), lng: map.getCenter().lng()});
            //     }
            // });

            map.addListener('center_changed', function() {
                var diff = new UpdateDiff(new Path('^.options.center'), {lat: map.getCenter().lat(), lng: map.getCenter().lng()});
                unit_instance.applyBindDiff(diff);
            });




            // if (unit_instance.container_element) {
            // element.style.height = "1500px";
            // element.style.width = "1500px";
            // }
            unit_instance.setUiObject(diff.target, map);

            var pan_var = unit_state.pan;
            if (!lodash.isUndefined(pan_var)) {
                map.panTo(pan_var);
            }

            var circles_var = unit_state.circles;
            if (!lodash.isUndefined(circles_var)) {
                for(var i = 0; i < unit_state.circles.length; i++) {
                    createCircle(diff.target.tupleNav('circles').arrayNav(i), unit_instance, unit_state.circles[i]);
                }

            }

            var polygons_var = unit_state.polygons;
            if (!lodash.isUndefined(polygons_var)) {
                for(var i = 0; i < unit_state.polygons.length; i++) {
                    createPolygons(diff.target.tupleNav('polygons').arrayNav(i), unit_instance, unit_state.polygons[i]);
                }

            }

            var polylines_var = unit_state.polylines;
            if (!lodash.isUndefined(polylines_var)) {
                for(var i = 0; i < unit_state.polylines.length; i++) {
                    createPolylines(diff.target.tupleNav('polylines').arrayNav(i), unit_instance, unit_state.polylines[i]);
                }

            }

            var rectangles_var = unit_state.rectangles;
            if (!lodash.isUndefined(rectangles_var)) {
                for(var i = 0; i < unit_state.rectangles.length; i++) {
                    createRectangles(diff.target.tupleNav('rectangles').arrayNav(i), unit_instance, unit_state.rectangles[i]);
                }

            }

            var layer_var = unit_state.layer;
            if (!lodash.isUndefined(layer_var)) {
                var layer_type_var = unit_state.layer.type;
                if (!lodash.isUndefined(layer_type_var)) {
                    var transitLayer;
                    if (layer_type_var === 'TransitLayer') {
                        transitLayer = new google.maps.TransitLayer();
                        transitLayer.setMap(map);
                    }
                    else if (layer_type_var === 'BicyclingLayer') {
                        transitLayer = new google.maps.BicyclingLayer();
                        transitLayer.setMap(map);
                    }
                    else if (layer_type_var === 'TrafficLayer') {
                        transitLayer = new google.maps.TrafficLayer();
                        transitLayer.setMap(map);
                    }
                    else if (layer_type_var === 'KmlLayer') {
                        transitLayer = new google.maps.KmlLayer(layer_var);
                        transitLayer.setMap(map);
                    }
                    else if (layer_type_var === 'FusionTablesLayer') {
                        transitLayer = new google.maps.FusionTablesLayer(layer_var);
                        transitLayer.setMap(map);
                    }
                    else if (layer_type_var === 'MapsEngineLayer') {
                        //layer_var.map = map;
                        transitLayer = new google.maps.visualization.MapsEngineLayer(layer_var);
                        transitLayer.setMap(map);
                    }
                }
            }

            //unit_instance.setUiObject('^', map);
            var markers_var = unit_state.markers;
            if (!lodash.isUndefined(markers_var)) {
                for (var i = 0; i < unit_state.markers.length; i++) {
                    createMarker(diff.target.tupleNav('markers').arrayNav(i), unit_instance, unit_state.markers[i]);
                }
            }
        }

        function deleteMarker(unit_instance, diff) {
            detachMarker(diff.getTarget(), unit_instance);
        }

        function appendMarker(unit_instance, diff) {
            //console.log('append');
            var marker = new google.maps.Marker(diff.getPayload());
            var mapUIObject = unit_instance.getUiObject('^');
            marker.setMap(mapUIObject);
        }
        function insertMarker(unit_instance, diff) {
            createMarker(diff.getTarget(), unit_instance, diff.getPayload());
        }

        function createMarker(path, unit_instance, json_marker) {
            var marker = new google.maps.Marker(json_marker);

            marker.addListener('click', function() {
                var args = json_marker.events.onClick.args;
                json_marker.events.onClick.action(...args);
            });
            var mapUIObject = unit_instance.getUiObject('^');
            marker.setMap(mapUIObject);

            if (json_marker.hasOwnProperty('infowindow')) {
                var infowindow = new google.maps.InfoWindow({
                    content: json_marker.infowindow
                });
                marker.addListener('click', function() {
                    infowindow.open(mapUIObject, marker);
                });
            }

            unit_instance.setUiObject(path, marker);
        }

        function detachMarker(path, unit_instance) {
            var marker = unit_instance.getUiObject(path);
            marker.setMap(null);
            //unit_instance.setUiObject(path, null);
            //marker.remove();
        }

        function createCircle (path, unit_instance, json_circle) {
            var circle = new google.maps.Circle(json_circle);
            var mapUIObject = unit_instance.getUiObject('^');
            circle.setMap(mapUIObject);
            unit_instance.setUiObject(path, circle);
        }

        function createPolygons (path, unit_instance, json_polygon) {
            var polygon = new google.maps.Polygon(json_polygon);
            var mapUIObject = unit_instance.getUiObject('^');
            polygon.setMap(mapUIObject);
            unit_instance.setUiObject(path, polygon);
        }

        function createPolylines (path, unit_instance, json_polyline) {
            var polyline = new google.maps.Polyline(json_polyline);
            var mapUIObject = unit_instance.getUiObject('^');
            polyline.setMap(mapUIObject);
            unit_instance.setUiObject(path, polyline);
        }

        function createRectangles (path, unit_instance, json_rectangle) {
            var bounds_json = json_rectangle.bounds;
            var sw_json = bounds_json.sw;
            var ne_json = bounds_json.ne;
            var sw_latlng = new google.maps.LatLng(sw_json.lat, sw_json.lng);
            var ne_latlng = new google.maps.LatLng(ne_json.lat, ne_json.lng);
            json_rectangle.bounds = new google.maps.LatLngBounds(sw_latlng, ne_latlng);
            var rectangle = new google.maps.Rectangle(json_rectangle);
            var mapUIObject = unit_instance.getUiObject('^');
            rectangle.setMap(mapUIObject);
            unit_instance.setUiObject(path, rectangle);
        }

        function destruct(unit_instance) {
            unit_instance.setUiObject('^', null);
        }

        function updateMarker(unit_instance, diff) {
            var unit_state = diff.getPayload();
            var id = diff.getTarget();
            var marker = unit_instance.getUiObject(id);
            marker.setOptions(unit_state);
        }

        function updateMarkers(unit_instance, diff) {

            var markers = diff.getPayload();
            if (!lodash.isUndefined(markers)) {
                for (var i = 0; i < markers.length; i++) {
                    createMarkerV2(diff.target.arrayNav(i), unit_instance, markers[i]);
                }
            }
        }

        function createMarkerV2(path, unit_instance, json_marker) {

            var casted = {position: {}};

            casted.position.lat = Number(json_marker.position.lat);
            casted.position.lng = Number(json_marker.position.lng);

            var marker = new google.maps.Marker(casted);
            var mapUIObject = unit_instance.getUiObject('^');
            marker.setMap(mapUIObject);

            if (json_marker.hasOwnProperty('infowindow')) {
                var infowindow = new google.maps.InfoWindow({
                    content: json_marker.infowindow
                });
                marker.addListener('click', function() {
                    infowindow.open(mapUIObject, marker);
                });
            }

            // unit_instance.setUiObject(path, marker);
        }



        function updatePosition(unit_instance, diff) {
            var unit_state = diff.getPayload();
            var id = diff.getTarget();
            var marker = unit_instance.getUiObject(id.up());
            marker.setPosition(unit_state);
        }

        function updateLat(unit_instance, diff) {
            var unit_state = diff.getPayload();
            var id = diff.getTarget();
            var marker = unit_instance.getUiObject(id.up().up());
            marker.setPosition({lat: unit_state, lng: marker.position.lng()})
        }

        return GoogleMapsUnit;
    }
);