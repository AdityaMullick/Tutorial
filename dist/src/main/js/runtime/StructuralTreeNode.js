define(
    /* Class name */
    'main/runtime/StructuralTreeNode',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/util/Lang', 'main/api/path/ArrayNav', 'main/api/path/TupleNav'],

    /* Class symbols */
    function (assert, _, Lang, ArrayNav, TupleNav) {

        'use strict';

        /**
         * @class A Node of the structural tree.
         *
         * @param {StructuralTreeNode} parent   - The parent node.
         * @param {Object} value                - The JSON value it points to.
         *
         * @constructor
         *
         */
        function StructuralTreeNode(parent, value) {

            /**
             * The value
             * @public
             * @type {Object}
             */
            this.value = value;


            /**
             * A pointer to the children nodes
             * @public
             * @type {[]||{}}
             */
            if (Lang.isTuple(value)) {
                this.children = {};
            }
            else if (Lang.isArray(value)) {
                this.children = [];
            }
            else {
                this.children = null;
            }

            /**
             * The parent of the current node
             * @public
             * @type {StructuralTreeNode}
             */
            this.parent = parent;

            /**
             * The attached UI Object for this node-value.
             * @public
             * @type {Object}
             */
            this.UiObject = null;

        }

        /**
         * Returns the parent of the current node, or null if the current node is the root.
         *
         * @returns {?StructuralTreeNode}
         */
        StructuralTreeNode.prototype.getParent = function() {
            return this.parent;
        };

        /**
         * Returns the value of the current node.
         * @returns {!Object} - The value.
         */
        StructuralTreeNode.prototype.getValue = function() {
            return this.value;
        };

        /**
         * Appends a node at the end of "this" array node.
         *
         * @param node {!Node} node           - Child node that will be appended.
         */
        StructuralTreeNode.prototype.appendNode = function (node) {
            assert((node instanceof StructuralTreeNode), 'node is not of type Node');
            this.children.push(node);
        };

        /**
         * Inserts a new node under a node pointing to a tuple.
         *
         * @param {!string} attribute    - Attribute that will be used for the insertion.
         * @param {!Node} node           - The node that will be inserted.
         */
        StructuralTreeNode.prototype.insertIntoTupleNode = function (attribute, node) {

            assert(Lang.isTuple(this.value), 'Cannot attach a node under a node holding a scalar');
            assert(!Lang.isArray(this.children), 'InsertIntoTupleNode does not deal with arrays');
            assert(_.isString(attribute), 'The attribute has to be a string');
            assert((node instanceof StructuralTreeNode), 'node is not of type Node');

            this.children[attribute] = node;
        };


        /**
         * Inserts a node under this array node, at the defined position.
         *
         * @param {!string | !number} position     - The position of the array the node will be added at.
         * @param {!Node} node                     - The node that will be added.
         */
        StructuralTreeNode.prototype.insertIntoArrayNode = function (position, node) {
            assert((_.isString(position) || _.isNumber(position)), 'The position given at the insertIntoArrayNode ' +
            'function has to be either a string or a number ' +
            'with the correct position');
            assert((node instanceof StructuralTreeNode), 'node is not of type Node');
            assert(Lang.isArray(this.children), 'Cannot insert an array element into a non array node');
            this.children.splice(position, 0, node);
        };

        /**
         * Deletes the child from a tuple or array node.
         *
         * @param {!PathStep} remove_step           - The path step of the element that will be deleted.
         */
        StructuralTreeNode.prototype.removeNode = function (remove_step) {

            // checking if the step corresponds to an array or a tuple.
            assert((remove_step instanceof ArrayNav) || (remove_step instanceof TupleNav),
                'The given step does not point to an array element or a tuple');

            if (remove_step instanceof ArrayNav) {
                var position = remove_step.position;
                this.children.splice(position, 1);
            }
            else{
                var attribute = remove_step.attribute;
                delete this.children[attribute];
            }
        };

        /**
         * Checks if two nodes are equal.
         * @param {Node} node - The node that will be compared with "this" node
         * @returns {boolean} - true if they are equal, false otherwise.
         */
        StructuralTreeNode.prototype.equals = function (node) {
            // checking if the two nodes point to equal values
            if (this.parent !== null && node.parent !== null) {
                return (_.isEqual(this.value, node.value) && (_.isEqual(this.parent.value, node.parent.value)));
            }
            else{
                return _.isEqual(this.value, node.value);
            }

        };

        return StructuralTreeNode;
    }
);