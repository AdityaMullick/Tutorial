define(
    /* Class name */
    'main/demos/html/index',

    /* Class dependencies */
    ['main/runtime/Runtime', 'template!main/demos/html/index.template'],

    /* Class symbols */
    function (Runtime, template) {

        var index = {};

        index.load = function() {
            Runtime.display('content', template);
        };

        return index;
    }
);
