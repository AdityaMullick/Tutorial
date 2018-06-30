requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {

        function getMeasurements(n) {
            var arr = [];
            var i;
            for (i = 0; i < n; i = i + 1) {
                arr.push(2 * Math.sin(i / 100) + Math.random()+53);
            }
            return arr;
        }
        var id = -1;
        var NUM_DATAPOINTS = 100;
        function createUser() {
            id += 1;
            return {
                id: id,
                coord: {
                    lat: chance.latitude(),
                    lng: chance.longitude()
                },
                rooms: [
                    {
                        measurements: getMeasurements(NUM_DATAPOINTS)
                    }
                ]
            }
        }

        var COUNTRIES = ['USA', 'Mexico', 'Canada'];
        function prepareVDBNestedData(num_of_markers) {

            Forward.vdb.users = [];

            for (var i = 0; i < num_of_markers; i++) {
                Forward.vdb.users.push(createUser());
            }

            Forward.vdb.users_frozen = [{lat: 50, lng: 50, id: -1, country: 'USA'}];
        }



        var n = 20;
        prepareVDBNestedData(n);




        Forward.display('demoapps/new_app/template.fwd', 'myID');




        // Adding a new user
        setInterval(function() {
            var user = createUser();
            var append_diff = new AppendDiff(new Path('users'), user);
            Forward.applyDiffs([append_diff]);
        }, 500);

        // Moving an existing user
        // setInterval(function() {
        //     var diff = new UpdateDiff(new Path('users[0].coord'), {
        //             lat: chance.latitude(),
        //             lng: chance.longitude()
        //     });
        //
        //     Forward.applyDiffs([diff]);
        // }, 2000);


        // // Appending a data point
        // setInterval(function() {
        //     var diff = new AppendDiff(new Path('users[0].rooms[0].measurements'), 50);
        //     Forward.applyDiffs([diff]);
        // }, 200);
    });
});
