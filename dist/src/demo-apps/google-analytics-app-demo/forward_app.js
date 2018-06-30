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
                    measurements: [0, 5, 10, 3, 4, 9, 13, 6, 12, 12, 15]
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

        var time = (new Date()).getTime();
        function createPageviewDataPoint() {
            // var time = (new Date()).getTime();
            var res = [];
            for (var i=0; i< 20; i++) {
                res.push( Math.random() * 1000);

            }
            return res;
        }

        var n = 500;
        Forward.vdb.users = generateUserData(n);
        Forward.vdb.users_frozen = generateUserData(1);
        Forward.vdb.pageviews = {data:createPageviewDataPoint()};


        Forward.display('demoapps/google-analytics-app-demo/template.fwd', 'myID');


        // // Adding a new user
        // setInterval(function() {
        //     var user = createUser();
        //     var append_diff = new AppendDiff(new Path('users'), user);
        //     Forward.applyDiffs([append_diff]);
        // }, 1000);
        //
        //
        // // adding a point to the pageview graph
        // setInterval(function() {
        //     var pageview_data_point = Math.random() * 1000;
        //     var append_diff = new AppendDiff(new Path('pageviews.data'), pageview_data_point);
        //     Forward.applyDiffs([append_diff]);
        // }, 1000);


        // Appending a data point to the users' series.
        // var user_counter = 0;
        // setInterval(function() {
        //     user_counter++;
        //     var user = Forward.vdb.users[0];
        //     user.rooms[0].measurements.push(Math.round(Math.random() * 10));
        //     var update_diff = new AppendDiff(new Path('users['+user_counter%n+'].rooms[0].measurements'), 100);
        //     Forward.applyDiffs([update_diff]);
        // }, 100);

        // Moving an existing user
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
        var i = 0;
        setInterval(function() {
            i++;
            var value = {
                lat : chance.latitude(),
                lng : chance.longitude()
            };
            var diff = new UpdateDiff(new Path('users['+i%n+'].lat'), value.lat);
            // var diff2 = new UpdateDiff(new Path('users['+i%n+'].lng'), value.lng);
            Forward.applyDiffs([diff]);
        }, 500);
    });
});
