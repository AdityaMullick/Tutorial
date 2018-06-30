requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {

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

        var n = 100;
        Forward.vdb.users = generateUserData(n);
        Forward.vdb.users_frozen = generateUserData(1);
        Forward.vdb.pageviews = [{data:[createPageviewDataPoint()]}];




        Forward.display('demoapps/app/template.fwd', 'myID');


        // // Adding a new user
        setInterval(function() {
            var user = createUser();
            var append_diff = new AppendDiff(new Path('users'), user);
            //Forward.applyDiffs([append_diff]);
        }, 1000);


        // // adding a point to the pageview graph
        // setInterval(function() {
        //     var pageview_data_point = createPageviewDataPoint();
        //     var append_diff = new AppendDiff(new Path('pageviews'), pageview_data_point);
        //     Forward.applyDiffs([append_diff]);
        // }, 1000);


        // // Appending a data point to the users' series.
        // setInterval(function() {
        //     var user = Forward.vdb.users[0];
        //     user.rooms[0].measurements.push(Math.round(Math.random() * 10));
        //     var update_diff = new AppendDiff(new Path('users[1].rooms[0].measurements'), 100);
        //     Forward.applyDiffs([update_diff]);
        // }, 1000);

        // // Moving an existing user
        // setInterval(function() {
        //     var index = 0;
        //     var user = Forward.vdb.users[index];
        //     user.lat = chance.latitude();
        //     user.lng = chance.longitude();
        //
        //     var update_diff = new UpdateDiff(new Path('users['+index+']'), user);
        //     Forward.applyDiffs([update_diff]);
        // }, 1000);

        //
        // var i = 0;
        // setInterval(function() {
        //     i++;
        //     var value = {
        //         lat : chance.latitude(),
        //         lng : chance.longitude()
        //     };
        //     var diff = new UpdateDiff(new Path('users['+i%n+'].coord'), value);
        //     Forward.applyDiffs([diff]);
        // }, 500);
    });
});
