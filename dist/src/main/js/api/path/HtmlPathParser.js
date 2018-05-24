define(
    /* Class name */
    'main/api/path/HtmlPathParser',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/path/PathStep', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav', 'main/api/path/ArrayStar'],

    /* Class symbols */
    function (assert, lodash, PathStep, Root, TupleNav, TupleStar, ArrayNav, ArrayStar) {

        'use strict';

        var ROOT = new Root();
        //var TUPLE_STAR = new TupleStar();
        var ARRAY_STAR = new ArrayStar();

        /**
         * @class A path parser parses a path from its string representation.
         */
        function HtmlPathParser() {

            /*-
             * A path step is one of:
             * ^        (root)
             * .attr    (tuple nav)
             * .*       (tuple star)
             * [123]    (array nav)
             * [*]      (array star)
             */
            var root = /(\^)/;
            //var tuple_nav = /\/([^\^/*\[\]]+)/; // Match dot, followed by one or more characters that are not special
            //var tuple_star = /(\.\*)/;


            //var array_nav_deprecated = /\/\[(\d+)\]/;
            var array_nav = /\[(\d+)\]/;



            //var array_star = /(\[\*\])/;


            // Combine all regexps with a disjunction
            var steps = [root, array_nav];
            steps = lodash.map(steps, function (x) {
                return x.source;
            });
            var step_regexp = new RegExp(steps.join('|'), 'g');


            /**
             * @private
             * @type {!RegExp}
             */
            this._step_regexp = step_regexp;
        }

        /**
         * Parses path steps from a string.
         *
         * @param {!string} path - the string representation of a path.
         * @returns {!PathStep[]} the path steps.
         */
        HtmlPathParser.prototype.parse = function (path) {

            assert(lodash.isString(path), 'Path must be a string');
            //assert(path.indexOf('^', 0) === 0, 'Path must start with ^');

            // A RegExp with a global flag is stateful! Reset the RegExp before starting a new parse
            this._step_regexp.lastIndex = 0;

            var steps = [];
            var last_index = 0;
            var result;
            while ((result = this._step_regexp.exec(path)) !== null) {

                // Check that the regexp did not skip over any invalid characters
                assert(result.index === last_index, 'Path is invalid at position ' + last_index);
                last_index = this._step_regexp.lastIndex;

                // Use regexp capturing groups to detect which case has been matched
                if (result[1] !== undefined) {
                    steps.push(ROOT);
                } else if (result[2] !== undefined) {
                    steps.push(new ArrayNav(parseInt(result[2], 10)));
                }
            }

            // Check that the regexp did not terminate with trailing invalid characters
            //assert(last_index === path.length, 'Path is invalid at position ' + last_index);

            //var root_steps = lodash.filter(steps, function(s) { return s instanceof Root; });
            //assert(root_steps.length === 1, 'Path must have exactly one ^');

            return steps;
        };

        return HtmlPathParser;
    }
);