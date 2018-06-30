define(
    /* Class name */
    'main/api/path/PathStep',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/_util/Encoder'],

    /* Class symbols */
    function (assert, lodash, Encoder) {

        'use strict';

        /**
         * @abstract
         * @class A path step.
         *
         * @param {!string} string - the string representation, with special characters escaped if necessary.
         */
        function PathStep(string) {

            // Empty constructor for prototype chaining
            if (arguments.length === 0) {
                return;
            }

            assert(lodash.isString(string));

            /**
             * The string representation with special characters escaped if necessary.
             *
             * @public
             * @readonly
             * @type {!string}
             */
            this.string = string;
        }

        /**
         * Returns whether this path step equals the given path step.
         *
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path step equals the given path step.
         */
        PathStep.prototype.equals = function (path_step) {
            assert(path_step instanceof PathStep);
            return this.string === path_step.string;
        };

        /**
         * Returns whether this path step matches the given path step.
         *
         * @abstract
         * @param {!PathStep} path_step - the given path step.
         * @returns {!boolean} whether this path matches the given path.
         */
        PathStep.prototype.matches = function () {
            throw new Error('Must be implemented by subclass');
        };

        /**
         * Returns the string representation.
         *
         * @returns {!string} the string representation.
         */
        PathStep.prototype.toString = function() {
            return this.string;
        };

        /**
         * The special characters used within a path, mapped to their escape sequences.
         *
         * @public
         * @constant
         * @type {!object}
         *
         */
        PathStep.SPECIAL_CHARS = {
            '^': '%5e',
            '.': '%2e',
            '*': '%2a',
            '[': '%5b',
            ']': '%5d',
            '%': '%25'
        };

        /**
         * The encoder for escaping/unescaping special characters.
         *
         * @public
         * @constant
         * @type {!Encoder}
         *
         */
        PathStep.ENCODER = new Encoder(PathStep.SPECIAL_CHARS);

        return PathStep;
    }
);