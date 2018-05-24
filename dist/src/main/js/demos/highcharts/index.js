define(
    /* Class name */
    'main/demos/highcharts/index',

    /* Class dependencies */
    ['main/runtime/Runtime', 'template!main/demos/highcharts/index.template'],

    /* Class symbols */
    function (Runtime, template) {

        var index = {};

        index.load = function() {
            Runtime.display('content', template);
        };

        return index;
    }
);
