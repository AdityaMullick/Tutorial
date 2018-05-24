/**
 * A RequireJS loader plugin that compiles a FORWARD template.
 *
 * @module template
 */
define(
    /* Class name */
    'template',

    /* Class dependencies */
    ['text', 'main/compiler/TemplateCompiler'],

    /* Class symbols */
    function (text, TemplateCompiler) {

        'use strict';

        var template_compiler = new TemplateCompiler();

        /**
         * Loads a resource.
         *
         * @param {!string}     name            - the name of the resource to load.
         * @param {!Function}   parentRequire   - a local "require" function for loading other modules.
         * @param {!Function}   onLoad          - the callback for returning the loaded resource.
         */
        function load(name, parentRequire, onLoad) {

            // Use the "text" plugin to load the resource
            text.get(parentRequire.toUrl(name), function (string) {

                // Compile the template
                var template = template_compiler.compile(string);

                // Load the module dependencies of the template
                parentRequire(template.getDependencies(), function() {

                    // Return the template
                    onLoad(template);
                });
            });
        }

        return {
            load: load
        };
    }
);