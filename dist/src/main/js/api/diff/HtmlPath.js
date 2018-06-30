define(
    /* Class name */
    'main/api/diff/HtmlPath',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/path/HtmlPathParser', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav', 'main/api/path/ArrayStar'],

    /* Class symbols */
    function (assert, lodash, HtmlPathParser, Root, TupleNav, TupleStar, ArrayNav, ArrayStar) {

        'use strict';

        var HTML_PATH_PARSER = new HtmlPathParser();
        //var TUPLE_STAR = new TupleStar();
        var ARRAY_STAR = new ArrayStar();

        /**
         * @class An HTML path. A path object is immutable: all navigation methods return a new path.
         *
         * @param {(!string|!PathStep[])} path - the HTML path, represented as a string or an array of path steps.
         */
        function HtmlPath(path) {

            // Empty constructor for private method newPathNoChecks()
            if (arguments.length === 0) {
                return;
            }

            assert(lodash.isString(path) || lodash.isArray(path), 'Path must be a string or an array of path steps');

            var string;
            var steps;
            if (lodash.isString(path)) {

                // Parse the string
                string = path;
                steps = HTML_PATH_PARSER.parse(string);
            } else {

                // Concatenate the steps
                steps = path;
                string = steps.join('');
            }

            /**
             * @public
             * @type {!string}
             */
            this.string = string;

            /**
             * @public
             * @type {!PathStep[]}
             */
            this.steps = steps;

            // Immutable object
            Object.freeze(this.steps);
            Object.freeze(this);
        }

        /*
         * =============================================================================================================
         * Public accessor methods
         * =============================================================================================================
         */

        /**
         * Returns the last step.
         *
         * @returns {PathStep} the last step.
         */
        HtmlPath.prototype.getLastStep = function () {
            return lodash.last(this.steps);
        };

        /**
         * Returns whether this path equals the given path.
         *
         * @param {!Path} path - the given path.
         * @returns {!boolean} whether this path equals the given path.
         */
        HtmlPath.prototype.equals = function (path) {
            assert(path instanceof HtmlPath);
            return this.string === path.string;
        };

        /**
         * Returns whether this path matches the given path.
         *
         * @param {!Path} path - the given path.
         * @returns {!boolean} whether this path matches the given path.
         */
        HtmlPath.prototype.matches = function (path) {
            assert(path instanceof HtmlPath);

            // Both paths must have the same length
            if (this.steps.length !== path.steps.length) {
                return false;
            }

            // Every path step must match
            return (lodash.every(this.steps), function(step, index) {
                step.matches(path.steps[index]);
            });
        };

        /*
         * =============================================================================================================
         * Public methods that create new paths
         * =============================================================================================================
         */

        /**
         * Creates a new path that is this path without the last step.
         *
         * @returns {!Path} the new path.
         */
        HtmlPath.prototype.up = function() {
            assert(this.steps.length > 1, 'Cannot navigate up from ^');
            var new_steps = lodash.clone(this.steps);
            var last_step = new_steps.pop();
            var new_string = this.string.substr(0, this.string.length - last_step.string.length);
            return newPathNoChecks(new_string, new_steps);
        };

        /**
         * Creates a new path that is the concatenation of this path and a tuple nav step using the given attribute.
         *
         * @param {!string} attribute - the attribute.
         * @returns {!Path} the new path.
         */
        HtmlPath.prototype.tupleNav = function (attribute) {
            assert(lodash.isString(attribute));
            return this.concat(new TupleNav(attribute));
        };

        /**
         * Creates a new path that is the concatenation of this path and a tuple star step.
         *
         * @returns {!Path} the new path.
         */
        HtmlPath.prototype.tupleStar = function () {
            return this.concat(TUPLE_STAR);
        };

        /**
         * Creates a new path that is the concatenation of this path and an array nav step using the given position.
         *
         * @param   {!number} position - the position.
         * @returns {!Path} the new path.
         */
        HtmlPath.prototype.arrayNav = function (position) {
            assert(lodash.isNumber(position));
            return this.concat(new ArrayNav(position));
        };

        /**
         * Creates a new path that is the concatenation of this path and an array star step.
         *
         * @returns {!Path} the new path.
         */
        HtmlPath.prototype.arrayStar = function () {
            return this.concat(ARRAY_STAR);
        };


        /**
         * Creates a new path that is the concatenation of this path and the given path step.
         *
         * @param {!PathStep} step - the path step.
         * @returns {!Path} the new path.
         */
        HtmlPath.prototype.concat = function (step) {
            var new_string = this.string + step.string;
            var new_steps = lodash.clone(this.steps);
            new_steps.push(step);
            return newPathNoChecks(new_string, new_steps);
        };

        /*
         * =============================================================================================================
         * Private methods
         * =============================================================================================================
         */

        /**
         * Constructs a new path without any sanity checks.
         *
         * @param {!string}     string  - the string representation.
         * @param {!PathStep[]} steps   - the path steps.
         * @returns {!Path}     the path.
         */
        function newPathNoChecks(string, steps) {

            // Use the private constructor with no arguments
            var path = new HtmlPath();
            path.string = string;
            path.steps = steps;

            // Immutable object
            Object.freeze(path.steps);
            Object.freeze(path);

            return path;
        }

        return HtmlPath;
    }
);