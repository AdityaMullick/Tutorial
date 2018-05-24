define(
    /* Class name */
    'main/runtime/DiffSignatureTrie',

    /* Class dependencies */
    ['main/util/assert', 'main/util/Lang', 'lodash', 'main/runtime/DiffSignatureTrieNode', 'main/api/diff/Path',
        'main/api/diff/DiffSignature', 'main/api/diff/Diff', 'main/api/path/TupleNav', 'main/api/path/TupleStar',
        'main/api/path/ArrayNav', 'main/api/path/ArrayStar'],

    /* Class symbols */
    function (assert, Lang, _, Node, Path, DiffSignature, Diff, TupleNav, TupleStar, ArrayNav, ArrayStar) {

        'use strict';

        /**
         * @function deltaFunc
         *
         * A delta function.
         *
         * @param {Diff} diff   - The diff that will be used by the delta function.
         */

        /**
         * @class A diff signature trie. This constructor generates a trie given a list of diff signatures.
         *
         * @param {{diff_signature: DiffSignature, delta_function: Function}[]} diff_signature_and_deltas - The list
         * with the diff signatures and the corresponding delta functions.
         * @constructor
         */
        function DiffSignatureTrie(diff_signature_and_deltas) {

            assert(!Lang.isNullOrUndefined(diff_signature_and_deltas), 'Cannot create a diff signature trie from an empty list' +
            'of tries');
            assert(_.isArray(diff_signature_and_deltas), 'diff_signatures has to be an array of diff signatures');

            /**
             * @private
             * @type {Node} - The root of the trie.
             */
            this.root = new Node();


            // traversing all the diff signatures
            for (var i = 0; i < diff_signature_and_deltas.length; i++) {
                var diff_sign = diff_signature_and_deltas[i].diff_signature;
                var delta_func = diff_signature_and_deltas[i].delta_function;
                assert(diff_sign instanceof DiffSignature, 'The diff signature has to be of type DiffSignature');
                assert(delta_func instanceof Function, 'The delta function has to be a Function');

                // If this holds a new diff signature and delta function has to be attached to the root node.
                if (diff_sign.path_signature.steps.length === 1) {
                    this.root.attachDiffSignature(diff_sign, delta_func);
                }
                else { // otherwise generate a trie using the diff signature and delta function.
                    this.generate(diff_sign, delta_func);
                }
            }

        }

        /**
         * Given a diff it returns the diff signature that matches it, or null if no such signature is found.
         * @param {!Diff} diff                                                  - The diff.
         * @returns {?{diff_signature: DiffSignature, delta_function:Function}} - An object with the diff signature
         *                                                                        and the delta function if there is a
         *                                                                        diff signature that matches the
         *                                                                        diff or null otherwise.
         */
        DiffSignatureTrie.prototype.matches = function (diff){
            assert(diff instanceof Diff, 'diff has to be an instance of Diff');
            if (diff.getTarget().steps.length === 1) {
                // then the target of this diff corresponds to the root node
                return this.root.getMatchingDiffSignatureNode(diff);
            }
            else { // otherwise we have to traverse the trie to find the matching diff signature
                return this.getMatchingDiffSignature(diff);
            }

        };


        /**
         * It traverses the trie until it finds a diff signature that matches the given diff.
         *
         * @param {Diff} diff                                                   - The diff.
         * @returns {?{diff_signature: DiffSignature, delta_function:Function}} - An object with the diff signature
         *                                                                        and the delta function if there is a
         *                                                                        diff signature that matches the
         *                                                                        diff or null otherwise.
         */
        DiffSignatureTrie.prototype.getMatchingDiffSignature = function(diff) {
            assert( diff instanceof Diff, 'The diff has to be of type Diff');
            var steps = diff.getTarget().steps;

            // starting from the root.
            var parent = this.root;

            // traverse the trie using the diff path steps.
            // starting from i = 1 since steps[0] === '^' and that has already been checked within the constructor.
            for (var i = 1; i < steps.length; i++){
                var node = parent.getChild(steps[i]);
                if (Lang.isNullOrUndefined(node)) {

                    // trie might contain wildcards.
                    if (steps[i] instanceof TupleNav) {

                        // if the current path step is a tuple nav check if the corresponding edge of the trie
                        // is a tuple star.
                        node = parent.getChild(new TupleStar());
                        if (Lang.isNullOrUndefined(node)) {
                            // There is no edge with the given step. Return null.
                            return null;
                        }
                    }
                    else if (steps[i] instanceof ArrayNav){

                        // if the current path step is an array nav check if the corresponding edge of the trie
                        // is an array star.
                        node = parent.getChild(new ArrayStar());
                        if (Lang.isNullOrUndefined(node)) {
                            // There is no child with the given step. Return null.
                            return null;
                        }
                    }
                }
                parent = node;
            }
            // access the node class to check if the op of the diff and the diff signature match.
            return parent.getMatchingDiffSignatureNode(diff);

        };

        /**
         * Given a diff signature, this function generates the trie.
         *
         * @param {!DiffSignature} diff_signature   - The diff signature.
         */
        DiffSignatureTrie.prototype.generate = function(diff_signature, delta_function) {
            assert(diff_signature instanceof DiffSignature, 'The diff_signature parameter has to be of ' +
            'type DiffSignature');
            var steps = diff_signature.path_signature.steps;

            var parent = this.root;

            // for each step of the diff signature generate an edge if there is none already.
            // starting from i = 1 since steps[0] === '^' and that has already been checked within the constructor.
            for (var i = 1; i < steps.length; i++){
                var node = parent.getChild(steps[i]);
                if (Lang.isNullOrUndefined(node)) {
                    var value;

                    // checking if there is a conflict between a wildcard and a regular step
                    if (steps[i] instanceof TupleStar){
                        value = parent.getChildren();

                        Object.keys(value).forEach(function (attribute) {
                            assert(attribute.indexOf('*') > -1, 'Illegal path. Wildcard step after regular step.');

                        });
                    }
                    else if (steps[i] instanceof TupleNav) {
                        value = parent.getChildren();
                        Object.keys(value).forEach(function (attribute) {
                            assert(!(attribute.indexOf('*') > -1), 'Illegal path. Regular step after wildcard step.');

                        });
                    }
                    else if (steps[i] instanceof ArrayStar){
                        value = parent.getChildren();

                        Object.keys(value).forEach(function (attribute) {
                            assert(attribute.indexOf('*') > -1, 'Illegal path. Wildcard step after regular step.');

                        });
                    }
                    else if (steps[i] instanceof ArrayNav) {
                        value = parent.getChildren();
                        Object.keys(value).forEach(function (attribute) {
                            assert(!(attribute.indexOf('*') > -1), 'Illegal path. Regular step after wildcard step.');

                        });
                    }
                    // There is no child with the given step. Let's create one
                    node = new Node();
                    parent.attachChild(steps[i], node);
                }

                parent = node;
            }
            parent.attachDiffSignature(diff_signature, delta_function);

        };

        return DiffSignatureTrie;


    }
);