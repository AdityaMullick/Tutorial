define(
    /* Class name */
    'main/api/unit/UnitInstance',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/util/Lang', 'main/api/unit/Unit', 'main/api/diff/Diff', 'main/runtime/IndexedPartialTree', 'main/api/diff/Path',
        'main/api/diff/UpdateDiff'],

    /* Class symbols */
    function (assert, lodash, Lang, Unit, Diff, IndexedPartialTree, Path, UpdateDiff) {

        'use strict';

        /**
         * @class A unit instance.
         *
         * @param {!Unit}   unit        - the unit.
         * @param {Jsonpp}  unit_state  - the unit state.
         */
        function UnitInstance(unit, unit_state, forward) {

            assert(unit instanceof Unit);
            //assert(Lang.isJsonpp((unit_state)));

            /**
             * @private
             * @type {!Unit}
             */
            this._unit = unit;

            /**
             * @private
             * @type {!IndexedPartialTree}
             */
            this._unit_state = new IndexedPartialTree(unit_state);


            /**
             * @public
             * @type {!Diff[]}
             */
            this.pending_diffs = [];

            /**
             * @public
             * @type {HTMLElement}
             */
            this.container_element = null;

            /**
             * Reference to forward runtime
             * @private
             */
            this.forward = forward;
        }

        /**
         * Attaches a UI object to a node of the structural tree.
         * @param {!Path|!String} path          - The path
         * @param {!Object} ui_object           - The UI Object
         */
        UnitInstance.prototype.setUiObject = function(path, ui_object) {
            assert((lodash.isString(path)) || (path instanceof Path), 'The 1st ' +
            'parameter of setUiObject() can either be a string or a path object');
            assert(ui_object instanceof Object, 'The 2nd parameter of setUiObject() has to be an Object');
            var path_obj;
            if (lodash.isString(path)) {
                path_obj = new Path(path);
            }
            else { // it's a path
                path_obj = path;
            }
            this._unit_state.setUiObject(path_obj, ui_object);
        };

        /**
         * Retrieves a UI object given a path id.
         * @param {!Path|!String} path          - The path
         * @returns {Object}                    - The UI Object
         */
        UnitInstance.prototype.getUiObject = function(path) {

            assert((lodash.isString(path)) || (path instanceof Path), 'The 1st ' +
            'parameter of setUiObject() can either be a string or a path object');
            var path_obj;
            if (lodash.isString(path)) {
                path_obj = new Path(path);
            }
            else { // it's a path
                path_obj = path;
            }
            return this._unit_state.getUiObject(path_obj);
        };

        /**
         * Renders a diff with a renderer callback function.
         *
         * @param {!Diff} diff - the diff.
         */
        UnitInstance.prototype.render = function(diff) {
            assert(diff instanceof Diff);


            // TODO: maybe put the if then else here instead of all over the place
            var renderer = this._unit.getRenderer(diff.op, diff.target);
            renderer.callback.call(null, this, diff);
        };

        UnitInstance.prototype.applyBindDiff = function(diff) {
            var map = {};
            map[diff.getTarget().steps] = new Path('center');
            var vdbDiff = new UpdateDiff(map[diff.getTarget().steps], diff.getPayload());
            this.forward.applyDiffs([vdbDiff]);
        };


        return UnitInstance;
    }
);