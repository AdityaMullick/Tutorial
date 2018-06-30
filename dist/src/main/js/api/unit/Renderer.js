define(
    /* Class name */
    'main/api/unit/Renderer',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/diff/Op', 'main/api/diff/Path', 'main/api/diff/HtmlPath',
        'main/api/diff/DiffSignature'],

    /* Class symbols */
    function (assert, lodash, Op, Path, HtmlPath, DiffSignature) {

        'use strict';

        /**
         * @class A renderer.
         *
         * @param {!Op}             op          - the op.
         * @param {!(string|Path)}  target      - the target.
         * @param {!Function}       callback    - the callback function.
         */
        function Renderer(op, target, callback) {

            assert(op instanceof Op, 'Op must be provided');
            //assert(lodash.isString(target) || target instanceof Path, 'Target must be a path (string or object)');
            assert(lodash.isFunction(callback), 'Callback must be a function');

            if (lodash.isString(target)) {
                target = new Path(target);
            }

            /**
             * @public
             * @type {!DiffSignature}
             */
            if (target instanceof HtmlPath) {
                this.signature = new DiffSignature(op, null); // an html renderer doesn't have a path signature
            }
            else {
                this.signature = new DiffSignature(op, target);
            }

            /**
             * @public
             * @type {!Function}
             */
            this.callback = callback;

            // Immutable object
            Object.freeze(this);
            Object.freeze(this.callback);
        }

        return Renderer;
    }
);