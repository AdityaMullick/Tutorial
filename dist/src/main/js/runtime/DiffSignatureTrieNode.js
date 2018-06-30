define(
    /* Class name */
    'main/runtime/DiffSignatureTrieNode',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/util/Lang', 'main/api/path/PathStep', 'main/api/diff/Op', 'main/api/diff/DiffSignature', 'main/api/diff/Diff'],

    /* Class symbols */
    function (assert, _, Lang, PathStep, Op, DiffSignature, Diff) {

        'use strict';

        /**
         * @class A Node of the diff signature trie.

         * @constructor
         */
        function DiffSignatureTrieNode() {

            /**
             * Maps an op to a diff signature.
             *
             * @private
             *
             * @type {{}}
             */
            this.op_map = {};

            /**
             * Maps a path step to a diff signature trie node. It represents an edge of the trie.
             *
             * @private
             * @type {{}}
             */
            this.children = {};

            /**
             * Maps an op to a delta function
             * @private
             * @type {{}}
             */
            this.delta_function = {};
        }


        /**
         * Attaches a child node.
         *
         * @param {!PathStep} path_step                 - The step.
         * @param {!DiffSignatureTrieNode] child_node   - The child node that will be attached.
         *
         * @constructor
         */
        DiffSignatureTrieNode.prototype.attachChild = function(path_step, child_node) {
            assert(path_step instanceof PathStep, 'path_step has to be of type PathStep');
            assert(child_node instanceof DiffSignatureTrieNode, 'child node has to be of type' +
                                                                'DiffSignatureTrieNode');
            this.children[path_step] = child_node;
        };

        /**
         * Attaches a diff signature.
         *
         * @param {!DiffSignature} diff_signature       - The diff signature.
         */
        DiffSignatureTrieNode.prototype.attachDiffSignature = function(diff_signature, delta_function) {
            assert(diff_signature instanceof DiffSignature, 'diff_signature has to be of type DiffSignature');
            assert(diff_signature.op instanceof Op, 'diff_signature.op has to be of type Op');

            this.op_map[diff_signature.op.name] = diff_signature;
            this.delta_function[diff_signature.op.name] = delta_function;
        };


        /**
         * Returns the child node with the given step (edge).
         *
         * @param {!PathStep} path_step                 - The step.
         * @returns {?DiffSignatureTrieNode}            - The corresponding DiffSignatureTrieNode.
         */
        DiffSignatureTrieNode.prototype.getChild = function(path_step) {
            assert(path_step instanceof PathStep, 'path_step has to be of type PathStep');
            var child = this.children[path_step];
            if (Lang.isNullOrUndefined(child)) {
                return null;
            }
            return child;
        };

        /**
         * Returns all the children.
         * @returns {{}}            - The children of the current node.
         */
        DiffSignatureTrieNode.prototype.getChildren = function() {
            return this.children;
        };

        /**
         * Returns a diff signature that matches a diff or null if there is
         * no match.
         * @param {!Diff} diff                                                  - The diff.
         * @returns {?{diff_signature: DiffSignature, delta_function:Function}} - An object with the diff signature
         *                                                                        and the delta function or null.
         */
        DiffSignatureTrieNode.prototype.getMatchingDiffSignatureNode = function(diff) {
            assert(diff instanceof Diff, 'diff has to be of type Diff');
            var op_map = this.op_map[diff.getOp().name];
            if (Lang.isNullOrUndefined(op_map)) {
                // then there is not diff signature matching this diff
                return null;
            }
            var return_val = {
                diff_signature: this.op_map[diff.getOp().name],
                delta_function: this.delta_function[diff.getOp().name]
            };
            return return_val;
        };


        return DiffSignatureTrieNode;
    }
);