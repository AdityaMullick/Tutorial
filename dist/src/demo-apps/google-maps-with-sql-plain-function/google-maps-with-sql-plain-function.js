requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {

        var i = -1;
        function createUser() {
            i += 1;
            return {
                id : i,
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

        Forward.vdb.sql = function(arg) {
            var i=0;
            var n = 10;
            setInterval(function() {
                i++;
                var new_user = createUser();
                var diff = new AppendDiff(new Path('users'), new_user);
                Forward.applyDiffs([diff]);
            }, 100);

            return generateUserData(n);
        };
        Forward.display('demoapps/google-maps-with-sql-plain-function/google-maps-with-sql-plain-function.fwd', 'myID');

    });
});
