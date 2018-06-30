requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/UpdateDiff', 'main/api/diff/Path'], function(Forward, UpdateDiff, Path) {

        var i;
        function getData(n) {
            var arr = [];
            for (i = 0; i < n; i = i + 1) {
                arr.push(
                    {
                        lat : chance.latitude(),
                        lng : chance.longitude(),
                        opacity: Math.random()
                    }
                );
            }
            return arr;
        }

        var n = 1000;
        Forward.vdb.coordinates = getData(n);
        Forward.display('demoapps/leaflet-with-no-ifs/leaflet-with-no-ifs.fwd');

        Forward.vdb.testFunction = function() {
            return Math.floor((Math.random() * 2));
        };




        setInterval(function() {
            i++;
            var value = {
                lat : chance.latitude(),
                lng : chance.longitude()
            };
            var append_diff = new UpdateDiff(new Path('coordinates['+i%n+']'), value);
            Forward.applyDiffs([append_diff]);
        }, 100);


    });
});
