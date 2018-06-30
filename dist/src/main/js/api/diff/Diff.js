define(
    /* Class name */
    'main/api/diff/Diff',

    /* No class dependencies */
    ['main/util/assert', 'main/api/diff/Path', 'main/api/diff/HtmlPath'],

    /* Class symbols */
    function (assert, Path, HtmlPath) {

        'use strict';

        /**
         * @abstract
         * @class A diff.
         *
         * @param {!string} op      - the op.
         * @param {!Path} target    - the target.
         *
         * @constructor
         */
        function Diff(op, target) {

            // Empty constructor for use by sub classes
            if (arguments.length === 0) {
                return;
            }

            /**
             * @private
             * @type {!string}
             */
            this.op = op;

            assert((target instanceof Path) || (target instanceof HtmlPath), 'Target must be a Path or an HtmlPath');

            /**
             * @private
             * @type {!Path}
             */
            this.target = target;
        }

        /**
         * Returns the op.
         *
         * @returns {!string} - The op.
         */
        Diff.prototype.getOp = function () {
            return this.op;
        };

        /**
         * Returns the target.
         *
         * @returns {!Path} - The target.
         */
        Diff.prototype.getTarget = function () {
            return this.target;
        };

        /**
         * Returns a string representation of the diff.
         *
         * @returns {!string}   - The stringified diff
         */
        Diff.prototype.toString = function () {
            return 'diff op: ' + this.op + ' target path: ' + this.target;
        };

        return Diff;


    }
);