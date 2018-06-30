define(
    /* Class name */
    'test/demoapps/TestLetStatements',

    /* Class dependencies */
    [ 'main/MainForward', 'main/api/diff/Path', 'main/api/diff/AppendDiff', 'text!./templates/let_statement_with_functions.fwd',
        'jquery', 'lodash', 'main/api/diff/UpdateDiff', 'text!./templates/action_testing.fwd',
        'text!./templates/bind_testing.fwd'
    ],

    /* Class symbols */
    function (Forward, Path, AppendDiff, google_analytics, jquery, lodash, UpdateDiff, action_testing, bind_testing) {

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
                lng : chance.longitude()
            }
        }

        function resizeGoogleMaps() {
            var element = document.getElementsByClassName("gmap-wrapper")[0];
            if (!lodash.isUndefined(element)) {
                element.style.height = "1500px";
                element.style.width = "1500px";
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

        describe('Let statements ', function () {

            it('with regular functions are parsed successfully', function() {

                var n = 10;
                // Forward.vdb.users = generateUserData(n);
                Forward.vdb.users_frozen = generateUserData(1);
                Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];
                Forward.vdb.sql = function(arg) {
                  var i=0;
                    // setInterval(function() {
                    //     i++;
                    //     var new_user = createUser();
                    //     var diff = new AppendDiff(new Path('users'), new_user);
                    //     Forward.applyDiffs([diff]);
                    // }, 1000);

                  return generateUserData(n);
                };


                Forward.display(google_analytics);


                resizeGoogleMaps();
                var i=0;
                setInterval(function() {
                    i++;
                    var new_user = createUser();
                    var diff = new AppendDiff(new Path('users'), new_user);
                    Forward.applyDiffs([diff]);
                }, 1000);
            });


            it('with active functions are parsed successfully', function() {

                var n = 10;
                // Forward.vdb.users = generateUserData(n);
                Forward.vdb.users_frozen = generateUserData(1);
                Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];

                Forward.display(google_analytics);


                resizeGoogleMaps();

            });

            it('with active functions are parsed successfully', function() {

                var n = 10;
                // Forward.vdb.users = generateUserData(n);
                // Forward.vdb.users = generateUserData(20);
                Forward.vdb.reaction = function(arg) {
                    console.log('action works!', arg);
                };

                Forward.vdb.center = {
                    lat: 25.32131,
                    lng : 131
                };
                Forward.vdb.n = 10;

                Forward.vdb.createUsers = function(arg) {
                    return generateUserData(arg);
                };

                Forward.display(action_testing);


                resizeGoogleMaps();

            });
        });


        fit('with active functions are parsed successfully', function() {

            var n = 10;
            // Forward.vdb.users = generateUserData(n);
            // Forward.vdb.users = generateUserData(20);
            Forward.vdb.reaction = function(arg) {
                console.log('action works!', arg);
            };

            Forward.vdb.center = {
                lat: 25.32131,
                lng : 131
            };
            Forward.vdb.n = 10;

            Forward.vdb.reaction = function(arg) {
                console.log('action works! Printing User:', arg);
            };

            Forward.vdb.centerChange = function(arg, newVal) {
                console.log('action works! Printing User:', arg, newVal);
                var diff = new UpdateDiff(new Path('center'), newVal);
                Forward.applyDiffs([diff]);
            };

            Forward.vdb.stringify = function(arg) {
                return JSON.stringify(arg);
            };

            Forward.vdb.createUsers = function(arg) {
                return generateUserData(arg);
            };

            Forward.display(bind_testing);


            resizeGoogleMaps();

        });
    }
);