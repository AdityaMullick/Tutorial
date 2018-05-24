define('Forward', [], function(){
    function Forward() {
        /**
         *
         * @type {{}} - The VDB variable
         */
        this.vdb = {};

        this._runtime;

        /**
         * Displays the provided Forward template.
         * @param {String} template - The path of the template
         * @param {String}? id - The ID of the placeholder (HTML element) under which the template will be displayed - Optional
         */
        this.display = function(template, id) {
            this._display(template, this.vdb, id);
        };

        this._display = function(template, vdb, id) {
            requirejs(['jquery', 'main/runtime/Runtime', 'main/grammar/forward-web', 'text!' + template, 'lodash'],
                function (jQuery, Runtime, parser, template_file, lodash) {

                    var templateAst;
                    try {
                        // parsing the template file
                        templateAst = parser.parse(template_file);
                    } catch (e) {
                        if ("location" in e) {
                            throw new Error("Parsing error on line " + e.location.start.line
                                + ", column " + e.location.start.column+ ".  " + e.name + ": " + e.message);
                        }
                        else {
                            throw new Error(e.stack);
                        }
                    }

                    // if the id of the placeholder is not provided FORWARD will generate one automatically and add it
                    // to the DOM
                    if (lodash.isUndefined(id)) {
                        var container_element = jQuery.parseHTML('<div />')[0];
                        container_element.setAttribute('id', 'template_instance');
                        container_element.style.height = "500px";
                        document.body.appendChild(container_element);
                        this._runtime = Runtime.fullyEvaluate('template_instance', templateAst, vdb);

                        document.getElementById("template_instance").style.height = "500px";
                    } else {
                        Runtime.fullyEvaluate(id, templateAst, vdb);
                    }
                });
        };

        this._display_template = function(template_file, vdb, id) {
            requirejs(['jquery', 'main/runtime/Runtime', 'main/grammar/forward-web', 'lodash'],
                function (jQuery, Runtime, parser, lodash) {

                    var templateAst;
                    try {
                        // parsing the template file
                        templateAst = parser.parse(template_file);
                    } catch (e) {
                        if ("location" in e) {
                            throw new Error("Parsing error on line " + e.location.start.line
                                + ", column " + e.location.start.column+ ".  " + e.name + ": " + e.message);
                        }
                        else {
                            throw new Error(e.stack);
                        }
                    }

                    // if the id of the placeholder is not provided FORWARD will generate one automatically and add it
                    // to the DOM
                    if (lodash.isUndefined(id)) {
                        var container_element = jQuery.parseHTML('<div />')[0];
                        container_element.setAttribute('id', 'template_instance');
                        container_element.style.height = "500px";
                        document.body.appendChild(container_element);
                        this._runtime = Runtime.fullyEvaluate('template_instance', templateAst, vdb);

                        document.getElementById("template_instance").style.height = "500px";
                    } else {
                        Runtime.fullyEvaluate(id, templateAst, vdb);
                    }
                });

        };

        this.applyDiffs = function(diffs) {
            this._applyDiffs(diffs, this.vdb);
        };

        this._applyDiffs = function(diffs, vdb) {
            requirejs(['jquery', 'main/runtime/Runtime'],
                function (jQuery, Runtime) {
                    Runtime.partiallyEvaluate(diffs, vdb);
                });
        };
    }

    return new Forward();
});
