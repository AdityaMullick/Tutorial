/* Shim to load non-AMD libraries that depend on other non-AMD libraries */

require.config({
    paths: {
        'leaflet': 'http://unpkg.com/leaflet@0.7.7/dist/leaflet'

    },
    shim: {
        leaflet: {
            exports: 'Leaflet'
        }
    }
});

define(
    /* Class name */
    'main/units/leaflet/LeafletUnit',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/unit/Unit', 'main/api/diff/Op', 'leaflet'],

    /* Class symbols */
    function (assert, lodash, Unit, Op, L) {

        'use strict';

        /**
         * @class A Leaflet Unit.
         *
         */
        function LeafletUnit() {

            /* Super constructor */
            Unit.call(this);

            this.addRenderer(Op.CONSTRUCT, '^', construct);
            this.addRenderer(Op.UPDATE, '^.markers[*].position', updateMarker);
            //this.addRenderer(Op.DESTRUCT, '^', destruct);
            //this.addRenderer(Op.DELETE, '^.series[*]', deleteSeries);
            //this.addRenderer(Op.APPEND, '^.series[*].data', appendToSeriesData);
            //this.addRenderer(Op.UPDATE, '^.series[*].data', updateDataSeries);
            //this.addRenderer(Op.UPDATE, '^.series[*]', updateSeries);
            //this.addRenderer(Op.APPEND, '^.series', appendToSeries);
            //this.addRenderer(Op.UPDATE, '^.size', updateChartSize);
            //this.addRenderer(Op.UPDATE, '^.title', updateChartTitle);
            //this.addRenderer(Op.UPDATE, '^.subtitle', updateChartTitle);
            //this.addRenderer(Op.UPDATE, '^.*.extremes', updateStarExtremes);
            //this.addRenderer(Op.INSERT_INTO_ARRAY, '^.series[*].data[*]', insertIntoSeriesData);
            //this.addRenderer(Op.UPDATE, '^.series[*].visible', updateSeriesVisibility);
        }

        /* Super class */
        LeafletUnit.prototype = new Unit();

        function construct(unit_instance, diff) {
            var map = L.map(unit_instance.container_element_id).setView(diff.getPayload().options.center,
                diff.getPayload().options.zoom);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            unit_instance.setUiObject(diff.target, map);

            var markers_var = diff.getPayload().markers;
            if (!lodash.isUndefined(markers_var)) {
                for (var i = 0; i < diff.getPayload().markers.length; i++) {
                    createMarker(diff.target.tupleNav('markers').arrayNav(i), unit_instance, diff.getPayload().markers[i]);
                }
            }
        }

        function updateMarker(unit_instance, diff) {
            var unit_state = diff.getPayload();
            var id = diff.getTarget();
            var marker = unit_instance.getUiObject(id.up());
            marker.setLatLng(unit_state);
        }

        function createMarker(path, unit_instance, json_marker) {
            var mapUIObject = unit_instance.getUiObject('^');
            //console.log("options: ", json_marker.options);
            if (!lodash.isUndefined(json_marker.options)) {
                json_marker.options.icon = L.icon(json_marker.options.icon);
            }
            var marker = L.marker(json_marker.position, json_marker.options).addTo(mapUIObject);
            marker.bindPopup(marker.popup).openPopup();
            unit_instance.setUiObject(path, marker);
        }

        return LeafletUnit;
    }
);