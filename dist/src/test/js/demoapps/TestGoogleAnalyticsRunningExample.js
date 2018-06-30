define(
    /* Class name */
    'test/demoapps/TestGoogleAnalyticsRunningExample',

    /* Class dependencies */
    [ 'main/MainForward', 'main/api/diff/Path', 'main/api/diff/AppendDiff', 'text!./templates/google_analytics.fwd',
        'jquery', 'lodash', 'main/api/diff/UpdateDiff'
    ],

    /* Class symbols */
    function (Forward, Path, AppendDiff, google_analytics, jquery, lodash, UpdateDiff) {

        'use strict';
        var chance = new Chance();


        var COUNTRIES = ['USA', 'Canada', 'Mexico'];

        var i = -1;
        function createUser() {
            i += 1;
            return {
                id : i,
                country: COUNTRIES[Math.floor(Math.random()*COUNTRIES.length)],
                lat : chance.latitude(),
                lng : chance.longitude(),
                rooms: [{
                    measurements: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
                }]
            }
        }

        function generateUserData(n) {
            var arr = [];
            for (var j = 0; j < n; j++) {
                arr.push(createUser());
            }
            return arr;
        }

        function createPageviewDataPoint() {
            return [new Date().getTime(), Math.random() * 100000];
        }


        describe('The Google Analytics demo works for ', function () {

            it('update diffs', function() {

                var n = 100;
                Forward.vdb.users = generateUserData(n);
                Forward.vdb.users_frozen = generateUserData(1);
                Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];

                Forward.display(google_analytics);

                // setInterval(function() {
                var user = createUser();
                var append_diff = new AppendDiff(new Path('users_frozen'), user);
                Forward.applyDiffs([append_diff]);
                // }, 1000);
            });

            it('append diffs that add a new user', function() {

                var n = 100;
                Forward.vdb.users = generateUserData(n);
                Forward.vdb.users_frozen = generateUserData(1);
                Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];

                Forward.display(google_analytics);

                setInterval(function() {
                var user = createUser();
                var append_diff = new AppendDiff(new Path('users'), user);
                Forward.applyDiffs([append_diff]);
                }, 1000);
            });

            it('append diffs that add a measurement in the infowindow of a marker', function() {

                var n = 10;
                Forward.vdb.users = generateUserData(n);
                Forward.vdb.users_frozen = generateUserData(1);
                Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];

                Forward.display(google_analytics);

                var i=0;
                setInterval(function() {
                i++;
                var diff = new AppendDiff(new Path('users['+i%n+'].rooms[0].measurements'), 100);
                Forward.applyDiffs([diff]);
                }, 1000);
            });

            it('update diffs that update the latitude of a user', function() {

                var n = 10;
                Forward.vdb.users = generateUserData(n);
                Forward.vdb.users_frozen = generateUserData(1);
                Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];

                Forward.display(google_analytics);

                var i=0;
                setInterval(function() {
                    i++;
                    Forward.vdb.users[i%n].lat++;
                    var update_diff = new UpdateDiff(new Path('users['+i%n+'].lat'), Forward.vdb.users[i%n].lat);
                    Forward.applyDiffs([update_diff]);
                }, 1000);
            });

        });
    }
);