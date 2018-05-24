define(
    /* Class name */
    'main/demos/google-maps/index',

    /* Class dependencies */
    ['main/runtime/Runtime', 'template!main/demos/google-maps/index.template'],

    /* Class symbols */
    function (Runtime, template) {

        var index = {};

        index.load = function() {

            Runtime.display('content', template);
        };

        return index;
    }
);
