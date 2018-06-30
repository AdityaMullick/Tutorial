requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {

        var i = 0;
        function createUser() {
            var COUNTRIES = ['USA', 'Canada', 'Mexico'];
            i += 1;
            return {
                id : i,
                country: COUNTRIES[Math.floor(Math.random()*COUNTRIES.length)],
                lat : chance.latitude(),
                lng : chance.longitude()
            }
        }

        function generateUserData(n) {
            var arr = [];
            for (var j = 0; j < n; j++) {
                arr.push(createUser());
            }
            return arr;
        }

        Forward.vdb.center = {
            lat: 25.32131,
            lng : 131
        };


        Forward.vdb.stringify = function(arg) {
            return JSON.stringify(arg);
        };
        Forward.vdb.n = 10;

        Forward.vdb.createUsers = function(arg) {
            return generateUserData(arg);
        };

        Forward.display('demoapps/google-maps-with-action/google-maps-with-action.fwd', 'myID');

        Forward.vdb.reaction = function(arg) {
            console.log('action works! Printing User:', arg);
        };

        Forward.vdb.centerChange = function(arg, newVal) {
            console.log('action works! Printing User:', arg, newVal);
            var diff = new UpdateDiff(new Path('center'), newVal);
            Forward.applyDiffs([diff]);
        };



        // setInterval(function() {
        //     i++;
        //     var value = {
        //         lat : chance.latitude(),
        //         lng : chance.longitude()
        //     };
        //     var append_diff = new AppendDiff(new Path('users'), value);
        //     Forward.applyDiffs([append_diff]);
        // }, 100);


    });
});
