requirejs(['require-config'], function() {
    requirejs(['Forward', 'main/api/diff/AppendDiff', 'main/api/diff/Path'], function(Forward, AppendDiff, Path) {

        var i;
        function getData(n) {
            var arr = [];
            for (i = 0; i < n; i = i + 1) {
                arr.push({
                        y: 2 * Math.sin(i / 100) + Math.random()+53
                    }
                );
            }
            return arr;
        }

        var n = 100;
        Forward.vdb.rooms = [
            {
                measurements: getData(n)
            }
        ];

        Forward.vdb.measurements = getData(n);
        Forward.display('demoapps/highcharts-simple/highcharts_template.fwd', 'myID');


        var percentColors = [
            { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
            { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0 } },
            { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } } ];

        Forward.vdb.getColorForPercentage = function(num) {
            var pct = (num)/100;
            //console.log('sup', pct, num);
            for (var i = 1; i < percentColors.length - 1; i++) {
                if (pct < percentColors[i].pct) {
                    break;
                }
            }
            var lower = percentColors[i - 1];
            var upper = percentColors[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;

            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
            return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
            // or output as hex if preferred
        };

        // setInterval(function() {
        //     i++;
        //     var value =  {y: 2 * Math.sin(i / 100) + Math.random()*100};
        //     var append_diff = new AppendDiff(new Path('rooms[0].measurements'), value);
        //     //var value = {
        //     //    measurements: getData(1)
        //     //};
        //     //var append_diff = new AppendDiff(new Path('rooms'), value);
        //     //
        //     Forward.applyDiffs([append_diff]);
        // }, 100);


    });
});
