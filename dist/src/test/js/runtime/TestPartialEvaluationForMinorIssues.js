define(
    /* Class name */
    'test/runtime/TestPartialEvaluationForMinorIssues',

    /* Class dependencies */
    [ 'main/MainForward', 'main/api/diff/Path', 'main/api/diff/AppendDiff', 'text!./templates/issue_one.fwd', 'text!./templates/issue_two.fwd', 'text!./templates/issue_three.fwd',
       'jquery', 'lodash', 'Chance'
    ],

    /* Class symbols */
    function (Forward, Path, AppendDiff, issue_one_template, issue_two_template, issue_three_template, jquery, lodash, Chance) {

        'use strict';
        var chance = new Chance();

        describe('The partial evaluation stage', function () {

            it('Works for issue one: Partial Eval. of a unit inside of a div', function() {
                Forward.vdb.users = [
                    {coord: {lat: 10, lng: 10}},
                    {coord: {lat: 20, lng: 20}},
                    {coord: {lat: 30, lng: 30}},
                    {coord: {lat: 40, lng: 40}},
                    {coord: {lat: 50, lng: 50}}
                ];
                Forward.display(issue_one_template);

                // setInterval(function() {
                    var user = {coord: {lat: Math.random() * 50, lng: Math.random() * 50}};
                    var append_diff = new AppendDiff(new Path('users'), user);
                    Forward.applyDiffs([append_diff]);
                // }, 1000);
            });

            it('Works for issue two: AppendDiffs on HTML units', function() {
                Forward.vdb.users = [
                    {coord: {lat: 10, lng: 10}},
                    {coord: {lat: 20, lng: 20}},
                    {coord: {lat: 30, lng: 30}},
                    {coord: {lat: 40, lng: 40}},
                    {coord: {lat: 50, lng: 50}}
                ];
                Forward.display(issue_two_template);

                // setInterval(function() {
                    var user = {coord: {lat: 123, lng: 123}};
                    var append_diff = new AppendDiff(new Path('users'), user);
                    Forward.applyDiffs([append_diff]);
                // }, 1000);
            });

            it('Work for issue three: New markers on GoogleMaps with nested units in their infowindows', function() {
                Forward.vdb.users = [
                    {coord: {lat: 10, lng: 10}},
                    {coord: {lat: 20, lng: 20}},
                    {coord: {lat: 30, lng: 30}},
                    {coord: {lat: 40, lng: 40}},
                    {coord: {lat: 50, lng: 50}}
                ];
                Forward.display(issue_three_template);

                // For simplicity, a GoogleMaps unit is nested inside of a GoogleMaps unit.

                setInterval(function() {
                    var user = {coord: {lat: Math.random() * 50, lng: Math.random() * 50}};
                    var append_diff = new AppendDiff(new Path('users'), user);
                    Forward.applyDiffs([append_diff]);
                }, 1000);
            });


        });
    }
);