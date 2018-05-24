define(
    /* Class name */
    'test/runtime/TestDiffSimulator',

    /* Class dependencies */
    ['main/api/diff/Path', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav',
        'main/api/path/ArrayStar', 'main/api/diff/DiffSignature', 'main/api/diff/Op', 'main/runtime/DiffSimulator',
        'main/api/diff/DeleteDiff', 'main/api/diff/InsertIntoTupleDiff', 'main/api/diff/InsertIntoArrayDiff', 'main/api/diff/UpdateDiff',
        'main/api/diff/AppendDiff', 'lodash', 'main/api/path/PathSignature'],

    /* Class symbols */
    function (Path, Root, TupleNav, TupleStar, ArrayNav, ArrayStar, DiffSignature, Op, DiffSimulator,
              DeleteDiff, InsertIntoTupleDiff, InsertIntoArrayDiff, UpdateDiff, AppendDiff, _, PathSignature) {

        'use strict';

        describe('The Diff Simulation works', function () {

            it('when constructed from diff signatures with paths that contain tuple navs and it ' +
            'matches the appropriate diffs - no simulation and subsumption required ', function () {

                // list of diff signatures
                var diff_signature_and_delta_func_combo_list = [];

                // The delta function
                var f = function (diff) { return diff.toString(); };
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')), delta_function:f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^.abc.delete'));
                diff_signature_and_delta_func_combo_list.push({diff_signature:ds1, delta_function:f});

                var ds2 = new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^.abc.d.e.fg.hcig'));
                diff_signature_and_delta_func_combo_list.push({diff_signature:ds2, delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^.abc.d.e.fg.hcig')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.DELETE, new PathSignature('^.abc.d.e.fg.hcig')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e')), delta_function:f});

                var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^.abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature:ds3, delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.something.else')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.fg.something.else2')), delta_function:f});

                var visual_state = {'root':'node'};
                visual_state.abc = {};
                visual_state.abc.delete = {'delete': 'me'};
                visual_state.abc.d = {};
                visual_state.abc.d.e = {'val1' : 'value1'};
                visual_state.abc.d.e.fg = {};
                visual_state.abc.d.e.fg.hcig = {val:'value2'};
                visual_state.abc.d.e.something = {};
                visual_state.abc.d.e.something.else = 'something else';
                visual_state.abc.d.e.something.else2 = 'something else 2';

                var json = generatePayload(0);

                var final_visual_state = {'root':'node'};
                final_visual_state.abc = {};
                final_visual_state.abc.d = {};
                final_visual_state.abc.d.e = json;

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);

                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^.abc.delete'));
                diffs.push(delete_diff);
                var insert_into_tuple_diff = new InsertIntoTupleDiff(new Path('^.abc.d.e.fg.hcig'), 'new_attribute', json);
                diffs.push(insert_into_tuple_diff);
                var update_diff = new UpdateDiff(new Path('^.abc.d.e'), json);
                diffs.push(update_diff);

                var simulated_array = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                for (var i = 0; i < simulated_array.length; i++) {
                    simulated_diff = simulated_array[i].diff;
                    if(simulated_diff instanceof DeleteDiff) {

                        // the simulated diff has to be equal to the original one.
                        expect(_.isEqual(simulated_diff, delete_diff)).toBe(true);

                        // the delta functions have to be equal
                        expect(_.isEqual(f, simulated_array[i].delta_function)).toBe(true);

                        // diff signatures should match
                        expect(simulated_array[i].diff_signature).toBe(ds1);

                    }
                    else if (simulated_diff instanceof InsertIntoTupleDiff) {

                        // the simulated diff has to be equal to the original one.
                        expect(_.isEqual(simulated_diff, insert_into_tuple_diff)).toBe(true);

                        // the delta functions have to be equal
                        expect(_.isEqual(f, simulated_array[i].delta_function)).toBe(true);

                        // diff signatures should match
                        expect(simulated_array[i].diff_signature.op).toBe(ds2.op);
                        expect(simulated_array[i].diff_signature.path_signature.string).toBe(ds2.path_signature.string);

                    }
                    else if (simulated_diff instanceof UpdateDiff) {

                        // the simulated diff has to be equal to the original one.
                        expect(_.isEqual(simulated_diff, update_diff)).toBe(true);

                        // the delta functions have to be equal
                        expect(_.isEqual(f, simulated_array[i].delta_function)).toBe(true);

                        // diff signatures should match
                        expect(simulated_array[i].diff_signature).toBe(ds3);
                    }
                    else {
                        expect(true).toBe(false);
                    }
                }
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });

            it('when constructed from diff signatures with paths that contain tuple navs and tuple stars and it ' +
            'matches the appropriate diffs - no simulation and subsumption required ', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures and delta functions
                var diff_signature_and_delta_func_combo_list = [];
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e[*].*.hcig')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e[*].*.hcig')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*]')),
                    delta_function: f});

                var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^[*].abc.d.e[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds4, delta_function: f});

                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});


                var visual_state = [];
                visual_state[0] = {attribute : 'value'};
                visual_state[1] = {attribute : 'value'};
                visual_state[1].abc = {};
                visual_state[1].abc.delete = {'delete': 'me'};
                visual_state[1].abc.d = {};
                visual_state[1].abc.d.e = [];
                visual_state[1].abc.d.e[0] = {'val1' : 'value1'};
                visual_state[1].abc.d.e[0].fg = {};
                visual_state[1].abc.d.e[0].fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e[0].something = {};
                visual_state[1].abc.d.e[0].something.else = 'something else';
                visual_state[1].abc.d.e[0].something.else2 = 'something else 2';
                visual_state[1].abc.d.e[1] = {'val1' : 'value1'};
                visual_state[1].abc.d.e[1].fg = {};
                visual_state[1].abc.d.e[1].fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e[1].something = {};
                visual_state[1].abc.d.e[1].something.else = 'something else';
                visual_state[1].abc.d.e[1].something.else2 = 'something else 2';
                visual_state[2] = {attribute : 'value'};
                visual_state[2].abc = {};
                visual_state[2].abc.delete = {'delete': 'me'};
                visual_state[2].abc.d = {};
                visual_state[2].abc.d.e = [];
                visual_state[2].abc.d.e[0] = {'val1' : 'value1'};
                visual_state[3] = {attribute : 'value'};
                visual_state[3].abc = {};
                visual_state[3].abc.delete = {'delete': 'me'};
                visual_state[3].abc.d = {};
                visual_state[3].abc.d.e = [];
                visual_state[3].abc.d.e[0] = {'val1' : 'value1'};

                var json = generatePayload(0);

                var final_visual_state = [];
                final_visual_state[0] = {attribute : 'value'};
                final_visual_state[1] = {attribute : 'value'};
                final_visual_state[1].abc = {};
                final_visual_state[1].abc.delete = {'delete': 'me'};
                final_visual_state[1].abc.d = {};
                final_visual_state[1].abc.d.e = [];
                final_visual_state[1].abc.d.e[0] = {'val1' : 'value1'};
                final_visual_state[1].abc.d.e[0].fg = {};
                final_visual_state[1].abc.d.e[0].fg.hcig = {val:'value2'};
                final_visual_state[1].abc.d.e[0].something = {};
                final_visual_state[1].abc.d.e[0].something.else = 'something else';
                final_visual_state[1].abc.d.e[0].something.else2 = 'something else 2';
                final_visual_state[1].abc.d.e[1] = json;
                final_visual_state[1].abc.d.e[2] = json;
                final_visual_state[2] = {attribute : 'value'};
                final_visual_state[2].abc = {};
                final_visual_state[2].abc.delete = {'delete': 'me'};
                final_visual_state[2].abc.d = {};
                final_visual_state[2].abc.d.e = [];
                final_visual_state[2].abc.d.e[0] = {'val1' : 'value1'};

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);


                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^[2]'));
                diffs.push(delete_diff);
                var append_diff = new AppendDiff(new Path('^[1].abc.d.e'), json);
                diffs.push(append_diff);
                var update_diff = new UpdateDiff(new Path('^[1].abc.d.e[1]'), json);
                diffs.push(update_diff);



                var simulated_diffs = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                _.forIn(simulated_diffs, function(value, path) {
                //for (var i = 0; i < simulated_array.length; i++) {

                    _.forIn(simulated_diffs[path], function(inner_value, op) {
                        simulated_diff = simulated_diffs[path][op].diff;
                        if(simulated_diff instanceof DeleteDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, delete_diff)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature).toBe(ds1);

                        }
                        else if (simulated_diff instanceof AppendDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, append_diff)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature.op).toBe(ds2.op);
                            expect(simulated_diffs[path][op].diff_signature.path_signature.string).toBe(ds2.path_signature.string);

                        }
                        else if (simulated_diff instanceof UpdateDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, update_diff)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature).toBe(ds3);
                        }
                        else {
                            expect(true).toBe(false);
                        }
                    });

                });
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });


            it('when simulation with siblings is and subsumption required - using arrays', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures and delta functions
                var diff_signature_and_delta_func_combo_list = [];
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e[*].*.hcig')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e[*].*.hcig')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*]')),
                    delta_function: f});

                //var ds3 = new DiffSignature(Op.UPDATE, new Path('^[*].abc.d.e[*]'));
                //diff_signature_and_delta_func_combo_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds4, delta_function: f});

                var ds5 = new DiffSignature(Op.INSERT_INTO_ARRAY, new PathSignature('^[*].abc.d.e[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds5, delta_function: f});

                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});


                var visual_state = [];
                visual_state[0] = {attribute : 'value'};
                visual_state[1] = {attribute : 'value'};
                visual_state[1].abc = {};
                visual_state[1].abc.delete = {'delete': 'me'};
                visual_state[1].abc.d = {};
                visual_state[1].abc.d.e = [];
                visual_state[1].abc.d.e[0] = {'val1' : 'value1'};
                visual_state[1].abc.d.e[0].fg = {};
                visual_state[1].abc.d.e[0].fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e[0].something = {};
                visual_state[1].abc.d.e[0].something.else = 'something else';
                visual_state[1].abc.d.e[0].something.else2 = 'something else 2';
                visual_state[1].abc.d.e[1] = {'val1' : 'value1'};
                visual_state[1].abc.d.e[1].fg = {};
                visual_state[1].abc.d.e[1].fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e[1].something = {};
                visual_state[1].abc.d.e[1].something.else = 'something else';
                visual_state[1].abc.d.e[1].something.else2 = 'something else 2';
                visual_state[2] = {attribute : 'value'};
                visual_state[2].abc = {};
                visual_state[2].abc.delete = {'delete': 'me'};
                visual_state[2].abc.d = {};
                visual_state[2].abc.d.e = [];
                visual_state[2].abc.d.e[0] = {'val1' : 'value1'};
                visual_state[3] = {attribute : 'value'};
                visual_state[3].abc = {};
                visual_state[3].abc.delete = {'delete': 'me'};
                visual_state[3].abc.d = {};
                visual_state[3].abc.d.e = [];
                visual_state[3].abc.d.e[0] = {'val1' : 'value1'};

                var json = generatePayload(0);

                var final_visual_state = [];
                final_visual_state[0] = {attribute : 'value'};
                final_visual_state[1] = {attribute : 'value'};
                final_visual_state[1].abc = {};
                final_visual_state[1].abc.delete = {'delete': 'me'};
                final_visual_state[1].abc.d = {};
                final_visual_state[1].abc.d.e = [];
                final_visual_state[1].abc.d.e[0] = {'val1' : 'value1'};
                final_visual_state[1].abc.d.e[0].fg = {};
                final_visual_state[1].abc.d.e[0].fg.hcig = {val:'value2'};
                final_visual_state[1].abc.d.e[0].something = {};
                final_visual_state[1].abc.d.e[0].something.else = 'something else';
                final_visual_state[1].abc.d.e[0].something.else2 = 'something else 2';
                final_visual_state[1].abc.d.e[1] = json;
                final_visual_state[1].abc.d.e[2] = json;
                final_visual_state[2] = {attribute : 'value'};
                final_visual_state[2].abc = {};
                final_visual_state[2].abc.delete = {'delete': 'me'};
                final_visual_state[2].abc.d = {};
                final_visual_state[2].abc.d.e = [];
                final_visual_state[2].abc.d.e[0] = {'val1' : 'value1'};

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);


                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^[2]'));
                diffs.push(delete_diff);
                var append_diff = new AppendDiff(new Path('^[1].abc.d.e'), json);
                diffs.push(append_diff);
                var update_diff = new UpdateDiff(new Path('^[1].abc.d.e[1]'), json);
                diffs.push(update_diff);


                var delete_diff_simulated = new DeleteDiff(new Path('^[1].abc.d.e[1]'));
                var insert_diff_simulated = new InsertIntoArrayDiff(new Path('^[1].abc.d.e[1]'), json);

                var simulated_diffs = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                _.forIn(simulated_diffs, function(value, path) {
                    //for (var i = 0; i < simulated_array.length; i++) {

                    _.forIn(simulated_diffs[path], function(inner_value, op) {
                        simulated_diff = simulated_diffs[path][op].diff;
                        if(simulated_diff instanceof DeleteDiff) {
                            if (_.isEqual(simulated_diff.getTarget().string, '^[1].abc.d.e[1]')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff_simulated)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds4);
                            }
                            else if (_.isEqual(simulated_diff.getTarget().string, '^[2]')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds1);
                            }
                            else {
                                expect(true).toBe(false);
                            }


                        }
                        else if (simulated_diff instanceof AppendDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, append_diff)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature.op).toBe(ds2.op);
                            expect(simulated_diffs[path][op].diff_signature.path_signature.string).toBe(ds2.path_signature.string);

                        }
                        else if (simulated_diff instanceof InsertIntoArrayDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, insert_diff_simulated)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature).toBe(ds5);
                        }
                        else {
                            expect(true).toBe(false);
                        }
                    });

                });
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });


            it('when simulation with siblings is and subsumption required - using tuples', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures and delta functions
                var diff_signature_and_delta_func_combo_list = [];
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e.*.hcig')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e.*.hcig')),
                    delta_function: f});
                //diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new Path('^[*].abc.d.e')),
                //    delta_function: f});

                //var ds3 = new DiffSignature(Op.UPDATE, new Path('^[*].abc.d.e[*]'));
                //diff_signature_and_delta_func_combo_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e.*'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds4, delta_function: f});

                var ds5 = new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds5, delta_function: f});

                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});


                var visual_state = [];
                visual_state[0] = {attribute : 'value'};
                visual_state[1] = {attribute : 'value'};
                visual_state[1].abc = {};
                visual_state[1].abc.delete = {'delete': 'me'};
                visual_state[1].abc.d = {};
                visual_state[1].abc.d.e = {};
                visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth0.fg = {};
                visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth0.something = {};
                visual_state[1].abc.d.e.sth0.something.else = 'something else';
                visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                visual_state[1].abc.d.e.sth1 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth1.fg = {};
                visual_state[1].abc.d.e.sth1.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth1.something = {};
                visual_state[1].abc.d.e.sth1.something.else = 'something else';
                visual_state[1].abc.d.e.sth1.something.else2 = 'something else 2';
                visual_state[2] = {attribute : 'value'};
                visual_state[2].abc = {};
                visual_state[2].abc.delete = {'delete': 'me'};
                visual_state[2].abc.d = {};
                visual_state[2].abc.d.e = {};
                visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[3] = {attribute : 'value'};
                visual_state[3].abc = {};
                visual_state[3].abc.delete = {'delete': 'me'};
                visual_state[3].abc.d = {};
                visual_state[3].abc.d.e = {};
                visual_state[3].abc.d.e.sth0 = {'val1' : 'value1'};

                var json = generatePayload(0);

                var final_visual_state = [];
                final_visual_state[0] = {attribute : 'value'};
                final_visual_state[1] = {attribute : 'value'};
                final_visual_state[1].abc = {};
                final_visual_state[1].abc.delete = {'delete': 'me'};
                final_visual_state[1].abc.d = {};
                final_visual_state[1].abc.d.e = {};
                final_visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                final_visual_state[1].abc.d.e.sth0.fg = {};
                final_visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                final_visual_state[1].abc.d.e.sth0.something = {};
                final_visual_state[1].abc.d.e.sth0.something.else = 'something else';
                final_visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                final_visual_state[1].abc.d.e.sth1 = json;
                final_visual_state[2] = {attribute : 'value'};
                final_visual_state[2].abc = {};
                final_visual_state[2].abc.delete = {'delete': 'me'};
                final_visual_state[2].abc.d = {};
                final_visual_state[2].abc.d.e = {};
                final_visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);


                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^[2]'));
                diffs.push(delete_diff);
                //var append_diff = new AppendDiff(new Path('^[1].abc.d.e'), json);
                //diffs.push(append_diff);
                var update_diff = new UpdateDiff(new Path('^[1].abc.d.e.sth1'), json);
                diffs.push(update_diff);


                var delete_diff_simulated = new DeleteDiff(new Path('^[1].abc.d.e.sth1'));
                var insert_diff_simulated = new InsertIntoTupleDiff(new Path('^[1].abc.d.e'), 'sth1', json);

                var simulated_diffs = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                _.forIn(simulated_diffs, function(value, path) {
                    //for (var i = 0; i < simulated_array.length; i++) {

                    _.forIn(simulated_diffs[path], function(inner_value, op) {
                        simulated_diff = simulated_diffs[path][op].diff;
                        if(simulated_diff instanceof DeleteDiff) {
                            if (_.isEqual(simulated_diff.getTarget().string, '^[1].abc.d.e.sth1')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff_simulated)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds4);
                            }
                            else if (_.isEqual(simulated_diff.getTarget().string, '^[2]')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds1);
                            }
                            else {
                                expect(true).toBe(false);
                            }


                        }

                        else if (simulated_diff instanceof InsertIntoTupleDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, insert_diff_simulated)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature).toBe(ds5);
                        }
                        else {
                            expect(true).toBe(false);
                        }
                    });

                });
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });


            it('when simulation with siblings is and subsumption check is required but no subsumption occurs - using tuples', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures and delta functions
                var diff_signature_and_delta_func_combo_list = [];
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*]'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e.*.hcig')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e.*.hcig')),
                    delta_function: f});
                //diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e')),
                //    delta_function: f});

                //var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^[*].abc.d.e[*]'));
                //diff_signature_and_delta_func_combo_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds4, delta_function: f});

                var ds5 = new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds5, delta_function: f});

                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});


                var visual_state = [];
                visual_state[0] = {attribute : 'value'};
                visual_state[1] = {attribute : 'value'};
                visual_state[1].abc = {};
                visual_state[1].abc.delete = {'delete': 'me'};
                visual_state[1].abc.d = {};
                visual_state[1].abc.d.e = {};
                visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth0.fg = {};
                visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth0.something = {};
                visual_state[1].abc.d.e.sth0.something.else = 'something else';
                visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                visual_state[1].abc.d.e.sth1 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth1.fg = {};
                visual_state[1].abc.d.e.sth1.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth1.something = {};
                visual_state[1].abc.d.e.sth1.something.else = 'something else';
                visual_state[1].abc.d.e.sth1.something.else2 = 'something else 2';
                visual_state[2] = {attribute : 'value'};
                visual_state[2].abc = {};
                visual_state[2].abc.delete = {'delete': 'me'};
                visual_state[2].abc.d = {};
                visual_state[2].abc.d.e = {};
                visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[3] = {attribute : 'value'};
                visual_state[3].abc = {};
                visual_state[3].abc.delete = {'delete': 'me'};
                visual_state[3].abc.d = {};
                visual_state[3].abc.d.e = {};
                visual_state[3].abc.d.e.sth0 = {'val1' : 'value1'};

                var json = generatePayload(0);

                var final_visual_state = [];
                final_visual_state[0] = {attribute : 'value'};
                final_visual_state[1] = {attribute : 'value'};
                final_visual_state[1].abc = {};
                final_visual_state[1].abc.delete = {'delete': 'me'};
                final_visual_state[1].abc.d = {};
                final_visual_state[1].abc.d.e = {};
                final_visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                final_visual_state[1].abc.d.e.sth0.fg = {};
                final_visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                final_visual_state[1].abc.d.e.sth0.something = {};
                final_visual_state[1].abc.d.e.sth0.something.else = 'something else';
                final_visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                final_visual_state[1].abc.d.e.sth1 = json;
                final_visual_state[2] = {attribute : 'value'};
                final_visual_state[2].abc = {};
                final_visual_state[2].abc.delete = {'delete': 'me'};
                final_visual_state[2].abc.d = {};
                final_visual_state[2].abc.d.e = {};
                final_visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);


                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^[2]'));
                diffs.push(delete_diff);
                //var append_diff = new AppendDiff(new Path('^[1].abc.d.e'), json);
                //diffs.push(append_diff);
                var update_diff = new UpdateDiff(new Path('^[1].abc.d.e.sth1'), json);
                diffs.push(update_diff);


                var delete_diff_simulated = new DeleteDiff(new Path('^[1].abc.d.e'));
                var insert_diff_simulated = new InsertIntoTupleDiff(new Path('^[1].abc.d'), 'e', final_visual_state[1].abc.d.e);

                var simulated_diffs = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                _.forIn(simulated_diffs, function(value, path) {
                    //for (var i = 0; i < simulated_array.length; i++) {

                    _.forIn(simulated_diffs[path], function(inner_value, op) {
                        simulated_diff = simulated_diffs[path][op].diff;
                        if(simulated_diff instanceof DeleteDiff) {
                            if (_.isEqual(simulated_diff.getTarget().string, '^[1].abc.d.e')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff_simulated)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds4);
                            }
                            else if (_.isEqual(simulated_diff.getTarget().string, '^[2]')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds1);
                            }
                            else {
                                expect(true).toBe(false);
                            }
                        }
                        else if (simulated_diff instanceof InsertIntoTupleDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, insert_diff_simulated)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature).toBe(ds5);
                        }
                        else {
                            expect(true).toBe(false);
                        }
                    });

                });
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });


            it('when simulation with siblings is and subsumption check is required and subsumption occurs (WITH DELETE-INSERT) - using tuples', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures and delta functions
                var diff_signature_and_delta_func_combo_list = [];
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e.*.hcig'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e.*.hcig')),
                    delta_function: f});
                //diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e.*.hcig')),
                //    delta_function: f});
                //diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e')),
                //    delta_function: f});

                //var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^[*].abc.d.e[*]'));
                //diff_signature_and_delta_func_combo_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds4, delta_function: f});

                var ds5 = new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds5, delta_function: f});

                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});


                var visual_state = [];
                visual_state[0] = {attribute : 'value'};
                visual_state[1] = {attribute : 'value'};
                visual_state[1].abc = {};
                visual_state[1].abc.delete = {'delete': 'me'};
                visual_state[1].abc.d = {};
                visual_state[1].abc.d.e = {};
                visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth0.fg = {};
                visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth0.something = {};
                visual_state[1].abc.d.e.sth0.something.else = 'something else';
                visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                visual_state[1].abc.d.e.sth1 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth1.fg = {};
                visual_state[1].abc.d.e.sth1.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth1.something = {};
                visual_state[1].abc.d.e.sth1.something.else = 'something else';
                visual_state[1].abc.d.e.sth1.something.else2 = 'something else 2';
                visual_state[1].abc.d.e.sth1.hcig = {subsumed: 'it will be'};
                visual_state[2] = {attribute : 'value'};
                visual_state[2].abc = {};
                visual_state[2].abc.delete = {'delete': 'me'};
                visual_state[2].abc.d = {};
                visual_state[2].abc.d.e = {};
                visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[3] = {attribute : 'value'};
                visual_state[3].abc = {};
                visual_state[3].abc.delete = {'delete': 'me'};
                visual_state[3].abc.d = {};
                visual_state[3].abc.d.e = {};
                visual_state[3].abc.d.e.sth0 = {'val1' : 'value1'};

                var json = generatePayload(0);

                var final_visual_state = [];
                final_visual_state[0] = {attribute : 'value'};
                final_visual_state[1] = {attribute : 'value'};
                final_visual_state[1].abc = {};
                final_visual_state[1].abc.delete = {'delete': 'me'};
                final_visual_state[1].abc.d = {};
                final_visual_state[1].abc.d.e = {};
                final_visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                final_visual_state[1].abc.d.e.sth0.fg = {};
                final_visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                final_visual_state[1].abc.d.e.sth0.something = {};
                final_visual_state[1].abc.d.e.sth0.something.else = 'something else';
                final_visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                final_visual_state[1].abc.d.e.sth1 = json;
                final_visual_state[2] = {attribute : 'value'};
                final_visual_state[2].abc = {};
                final_visual_state[2].abc.delete = {'delete': 'me'};
                final_visual_state[2].abc.d = {};
                final_visual_state[2].abc.d.e = {};
                final_visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};
                final_visual_state[3] = {attribute : 'value'};
                final_visual_state[3].abc = {};
                final_visual_state[3].abc.delete = {'delete': 'me'};
                final_visual_state[3].abc.d = {};
                final_visual_state[3].abc.d.e = {};
                final_visual_state[3].abc.d.e.sth0 = {'val1' : 'value1'};

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);


                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^[1].abc.d.e.sth1.hcig'));
                diffs.push(delete_diff);
                //var append_diff = new AppendDiff(new Path('^[1].abc.d.e'), json);
                //diffs.push(append_diff);
                var update_diff = new UpdateDiff(new Path('^[1].abc.d.e.sth1'), json);
                diffs.push(update_diff);


                var delete_diff_simulated = new DeleteDiff(new Path('^[1].abc.d.e'));
                var insert_diff_simulated = new InsertIntoTupleDiff(new Path('^[1].abc.d'), 'e', final_visual_state[1].abc.d.e);

                var simulated_diffs = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                _.forIn(simulated_diffs, function(value, path) {
                    //for (var i = 0; i < simulated_array.length; i++) {

                    _.forIn(simulated_diffs[path], function(inner_value, op) {
                        simulated_diff = simulated_diffs[path][op].diff;
                        if(simulated_diff instanceof DeleteDiff) {
                            if (_.isEqual(simulated_diff.getTarget().string, '^[1].abc.d.e')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, delete_diff_simulated)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds4);
                            }
                            else {
                                expect(true).toBe(false);
                            }
                        }
                        else if (simulated_diff instanceof InsertIntoTupleDiff) {

                            // the simulated diff has to be equal to the original one.
                            expect(_.isEqual(simulated_diff, insert_diff_simulated)).toBe(true);

                            // the delta functions have to be equal
                            expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                            // diff signatures should match
                            expect(simulated_diffs[path][op].diff_signature).toBe(ds5);
                        }
                        else {
                            expect(true).toBe(false);
                        }
                    });

                });
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });



            it('when simulation with siblings is and subsumption check is required and subsumption occurs (WITH UPDATE) - using tuples', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures and delta functions
                var diff_signature_and_delta_func_combo_list = [];
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e.*.hcig'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e.*.hcig')),
                    delta_function: f});
                //diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.DELETE, new Path('^[*].abc.d.e.*.hcig')),
                //    delta_function: f});
                //diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new Path('^[*].abc.d.e')),
                //    delta_function: f});

                //var ds3 = new DiffSignature(Op.UPDATE, new Path('^[*].abc.d.e[*]'));
                //diff_signature_and_delta_func_combo_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.UPDATE, new PathSignature('^[*].abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature: ds4, delta_function: f});


                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_and_delta_func_combo_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});


                var visual_state = [];
                visual_state[0] = {attribute : 'value'};
                visual_state[1] = {attribute : 'value'};
                visual_state[1].abc = {};
                visual_state[1].abc.delete = {'delete': 'me'};
                visual_state[1].abc.d = {};
                visual_state[1].abc.d.e = {};
                visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth0.fg = {};
                visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth0.something = {};
                visual_state[1].abc.d.e.sth0.something.else = 'something else';
                visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                visual_state[1].abc.d.e.sth1 = {'val1' : 'value1'};
                visual_state[1].abc.d.e.sth1.fg = {};
                visual_state[1].abc.d.e.sth1.fg.hcig = {val:'value2'};
                visual_state[1].abc.d.e.sth1.something = {};
                visual_state[1].abc.d.e.sth1.something.else = 'something else';
                visual_state[1].abc.d.e.sth1.something.else2 = 'something else 2';
                visual_state[1].abc.d.e.sth1.hcig = {subsumed: 'it will be'};
                visual_state[2] = {attribute : 'value'};
                visual_state[2].abc = {};
                visual_state[2].abc.delete = {'delete': 'me'};
                visual_state[2].abc.d = {};
                visual_state[2].abc.d.e = {};
                visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};
                visual_state[3] = {attribute : 'value'};
                visual_state[3].abc = {};
                visual_state[3].abc.delete = {'delete': 'me'};
                visual_state[3].abc.d = {};
                visual_state[3].abc.d.e = {};
                visual_state[3].abc.d.e.sth0 = {'val1' : 'value1'};

                var json = generatePayload(0);

                var final_visual_state = [];
                final_visual_state[0] = {attribute : 'value'};
                final_visual_state[1] = {attribute : 'value'};
                final_visual_state[1].abc = {};
                final_visual_state[1].abc.delete = {'delete': 'me'};
                final_visual_state[1].abc.d = {};
                final_visual_state[1].abc.d.e = {};
                final_visual_state[1].abc.d.e.sth0 = {'val1' : 'value1'};
                final_visual_state[1].abc.d.e.sth0.fg = {};
                final_visual_state[1].abc.d.e.sth0.fg.hcig = {val:'value2'};
                final_visual_state[1].abc.d.e.sth0.something = {};
                final_visual_state[1].abc.d.e.sth0.something.else = 'something else';
                final_visual_state[1].abc.d.e.sth0.something.else2 = 'something else 2';
                final_visual_state[1].abc.d.e.sth1 = json;
                final_visual_state[2] = {attribute : 'value'};
                final_visual_state[2].abc = {};
                final_visual_state[2].abc.delete = {'delete': 'me'};
                final_visual_state[2].abc.d = {};
                final_visual_state[2].abc.d.e = {};
                final_visual_state[2].abc.d.e.sth0 = {'val1' : 'value1'};
                final_visual_state[3] = {attribute : 'value'};
                final_visual_state[3].abc = {};
                final_visual_state[3].abc.delete = {'delete': 'me'};
                final_visual_state[3].abc.d = {};
                final_visual_state[3].abc.d.e = {};
                final_visual_state[3].abc.d.e.sth0 = {'val1' : 'value1'};

                var diff_simulator = new DiffSimulator(diff_signature_and_delta_func_combo_list, visual_state);


                var diffs = [];
                var delete_diff = new DeleteDiff(new Path('^[1].abc.d.e.sth1.hcig'));
                diffs.push(delete_diff);
                //var append_diff = new AppendDiff(new Path('^[1].abc.d.e'), json);
                //diffs.push(append_diff);
                var update_diff = new UpdateDiff(new Path('^[1].abc.d.e.sth1'), json);
                diffs.push(update_diff);


                var update_diff_simulated = new UpdateDiff(new Path('^[1].abc.d.e'), final_visual_state[1].abc.d.e);

                var simulated_diffs = diff_simulator.simulateAll(diffs);

                var simulated_diff = null;
                _.forIn(simulated_diffs, function(value, path) {
                    //for (var i = 0; i < simulated_array.length; i++) {

                    _.forIn(simulated_diffs[path], function(inner_value, op) {
                        simulated_diff = simulated_diffs[path][op].diff;
                        if(simulated_diff instanceof UpdateDiff) {
                            if (_.isEqual(simulated_diff.getTarget().string, '^[1].abc.d.e')) {
                                // the simulated diff has to be equal to the original one.
                                expect(_.isEqual(simulated_diff, update_diff_simulated)).toBe(true);

                                // the delta functions have to be equal
                                expect(_.isEqual(f, simulated_diffs[path][op].delta_function)).toBe(true);

                                // diff signatures should match
                                expect(simulated_diffs[path][op].diff_signature).toBe(ds4);
                            }
                            else {
                                expect(true).toBe(false);
                            }
                        }
                        else {
                            expect(true).toBe(false);
                        }
                    });

                });
                expect(_.isEqual(diff_simulator.ipt.partial_value, final_visual_state)).toBe(true);

            });


        });

        function generatePayload(choice) {
            var json;
            if (choice === 0){
                json = {'menu': {
                    'id': 'file',
                    'value': 'File',
                    'popup': {
                        'menuitem': [
                            {'value': 'New', 'onclick': 'CreateNewDoc()'},
                            {'value': 'Open', 'onclick': 'OpenDoc()'},
                            {'value': 'Close', 'onclick': 'CloseDoc()'}
                        ]
                    }
                }};
            }
            else if (choice === 1) {
                json = {'menu': {
                    'id': 'file',
                    'value': 'File',
                    'popup': {
                        'menuitem': [
                            {'value': 'New', 'onclick': 'CreateNewDoc()'},
                            {'value': 'Open', 'onclick': 'OpenDoc()'},
                            {'value': 'Close', 'onclick': 'CloseDoc()'}
                        ],
                        'extra' : 'field'
                    }
                }};
            }
            else if (choice === 2) {
                json = {'menu': {
                    'id': 'file',
                    'value': 'File',
                    'popup': {
                        'menuitem': [
                            {'value': 'New', 'onclick': 'CreateNewDoc()'},
                            {'value': 'Open', 'onclick': 'OpenDoc()'},
                            {'value': 'Close', 'onclick': 'CloseDoc()'}
                        ],
                        'extra' : 'field',
                        'menu': {
                            'id': 'file',
                            'value': 'File',
                            'popup': {
                                'menuitem': [
                                    {'value': 'New', 'onclick': 'CreateNewDoc()'},
                                    {'value': 'Open', 'onclick': 'OpenDoc()'},
                                    {'value': 'Close', 'onclick': 'CloseDoc()'}
                                ]

                            }
                        }
                    }
                }};
            }
            else if (choice === 3) {
                json = {'menu': {
                    'id': 'file',
                    'value': 'File',
                    'popup': {
                        'menuitem': [
                            {'value': 'New', 'onclick': 'CreateNewDoc()'},
                            {'value': 'Open', 'onclick': 'OpenDoc()'},
                            {'value': 'Close', 'onclick': 'CloseDoc()'}
                        ],
                        'menu': {
                            'id': 'file',
                            'value': 'File',
                            'popup': {
                                'menuitem': [
                                    {'value': 'New', 'onclick': 'CreateNewDoc()'},
                                    {'value': 'Open', 'onclick': 'OpenDoc()'},
                                    {'value': 'Close', 'onclick': 'CloseDoc()'}
                                ]

                            }
                        },
                        'extra' : 'field'
                    }
                }};
            }
            return json;
        }
    }
);