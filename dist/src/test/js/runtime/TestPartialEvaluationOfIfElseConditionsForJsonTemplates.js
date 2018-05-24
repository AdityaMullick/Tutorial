define(
    /* Class name */
    'test/runtime/_evaluate/TestRuntime',

    /* Class dependencies */
    [ 'text!test/runtime/templates/leaflet_template_used_for_partial_eval.fwd', 'main/grammar/forward-web', 'Chance',
        'jquery', 'main/runtime/Runtime', 'main/api/diff/UpdateDiff', 'main/api/diff/Path'
    ],

    /* Class symbols */
    function (leaflet_template_used_for_partial_eval, parser, Chance, jQuery, Runtime, UpdateDiff, Path) {

        'use strict';
        var chance = new Chance();

        describe('The partial evaluation stage', function () {

            it('handles diffs that change the truthy condition on template: test/runtime/templates/leaflet_template_used_for_partial_eval.fwd', function() {
                var template = parser.parse(leaflet_template_used_for_partial_eval);
                console.log(template);
                var n = 100;
                var vdb = {};
                vdb.coordinates = getData(n);

                vdb.coordinates[1].valid = false;

                var container_element = jQuery.parseHTML('<div />')[0];
                container_element.setAttribute('id', 'unit_instance_test');
                document.body.appendChild(container_element);


                var template_instance = Runtime.fullyEvaluate('unit_instance_test', template, vdb);
                console.log(template_instance);


                var update_diff = new UpdateDiff(new Path('coordinates[1].valid'), true);

                Runtime.partiallyEvaluate([update_diff], vdb);



            });

            function getData(n) {
                var arr = [];
                for (var i = 0; i < n; i = i + 1) {
                    arr.push(
                        {
                            lat : chance.latitude(),
                            lng : chance.longitude(),
                            valid: chance.bool(),
                            opacity: Math.random()
                        }
                    );
                }
                return arr;
            }
        });
    }
);