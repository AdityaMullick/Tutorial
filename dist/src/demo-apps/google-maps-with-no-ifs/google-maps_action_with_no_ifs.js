requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/AppendDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, AppendDiff, InsertIntoArrayDiff, Path) {

        var i;
        function getData(n) {
            var arr = [];
            for (i = 0; i < n; i = i + 1) {
                arr.push(
                    {
                        lat : chance.latitude(),
                        lng : chance.longitude(),
                        opacity: Math.random(),
                        infowindow: chance.address()
                    }
                );
            }
            return arr;
        }

        var n = 20;
        Forward.vdb.coordinates = getData(n);
        Forward.display('demoapps/google-maps-with-no-ifs/google-maps-with-action.fwd', 'myID');

        Forward.vdb.testFunction = function() {
            return Math.floor((Math.random() * 2));
        };

        Forward.vdb.reaction = function() {
            console.log('sup!');
        }



        // setInterval(function() {
        //     i++;
        //     var value = {
        //         lat : chance.latitude(),
        //         lng : chance.longitude()
        //     };
        //     var append_diff = new AppendDiff(new Path('coordinates'), value);
        //     Forward.applyDiffs([append_diff]);
        // }, 100);


    });
});
