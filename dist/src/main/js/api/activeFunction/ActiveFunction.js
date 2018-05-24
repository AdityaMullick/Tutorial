define(
    /* Class name */
    'main/api/activeFunction/ActiveFunction',

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
        function ActiveFunction() {

            /**
             * @private
             * @type {!Array}
             */
            // FIXME: Use DiffSignatureTrie to improve performance of delta function retrieval()
            this._delta_function_map = {};
        }

        /**
         * Adds a delta function.
         *
         * @param {!Op}         op          - the op.
         * @param {!PathSignature} target   - the target.
         * @param {!Function}   delta function    - the callback function.
         */
        ActiveFunction.prototype.addDeltaFunction = function(op, target, callback) {

            assert(op instanceof Op, 'Op must be provided');
            assert(lodash.isString(target) || ((target instanceof PathSignature)),
                'Target must be a path (string or object)');
            assert(lodash.isFunction(callback), 'Callback must be a function');

            if (lodash.isString(target)) {
                target = new PathSignature(target);
            }

            var operatorName = op.name;
            if (!(operatorName in this._delta_function_map)) {
                this._delta_function_map[operatorName] = {};
                this._delta_function_map[operatorName][target.string] = callback
            }
            else{
                this._delta_function_map[operatorName][target.string] = callback
            }

            // this._renderer_map.push(new Renderer(op, target, callback));
        };

        ActiveFunction.prototype.addInitFunction = function(callback) {
            assert(lodash.isFunction(callback), 'Callback must be a function');
            this._delta_function_map['init'] = callback;
        };



        /**
         * Gets the renderer that supports the given op and target.
         *
         * @param {!Op}     op      - the op.
         * @param {!Path}   target  - the target.
         * @returns the delta function if it exists, null otherwise.
         */
        ActiveFunction.prototype.getDeltaFunction = function(op, target) {

            assert(op instanceof Op, 'Op must be provided');
            assert(lodash.isString(target) || ((target instanceof Path) || (target instanceof HtmlPath)),
                'Target must be a path (string or object)');

            if (lodash.isString(target)) {
                target = new Path(target);
            }

            // FIXME: When a match cannot be found, lodash.find() returns undefined instead of null
            var map = this._delta_function_map[op.name];
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    var pathSignature = new PathSignature(key);
                    if (pathSignature.matches(target)) {
                        return map[key]
                    }
                }
            }
            return null;
        };

        ActiveFunction.prototype.getInitFunction = function() {
            return this._delta_function_map['init']
        };

        ActiveFunction.prototype.executeInitFunction = function() {
            return this.getInitFunction().call(this);
        };

        return ActiveFunction;
    }
);