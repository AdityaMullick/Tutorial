define(
    /* Class name */
    'main/api/unit/Unit',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/api/diff/Op', 'main/api/diff/Path', 'main/api/diff/HtmlPath',
        'main/api/diff/DiffSignature', 'main/api/unit/Renderer', 'main/api/path/PathSignature'],

    /* Class symbols */
    function (assert, lodash, Op, Path, HtmlPath, DiffSignature, Renderer, PathSignature) {

        'use strict';

        /**
         * @abstract
         * @class A visual unit.
         *
         */
        function Unit() {

            /**
             * @private
             * @type {!Array}
             */
            // FIXME: Replace with DiffSignatureTrie to improve performance of getRenderer()
            this._renderer_map = [];
        }

        /**
         * Adds a renderer.
         *
         * @param {!Op}         op          - the op.
         * @param {!PathSignature} target   - the target.
         * @param {!Function}   callback    - the callback function.
         */
        Unit.prototype.addRenderer = function(op, target, callback) {

            assert(op instanceof Op, 'Op must be provided');
            assert(lodash.isString(target) || ((target instanceof PathSignature)),
                'Target must be a path (string or object)');
            assert(lodash.isFunction(callback), 'Callback must be a function');

            if (lodash.isString(target)) {
                target = new PathSignature(target);
            }

            this._renderer_map.push(new Renderer(op, target, callback));
        };

        // TODO: move it to the HTMLUnit class...
        /**
         * Adds an HTML renderer.
         * @param {!Op} op              - the op.
         * @param {!Function} callback  - the target.
         */
        Unit.prototype.addHtmlRenderer = function(op, callback) {

            assert(op instanceof Op, 'Op must be provided');
            assert(lodash.isFunction(callback), 'Callback must be a function');
            this._renderer_map.push(new Renderer(op, new HtmlPath(), callback));
        };


        /**
         * Gets the renderer that supports the given op and target.
         *
         * @param {!Op}     op      - the op.
         * @param {!Path}   target  - the target.
         * @returns the renderer if it exists, null otherwise.
         */
        Unit.prototype.getRenderer = function(op, target) {

            assert(op instanceof Op, 'Op must be provided');
            assert(lodash.isString(target) || ((target instanceof Path) || (target instanceof HtmlPath)),
                    'Target must be a path (string or object)');

            if (lodash.isString(target)) {
                target = new Path(target);
            }

            // FIXME: When a match cannot be found, lodash.find() returns undefined instead of null
            return lodash.find(this._renderer_map, function(x) {
                if (target instanceof HtmlPath) {
                    return x.signature.op === op;
                }
                else {
                    return x.signature.op === op && x.signature.path_signature.matches(target);
                }
            });
        };

        return Unit;
    }
);