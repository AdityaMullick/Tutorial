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
                        valid: chance.bool(),
                        opacity: Math.random()
                    }
                );
            }
            return arr;
        }

        var n = 100;
        Forward.vdb.coordinates = getData(n);
        Forward.display('demoapps/templates/leaflet_template_used_for_partial_eval.fwd');

        Forward.vdb.testFunction = function() {
            return Math.floor((Math.random() * 2));
        };




        setInterval(function() {

            var value = chance.bool();
            var append_diff = new UpdateDiff(new Path('coordinates[0].valid'), value);
            Forward.applyDiffs([append_diff]);
        }, 2000);


    });
});
