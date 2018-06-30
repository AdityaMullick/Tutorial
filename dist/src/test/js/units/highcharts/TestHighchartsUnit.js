define(
    /* Class name */
    'test/units/highcharts/TestHighchartsUnit',

    /* Class dependencies */
    ['main/runtime/UnitInstanceTest', 'template!test/units/highcharts/TestHighchartsUnit.template', 'main/api/diff/Path', 'main/api/diff/DeleteDiff'],

    /* Class symbols */
    function (UnitInstanceTest, template, Path, DeleteDiff) {

        'use strict';

        describe('A Highcharts unit', function () {

            it('can be constructed', function () {
                var test = new UnitInstanceTest(template);
                var chart = test.getComponent();
                expect(chart.series.length).toBe(4);
                expect(chart.series[0].data.length).toBe(12);
            });

            it('can delete a series', function () {
                var test = new UnitInstanceTest(template);
                var chart = test.getComponent();
                expect(chart.series.length).toBe(4);
                expect(chart.series[0].name).toBe('Tokyo');
                expect(chart.series[1].name).toBe('New York');
                expect(chart.series[2].name).toBe('Berlin');
                expect(chart.series[3].name).toBe('London');

                var delete_diff = new DeleteDiff(new Path('^.series[1]'));
                test.render(delete_diff);
                expect(chart.series.length).toBe(3);
                expect(chart.series[0].name).toBe('Tokyo');
                expect(chart.series[1].name).toBe('Berlin');
                expect(chart.series[2].name).toBe('London');
            });

        });
    }
);