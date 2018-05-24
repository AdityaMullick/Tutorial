define(
    /* Class name */
    'main/runtime/IndexedPartialTree',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/StructuralTree', 'main/api/diff/Path', 'main/util/Lang',
        'main/api/path/ArrayNav', 'main/api/path/TupleNav'],

    /* Class symbols */
    function (assert, _, StructuralTree, Path, Lang, ArrayNav, TupleNav) {

        'use strict';

        /**
         * @class An indexed partial tree.
         *
         * @constructor
         *
         * @param {object} value - The value.
         */
        function IndexedPartialTree(value) {
            assert(!(_.isUndefined(value)));

            /**
             * @private
             * @type {object}
             */
            this.partial_value = value;

            /**
             * @private
             * @type {!StructuralTree}
             */
            this.structural_tree = new StructuralTree(this.partial_value);
        }

        /**
         * Returns the partial value.
         *
         * @public
         * @returns {Object} - The partial value.
         */
        IndexedPartialTree.prototype.getPartialValue = function() {
            return this.partial_value;
        };

        /**
         * Returns the structural tree.
         *
         * @public
         * @returns {!Object} - The structural tree.
         */

        IndexedPartialTree.prototype.getStructuralTree = function() {
            return this.partial_value;
        };


        /**
         * Finds and returns the structural tree node with the given path. If
         * the path is invalid null is returned.
         *
         * @param path      - The path
         * @returns {?Node} - The structural tree node with the given path, or null if no such node exists.
         */
        IndexedPartialTree.prototype.find = function (path) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            return this.structural_tree.find(path);
        };

        /**
         * Attaches a UI object to a node of the structural tree.
         * @param {!Path} path          - The path
         * @param {!Object} ui_object   - The UI Object
         */
        IndexedPartialTree.prototype.setUiObject = function (path, ui_object) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            assert(ui_object instanceof Object, 'The UI object has to be an object');

            this.structural_tree.setUiObject(path, ui_object);

        };

        /**
         * Retrieves a UI object from the structural tree.
         * @param {!Path} path          - The path
         * @returns {Object}            - The UI Object
         */
        IndexedPartialTree.prototype.getUiObject = function (path) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');

            return this.structural_tree.getUiObject(path);

        };

        /**
         * Inserts a branch into a tuple node of the indexed partial tree.
         *
         * @param {!Path} path          - The path where the insertion will occur.
         * @param {!string} attribute   - The attribute that will be used for the insertion.
         * @param {!object} value       - The JSON value that will be inserted.
         */
        IndexedPartialTree.prototype.insertIntoTuple = function (path, attribute, value) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            assert(_.isString(attribute), 'The attribute has to be a string');
            assert(!(Lang.isNullOrUndefined(value)), 'The given value is either null or undefined');

            var parent = this.structural_tree.insertIntoTuple(path, attribute, value);

            // Mutating the partial value via the parent of the inserted node.
            parent.value[attribute] = value;
        };


        /**
         * Inserts an element in an array before the element with the given path.
         *
         * @param {!Path} insert_at_path    - The path.
         * @param {!object} value           - The value that will be inserted.
         *
         */
        IndexedPartialTree.prototype.insertIntoArray = function (insert_at_path, value) {
            assert(insert_at_path instanceof Path, 'The insert_at_path parameter has to be an instance of Path');
            assert(!(Lang.isNullOrUndefined(value)), 'The given value is either null or undefined');

            // mutate the structural tree.
            var parent = this.structural_tree.insertIntoArray(insert_at_path, value);
            var insert_step = insert_at_path.getLastStep();

            // checking if the path leads to an array position
            assert(insert_step instanceof ArrayNav);
            var position = insert_step.position;
            position = parseInt(position, 10);

            // Mutating the partial value via the parent of the inserted node.
            parent.value.splice(position, 0, value);
        };


        /**
         * Removes the node with the specified path.
         *
         * @param {!Path} path          - The path.
         */
        IndexedPartialTree.prototype.remove = function (path) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            var parent = this.structural_tree.remove(path);

            var remove_step = path.getLastStep();
            if (remove_step instanceof ArrayNav) {
                var position = remove_step.position;

                // Mutating the partial value via the parent of the deleted node.
                parent.value.splice(position, 1);
            }
            else{
                var attribute = remove_step.attribute;

                // Mutating the partial value via the parent of the deleted node.
                delete parent.value[attribute];
            }

        };

        /**
         * Updates the node with the specified path, using the given JSON value.
         *
         * @param {!Path} path          - The path.
         * @param {object} value        - The JSON value.
         */
        IndexedPartialTree.prototype.update = function (path, value) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');

            var parent = this.structural_tree.update(path, value);

            // check if there is an update on the root
            if (parent === null) {
                this.partial_value = value;
            }
            else {

                // Taking care of the value object
                var step = path.getLastStep();
                if (step instanceof ArrayNav) {
                    var position = step.position;
                    parent.value[position] = value;
                }
                else if (step instanceof TupleNav) {
                    var attribute = step.attribute;
                    parent.value[attribute] = value;
                }
            }
        };

        /**
         * Appends a node to the array with the specified path.
         *
         * @param {!Path} path              - The path of the array node.
         * @param {!object} value           - The JSON value.
         */
        IndexedPartialTree.prototype.append = function (path, value) {
            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            assert(!(Lang.isNullOrUndefined(value)), 'The given value is either null or undefined');

            var parent = this.structural_tree.append(path, value);

            // Mutating the partial value
            parent.value.push(value);
        };


        /**
         * Checks if the given IPT is equal to "this" IPT.
         * @param {IndexedPartialTree} indexed_partial_tree - The given partial tree.
         * @returns {boolean}                               - True if the two IPTs are equal, false otherwise.
         */
        IndexedPartialTree.prototype.equals = function (indexed_partial_tree) {
            var cond1 = this.structural_tree.equals(indexed_partial_tree.structural_tree);
            var cond2 = _.isEqual(this.partial_value, indexed_partial_tree.partial_value);

            return (cond1 && cond2);
        };


        return IndexedPartialTree;


    }
);