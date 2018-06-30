define(
    /* Class name */
    'main/demos/requirejs/index',

    /* Class dependencies */
    ['forward-runtime', 'forward-template!main/demos/requirejs/index.template'],

    /* Class symbols */
    function (forward, template) {

        var index = {};

        index.load = function() {
            forward.display('content', template);
        };

        return index;
    }
);
