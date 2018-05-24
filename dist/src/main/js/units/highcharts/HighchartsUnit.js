/* Shim to load non-AMD libraries that depend on other non-AMD libraries */


// This config file has been added to the main-test.js file instead...

require.config({
   paths: {
       //'highcharts-standalone-adapter': 'http://code.highcharts.com/4.1.5/adapters/standalone-framework',
       'highcharts': 'http://code.highcharts.com/5.0.0/highcharts',
       //'boost': 'https://code.highcharts.com/modules/boost.js'
   },

   shim: {
       //'highcharts-standalone-adapter': {
       //    exports: 'HighchartsAdapter'
       //},

       //'boost-canvas': {
       //    exports: 'boost'
       //},

       highcharts: {
           //deps: [ 'highcharts-standalone-adapter'],
           exports: 'Highcharts'
       }
   }
});

define(
    /* Class name */
    'main/units/highcharts/HighchartsUnit',

    /* Class dependencies */
    // ['main/util/assert', 'lodash', 'main/api/unit/Unit', 'main/api/diff/Op'],
    ['main/util/assert', 'lodash', 'main/api/unit/Unit', 'main/api/diff/Op', 'highcharts'],
    /* Class symbols */
    function (assert, lodash, Unit, Op) {
    //function (assert, lodash, Unit, Op, Highcharts) {

        'use strict';

        /**
         * @class A Highcharts unit.
         *
         */
        function HighchartsUnit() {

            /* Super constructor */
            Unit.call(this);

            this.addRenderer(Op.CONSTRUCT, '^', construct);
            this.addRenderer(Op.DESTRUCT, '^', destruct);
            this.addRenderer(Op.DELETE, '^.series[*]', deleteSeries);
            this.addRenderer(Op.APPEND, '^.series[*].data', appendToSeriesData);
            //this.addRenderer(Op.UPDATE, '^.series[*].data', updateDataSeries);
            this.addRenderer(Op.UPDATE, '^.series[*]', updateSeries);
            this.addRenderer(Op.APPEND, '^.series', appendToSeries);
            this.addRenderer(Op.UPDATE, '^.size', updateChartSize);
            this.addRenderer(Op.UPDATE, '^.title', updateChartTitle);
            this.addRenderer(Op.UPDATE, '^.subtitle', updateChartTitle);
            this.addRenderer(Op.UPDATE, '^.*.extremes', updateStarExtremes);
            this.addRenderer(Op.INSERT_INTO_ARRAY, '^.series[*].data[*]', insertIntoSeriesData);
            this.addRenderer(Op.UPDATE, '^.series[*].visible', updateSeriesVisibility);
        }
        /* Super class */
        HighchartsUnit.prototype = new Unit();

        function construct(unit_instance, diff) {
            var unit_state = diff.getPayload();
            lodash.set(unit_state, 'chart.renderTo', unit_instance.container_element);

            var chart = new Highcharts.Chart(unit_state);

            // Track chart object
            var root_path = diff.target;
            unit_instance.setUiObject(root_path, chart);

            // Track series objects
            var series_path = root_path.tupleNav('series');
            lodash.forEach(chart.series, function(series_object, i) {
                unit_instance.setUiObject(series_path.arrayNav(i), series_object);
            });
        }

        function destruct(unit_instance, diff) {
            var chart = unit_instance.getUiObject(diff.getTarget());
            chart.destroy();
            unit_instance.setUiObject(diff.target, null);
        }

        function deleteSeries(unit_instance, diff) {
            var series_object = unit_instance.getUiObject(diff.target);
            assert(series_object !== null);
            series_object.remove();
        }

        function appendToSeries(unit_instance, diff) {
            var chart = unit_instance.getUiObject('^');
            chart.addSeries(diff.getPayload(), true);
        }

        function updateChartSize(unit_instance, diff) {
            var chart = unit_instance.getUiObject('^');
            chart.setSize(diff.getPayload().width, diff.getPayload().height, false);
        }

        function updateChartTitle(unit_instance, diff) {
            var chart = unit_instance.getUiObject('^');
            var title = diff.getPayload().title || true;
            var subtitle = diff.getPayload().subtitle || true;
            chart.setTitle(title, subtitle);
        }

        function updateStarExtremes(unit_instance, diff) {
            var axis_name = diff.getTarget().up().getLastStep().attribute;
            var chart = unit_instance.getUiObject('^');
            chart[axis_name][0].setExtremes(diff.getPayload().min, diff.getPayload().max);
        }

        function appendToSeriesData(unit_instance, diff) {
            var one_up_path = diff.getTarget().up();
            var series_object = unit_instance.getUiObject(one_up_path);
            series_object.addPoint(diff.getPayload(), true, false, false);
        }

        function updateDataSeries(unit_instance, diff) {
            var one_up_path = diff.getTarget().up();
            var series_object = unit_instance.getUiObject(one_up_path);
            series_object.setData(diff.getPayload(), true, false, false);
        }

        function updateSeries(unit_instance, diff) {
            var series_object = unit_instance.getUiObject(diff.getTarget());
            series_object.update(diff.getPayload());
        }

        function updateSeriesVisibility(unit_instance, diff) {
            var one_up_path = diff.getTarget().up();
            var series_object = unit_instance.getUiObject(one_up_path);
            series_object.setVisible(diff.getPayload());
        }

        function insertIntoSeriesData(unit_instance, diff) {
            var value = diff.getPayload();
            if (lodash.isNumber(value)) {
                var temporary_value = {y : value, x: diff.getTarget().getLastStep().position - 1};
                value = temporary_value;
            }
            var series_object = unit_instance.getUiObject(diff.getTarget().up().up());
            series_object.addPoint(value, true, false, false);
        }

        return HighchartsUnit;
    }
);