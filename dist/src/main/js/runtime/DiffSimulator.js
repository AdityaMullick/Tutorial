define(
    /* Class name */
    'main/runtime/DiffSimulator',

    /* Class dependencies */
    ['main/util/assert', 'main/util/Lang', 'lodash', 'main/runtime/DiffSignatureTrieNode', 'main/api/diff/Path',
        'main/api/diff/DiffSignature', 'main/api/diff/Diff', 'main/api/path/TupleNav', 'main/api/path/TupleStar',
        'main/api/path/ArrayNav', 'main/api/path/ArrayStar', 'main/runtime/DiffSignatureTrie',
        'main/runtime/IndexedPartialTree', 'main/api/diff/InsertIntoTupleDiff', 'main/api/diff/AppendDiff',
        'main/api/diff/DeleteDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/UpdateDiff'],

    /* Class symbols */
    function (assert, Lang, _, Node, Path, DiffSignature, Diff, TupleNav, TupleStar, ArrayNav, ArrayStar,
              DiffSignatureTrie, IndexedPartialTree, InsertIntoTupleDiff, AppendDiff, DeleteDiff,
              InsertIntoArrayDiff, UpdateDiff) {

        'use strict';


        /**
         * @class The diff simulator.
         *
         * @param {DiffSignature[]} diff_signatures - The list with the diff signatures.
         * @param {object} value                    - The initial visual state.
         * @constructor
         */
        function DiffSimulator(diff_signatures, value) {

            assert(!Lang.isNullOrUndefined(diff_signatures), 'The Diff simulator cannot be initialized with an empty list' +
            'of tries');
            assert(_.isArray(diff_signatures), 'diff_signatures has to be an array of diff signatures');

            this.dst = new DiffSignatureTrie(diff_signatures);
            this.ipt = new IndexedPartialTree(value);
        }

        /**
         * Simulate a set of diffs and apply them to the visual state.
         *
         * @param {!Diff[]} diffs - The array containing all the diffs.
         */
        DiffSimulator.prototype.simulateAll = function(diffs) {
            assert(!Lang.isNullOrUndefined(diffs), 'The array diffs cannot be null or undefined');
            assert(_.isArray(diffs), 'diffs has to be an array of Diffs');

            var diff_signature_and_delta_func = null;
            var all_diffs_hash = {};
            var ancestral_simulated_diffs_hash = {};
            var i;
            for(i = 0; i < diffs.length; i++) {
                assert(diffs[i] instanceof Diff, 'the diffs parameter has to be an array of Diffs');

                // mutating the visual state
                this.applyDiff(diffs[i]);

                // checking if there is a diff signature that matches the current diff.
                diff_signature_and_delta_func = this.dst.matches(diffs[i]);
                if (_.isNull(diff_signature_and_delta_func)) {
                    // No diff signature found. We need to simulate.
                    var simulated = this.simulateOne(diffs[i]);


                    _.forIn(simulated.map, function(value, path) {

                        // a simulated diff is either an update diff or
                        // a combination of a delete and insert diff
                        // encoded as an update diff, therefore the op
                        // is always 'UPDATE'
                        var op = 'UPDATE';

                        // subsumption might only occur if we had to simulate with an ancestor,
                        // so in this case we would have to perform a subsumption check.
                        if (simulated.might_subsume) {
                            if (!ancestral_simulated_diffs_hash.hasOwnProperty(path)) {
                                ancestral_simulated_diffs_hash[path] = {};
                            }
                            ancestral_simulated_diffs_hash[path][op] = simulated.map[path][op];
                            if (!all_diffs_hash.hasOwnProperty(path)) {
                                all_diffs_hash[path] = {};
                            }
                            all_diffs_hash[path][op] = simulated.map[path][op];
                        }
                        else {

                            // If simulation occurred but the resulting diff cannot subsume other diffs
                            // then we simulated with a sibling and the resulting diff is an encoding
                            // of a delete and an insert diff, at this point we are decoding this diff
                            // and adding it to the result set that will be returned by this function.
                            if (!all_diffs_hash.hasOwnProperty(path)) {
                                all_diffs_hash[path] = {};
                            }
                            var simmed_delete = simulated.map[path][op].DELETE;
                            var simmed_insert = simulated.map[path][op].INSERT;
                            all_diffs_hash[path][simmed_delete.diff.op.name] = simmed_delete;
                            all_diffs_hash[path][simmed_insert.diff.op.name] = simmed_insert;
                        }
                    });
                }
                else {

                    // simulation was not necessary.
                    var return_obj = diff_signature_and_delta_func;
                    return_obj.diff = diffs[i];
                    //all_diffs_hash[diffs[i].getTarget()] = {}
                    if (!all_diffs_hash.hasOwnProperty(diffs[i].getTarget().string)) {
                        all_diffs_hash[diffs[i].getTarget().string] = {};
                    }
                    all_diffs_hash[diffs[i].getTarget().string][diffs[i].getOp().name] = return_obj;


                }
            }
            if (_.isEmpty(ancestral_simulated_diffs_hash)) {
                // no subsumption check is necessary
                return all_diffs_hash;
            }

            diffs = this.subsumption(all_diffs_hash, ancestral_simulated_diffs_hash);

            return diffs;

        };


        /**
         * This function simulates a given diff.
         * @param {!Diff} diff  - The input diff.
         * @returns {!object}   - The output is a tuple that contains a diff signature, the delta function and
         *                        the diff that will be used as an input by the delta function, additionally it contains
         *                        a flag that notates if the returning diff(s) might subsume other diffs.
         */
        DiffSimulator.prototype.simulateOne = function(diff) {
            assert(diff instanceof Diff, 'diff has to be of type Diff');
            var result = {};
            if (diff instanceof UpdateDiff) {
                var sibling_simulate = this.simulateWithSiblings(diff);
                if (!_.isNull(sibling_simulate)) {

                    // if this holds then the incoming diff and the simulated one
                    // mutate the same level of the visual state tree therefore
                    // the simulated diff cannot subsume another diff.
                    result.map = sibling_simulate;
                    result.might_subsume = false;
                    return result;
                }
            }
            // If we have to simulate with ancestor then the output might subsume other diffs
            result.map = this.simulateWithAncestor(diff);
            result.might_subsume = true;
            return result;
        };

        /**
         * This function performs a subsumption check and only returns non-subsumed
         * {diff,delta function, diff signature} tuples (we will call them diff tuples).
         * @param {!object} all_diffs         - All the diff tuples.
         * @param {!object} simulated_diffs   - The diff tuples that are simulated.
         * @returns {!object}                 - The diff tuples that are not subsumed by others
         */
        DiffSimulator.prototype.subsumption = function(all_diffs, simulated_diffs) {
            var result_set = {};
            _.forIn(all_diffs, function(value, path) {
                var diff_target = new Path(path);
                var steps = diff_target.steps;
                var path_str = '';
                for (var i = 0; i < steps.length; i++) {
                    path_str = path_str + steps[i].string;
                    var found = simulated_diffs[path_str];
                    if (!Lang.isNullOrUndefined(found)) {
                        var subsumed = simulated_diffs[path_str].UPDATE;
                        if (!_.isNull(subsumed)) {
                            if (_.isEmpty(result_set[path_str])) {
                                result_set[path_str] = {};
                            }
                            if (subsumed.hasOwnProperty('DELETE')) {
                                result_set[path_str][subsumed.DELETE.diff.op.name] = subsumed.DELETE;
                                result_set[path_str][subsumed.INSERT.diff.op.name] = subsumed.INSERT;
                            }
                            else {
                                result_set[path_str].UPDATE = subsumed;
                            }
                            break;
                        }
                    }

                    if (_.isEqual(path_str, diff_target.string)) {
                        result_set[path] = all_diffs[path];
                    }
                }

            });
            return result_set;
        };


        /**
         * This function performs a simulation with the ancestor.
         * @param {object} diff     - The diff that will be simulated
         * @returns {object}        - The diff tuple (a tuple that contains the simulated diff, the diff signature
         *                            and a delta function)
         */
        DiffSimulator.prototype.simulateWithAncestor = function(diff) {
            var S = null;
            var u_hat = diff.getTarget();
            var n = this.ipt.find(u_hat);
            while (true) {
                n = n.getParent();
                u_hat = u_hat.up();
                var u = n.getValue();
                var update_diff = new UpdateDiff(u_hat, u);
                var update_trigger = this.dst.matches(update_diff);
                if (!_.isNull(update_trigger)) {
                    update_trigger.diff = update_diff;
                    S = {};
                    S[update_diff.getTarget().string] = {};
                    S[update_diff.getTarget().string].UPDATE = update_trigger;
                }
                else {
                    S = this.simulateWithSiblings(update_diff);
                }
                if (!_.isNull(S)) {
                    return S;
                }
            }
        };

        /**
         * This function performs a simulation with a sibling. (It simulates an update diff with an insert and a delete)
         * @param diff              - The diff that will be simulated
         * @returns {object}        - The diff tuple (a tuple that contains the simulated diff, the diff signature
         *                            and a delta function)
         */
        DiffSimulator.prototype.simulateWithSiblings = function(diff) {
            var S = null;
            var v_hat = diff.getTarget();
            var v_prime = diff.getPayload();

            // constructing a delete diff to check if there is a diff signature that matches it
            var delete_diff = new DeleteDiff(v_hat);
            var delete_trigger;
            var insert_trigger;

            // checking if u_hat points to an array.
            // the last step of v_hathas to be an array nav if u_hat points to an array.
            if (v_hat.getLastStep() instanceof ArrayNav) {

                // constructing an insert diff
                var insert_into_array_diff = new InsertIntoArrayDiff(v_hat, v_prime);

                // checking if there exist diff signatures that match the delete and insert diff
                delete_trigger = this.dst.matches(delete_diff);
                insert_trigger = this.dst.matches(insert_into_array_diff);

                // If there exist such diff signatures initialize the S tuple and store everything in it
                if((!_.isNull(delete_trigger)) && ((!_.isNull(insert_trigger)))) {
                    delete_trigger.diff = delete_diff;
                    insert_trigger.diff = insert_into_array_diff;
                    S = {};
                    S[delete_diff.getTarget().string] = {};
                    S[delete_diff.getTarget().string].UPDATE = {DELETE: delete_trigger, INSERT: insert_trigger};
                }
            }
            else if (v_hat.getLastStep() instanceof TupleNav) {
                var u_hat = v_hat.up();
                var last_attribute = v_hat.getLastStep().attribute;

                // constructing an insert diff
                var insert_into_tuple_diff = new InsertIntoTupleDiff(u_hat, last_attribute, v_prime);

                // checking if there is are diff signatures that match the delete and insert diff
                delete_trigger = this.dst.matches(delete_diff);
                insert_trigger = this.dst.matches(insert_into_tuple_diff);

                // If there exist such diff signatures initialize the S tuple and store everything in it
                if((!_.isNull(delete_trigger)) && ((!_.isNull(insert_trigger)))) {
                    delete_trigger.diff = delete_diff;
                    insert_trigger.diff = insert_into_tuple_diff;
                    S = {};
                    S[delete_diff.getTarget().string] = {};
                    S[delete_diff.getTarget().string].UPDATE = {DELETE: delete_trigger, INSERT: insert_trigger};
                }

            }
            return S;
        };

        /**
         * This method is used to apply a diff to the visual state.
         *
         * @param {!Diff} diff  - The diff.
         */
        DiffSimulator.prototype.applyDiff = function(diff) {
            if (diff instanceof InsertIntoArrayDiff) {
                this.ipt.insertIntoArray(diff.getTarget(), diff.getPayload());
            }
            else if (diff instanceof InsertIntoTupleDiff) {
                this.ipt.insertIntoTuple(diff.getTarget(), diff.getAttribute(), diff.getPayload());
            }
            else if (diff instanceof DeleteDiff) {
                this.ipt.remove(diff.getTarget());
            }
            else if (diff instanceof AppendDiff) {
                this.ipt.append(diff.getTarget(), diff.getPayload());
            }
            else if (diff instanceof UpdateDiff) {
                this.ipt.update(diff.getTarget(), diff.getPayload());
            }
        };


        return DiffSimulator;


    }
);