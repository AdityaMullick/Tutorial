define(
    /* Class name */
    'main/runtime/StructuralTree',

    /* Class dependencies */
    ['main/util/assert', 'main/util/Lang', 'lodash', 'main/runtime/StructuralTreeNode', 'main/api/diff/Path',
        'main/api/path/ArrayNav', 'main/api/path/TupleNav', 'main/api/path/Root'],

    /* Class symbols */
    function (assert, Lang, _, Node, Path, ArrayNav, TupleNav, Root) {

        'use strict';

        /**
         * @class A structural tree. This constructor instantiates the structural tree given a json value.
         *
         * @constructor
         *
         */
        function StructuralTree(jsonValue) {
            this.root = new Node(null, jsonValue);
            generate(this.root, jsonValue);
        }

        /**
         * Generates a structural subtree using a JSON value and inserts it under the node with the given path.
         *
         * @param {!Path} path          - The path.
         * @param {!string} attribute   - The attribute that will be used to attach the generated subtree.
         * @param {!object} value       - The JSON value.
         * @returns {!Node}             - The parent of the attached subtree.
         */
        StructuralTree.prototype.insertIntoTuple = function(path, attribute, value) {

            assert(path instanceof Path, 'The given path is not an instance of the Path class');
            assert(_.isString(attribute), 'The attribute has to be a string');
            assert(!(Lang.isNullOrUndefined(value)), 'The given value cannot be null or undefined');

            // spotting the node under which the given value will be inserted.
            var current_node = this.find(path);
            assert(!(_.isNull(current_node)), 'Invalid path');

            // checking if the current node points to any values.
            // If the following assertion throws an exception then the
            // tree is empty and the insertion should fail, because we
            // only allow updates to be applied to an empty tree.

            assert(!(_.isNull(current_node.value)), 'The structural tree is empty. ' +
                                                    'We cannot insert a new node if the tree is empty');

            // creating a new node and attaching it under the current node
            var n = new Node(current_node, value);
            current_node.insertIntoTupleNode(attribute, n);
            if ((Lang.isTuple(value)) || (Lang.isArray(value) )) {

                //traversing the next subtree of the JSON object
                generate(n, value);
            }
            return current_node;
        };


        /**
         * Generates a structural subtree using a JSON value and inserts it before the
         * array element node with the given path.
         *
         * @param {!Path} insert_at_path            - The path of the node before which the insertion will occur.
         * @param {!object} value                   - The value.
         * @returns {!Node}                         - The parent of the inserted node.
         */
        StructuralTree.prototype.insertIntoArray = function(insert_at_path, value) {
            assert(insert_at_path instanceof Path, 'The given path is not an instance of the Path class');
            assert(!(Lang.isNullOrUndefined(value)), 'The given value cannot be null or undefined');

            // find the node with the given path
            var next_node = this.find(insert_at_path);
            assert((!(_.isNull(next_node))), 'Invalid path');

            // access the array node (parent)
            var array_node = next_node.parent;
            assert(Lang.isArray(array_node.children), 'Path does not lead to an array node');

            var insert_step = insert_at_path.getLastStep();

            // the insert step has to be of type ArrayNav
            assert(insert_step instanceof ArrayNav);
            var position = insert_step.position;

            // checking if the position is a valid index of the array
            assert(array_node.children.length >= position, 'the given position is greater than the length ' +
                                                           'of the array (Out of bounds)');

            // creating a new node and attaching it under the parent node at the specified location.
            var n = new Node(array_node, value);
            array_node.insertIntoArrayNode(position, n);

            // Condition guarding the recursion
            if ((Lang.isTuple(value)) || (Lang.isArray(value) )) {

                //traversing the next subtree of the JSON object
                generate(n, value);
            }
            return array_node;
        };

        /**
         * Attaches a UI object to a node of the structural tree.
         * @param {!Path} path          - The path
         * @param {!Object} ui_object   - The UI Object
         */
        StructuralTree.prototype.setUiObject = function (path, ui_object) {

            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            assert(ui_object instanceof Object, 'The UI Object has to be of type: Object');
            var node = this.find(path);
            assert((!(_.isNull(node))), 'Invalid path');
            node.UiObject = ui_object;

        };

        /**
         * Retrieves a UI object from the corresponding node of the structural tree.
         * @param {!Path} path          - The path
         * @returns {Object}            - The UI Object
         */
        StructuralTree.prototype.getUiObject = function (path) {

            assert(path instanceof Path, 'The path parameter has to be an instance of Path');
            var node = this.find(path);
            assert((!(_.isNull(node))), 'Invalid path');
            assert((!(_.isNull(node.UiObject))), 'There is no UI Object associated with the given path');
            return node.UiObject;

        };


        /**
         * Finds a node given a path. If the path is invalid it returns null.
         *
         * @param {!Path} path      - The path.
         * @returns {?Node}         - The node with the given path. If the path is
         *                            invalid return null.
         */
        StructuralTree.prototype.find = function(path) {

            assert( path instanceof Path, 'The path has to be an instance of Path.');

            // Starting from the root...
            var current_node = this.root;

            // check whether we are looking for the root
            if ((path.steps.length === 1) && (path.steps[0] instanceof Root)) {
                return current_node;
            }

            // Given a path, the first step is the Root step ("^"), the child of the root node can
            // be found at position 1, therefore we set the path_index to 1.
            var path_index = 1;
            var step_obj = path.steps[path_index];
            var step = null;

            // checking if the step will access an array or a tuple. We also make sure that no stars (*) will be
            // present as the Diff path has to contain a path that leads to a specific node.
            assert((step_obj instanceof ArrayNav) || (step_obj instanceof TupleNav), 'The given path is not a Diff Path');
            if (step_obj instanceof ArrayNav) {
                step = step_obj.position;
            }
            else if (step_obj instanceof TupleNav) {
                step = step_obj.attribute;
            }

            // reach the requested node
            while ((current_node.children[step] !== undefined) && (step_obj !== undefined)) {
                current_node = current_node.children[step];

                // checking if the step will access an array or a tuple.
                assert((step_obj instanceof ArrayNav) || (step_obj instanceof TupleNav), 'The given path is not a Diff Path');

                step_obj = path.steps[++path_index];
                if (step_obj instanceof ArrayNav) {
                    step = step_obj.position;
                }
                else if (step_obj instanceof TupleNav) {
                    step = step_obj.attribute;
                }
            }

            // if this holds then the given path does not lead to a valid node
            if (step_obj !== undefined && current_node.children[step] === undefined){
                return null;
            }else{
                return current_node;
            }
        };

        /**
         * Removes the branch with the specified path from the structural tree.
         *
         * @param {!Path} path      - The path.
         * @returns {!Node}         - The parent of the detached node.
         */
        StructuralTree.prototype.remove = function(path) {

            assert(path instanceof Path, 'The given path is not an instance of the Path class');

            // spot the node with the given path
            var node = this.find(path);

            // checking if the node was found
            assert(!(_.isNull(node)), 'Invalid path');
            var parent = node.parent;

            // Deleting the root of the tree is not allowed (an update has to be used instead).
            assert(!(_.isNull(parent)));

            parent.removeNode(path.getLastStep());

            node.parent = null;
            return parent;
        };


        /**
         * Update the structural tree at the specified path given a JSON value.
         *
         * @param {!Path} path      - The path.
         * @param {object} value    - The JSON value.
         * @returns {?Node}         - The parent of the updated subtree, or null if we just updated the entire
         *                            structural tree.
         */
        StructuralTree.prototype.update = function(path, value) {
            assert(path instanceof Path, 'The given path is not an instance of the Path class.');

            // spot the node with the given path
            var node = this.find(path);

            // making sure the path is valid
            assert(!(_.isNull(node)), 'Invalid path');

            var parent = node.parent;

            if (!(_.isNull(parent))) { // it's not the root
                var step = path.getLastStep();
                if (step instanceof ArrayNav) {
                    var position = step.position;
                    parent.children[position] = new Node(parent, value);
                    generate(parent.children[position], value);

                }
                else if (step instanceof TupleNav) {
                    var attribute = step.attribute;
                    parent.children[attribute] = new Node(parent, value);
                    generate(parent.children[attribute], value);
                }

            } else {
                // It's the root
                this.root = new Node(null, value);
                generate(this.root, value);
            }

            // just making sure it will garbage collected
            node.parent = null;
            return parent;
        };


        /**
         * Append the given value at the end of the array with the given path.
         *
         * @param {!Path} path                                  - The path.
         * @param {!object|!boolean|!number|!string} value      - The value.
         * @returns {?Node}                                     - The array node.
         */
        StructuralTree.prototype.append = function(path, value) {
            assert(path instanceof Path, 'The given path is not an instance of the Path class.');
            assert(!(Lang.isNullOrUndefined(value)), 'The given value is either null or undefined');

            // spot the node with the given path
            var array_node = this.find(path);

            assert(!(_.isNull(array_node)), 'Invalid path');
            assert(Lang.isArray(array_node.children), 'Path does not lead to an array node');

            // creating new node and attaching it under the parent node
            var n = new Node(array_node, value);
            array_node.appendNode(n);
            if ((Lang.isTuple(value)) || (Lang.isArray(value) )) {

                // traversing the next subtree of the JSON object
                generate(n, value);
            }
            return array_node;
        };

        /**
         * Returns if the given tree is equal to "this" tree.
         *
         * @param {!object} tree    - The tree we are comparing "this" tree with.
         * @returns {Boolean}       - True if the trees are equal, false if they are not.
         */
        StructuralTree.prototype.equals = function(tree) {
            if (this.root.equals(tree.root)){
                return areTreesEqual(this.root, tree.root);
            }
            return false;
        };


        /**
         * Generates a subtree for the structural tree. Each node points to a corresponding
         * JSON value.
         *
         * @param {!Node} parent     - The parent node of the current subtree.
         * @param {!object} value    - The JSON object that will be referenced by the current node.
         */
        function generate(parent, value) {

            assert(parent instanceof Node);
            assert(Lang.isPrimitive(parent.value), 'The parent of the current subtree cannot be a primitive');
            var n = null;

            if (Lang.isArray(parent.value)) { // identifying an array
                for (var i = 0; i < value.length; i++) {

                    // creating new node and attaching it under the parent node
                    n = new Node(parent, value[i]);
                    parent.appendNode(n);

                    // Condition guarding the recursion
                    if ((Lang.isTuple(value[i])) || (Lang.isArray(value[i]) )) {

                        //traversing the next subtree of the JSON object
                        generate(n, value[i]);
                    }


                }
            }
            else if (Lang.isTuple(parent.value)) { // identifying a tuple
                Object.keys(value).forEach(function (attribute) {

                    // creating new node and attaching it under the parent node
                    n = new Node(parent, value[attribute]);
                    parent.insertIntoTupleNode(attribute, n);

                    // guarding the recursion.
                    if ((Lang.isTuple(value[attribute])) || (Lang.isArray(value[attribute]) )) {

                        //traversing the next subtree of the JSON object
                        generate(n, value[attribute]);
                    }
                });
            }

        }


        /**
         *
         * @param {StructuralTreeNode} n1 - first subtree.
         * @param {StructuralTreeNode} n2 - second subtree.
         * @returns {boolean} - true if they are equal, false otherwise.
         */

        function areTreesEqual(n1, n2){
            if ((n1 === null) && (n2 === null)){
                return true;
            }

            if (!(_.isNull(n1)) && !(_.isNull(n2))){

                // checking if the two current nodes are equal
                var result = n1.equals(n2);

                // all of the current children have to be equal to each other
                if (result === true) {

                    // dict that stores all the children attributes
                    var dict = {};
                    var attribute;
                    for (attribute in n1.children) {
                        if ((attribute in dict)) {
                            dict[attribute] += 1;
                        }
                        else {
                            dict[attribute] = 1;
                        }
                    }
                    for (attribute in n2.children) {
                        if (attribute in dict) {
                            dict[attribute] += 1;
                        }
                        else {
                            dict[attribute] = 1;
                        }
                    }
                    var result_set = [];
                    for (attribute in dict) {

                        // if the value of dict[attribute] is equal to 2 then both
                        // nodes have the same children nodes
                        if (dict[attribute] === 2) {
                            result_set.push(areTreesEqual(n1.children[attribute], n2.children[attribute]));
                        }
                        else {
                            return false;
                        }
                    }

                    // checking if there are subtrees under the two current nodes that are unequal
                    return !(_.contains(result_set, false));

                }
            }
            return false;
        }

        return StructuralTree;


    }
);