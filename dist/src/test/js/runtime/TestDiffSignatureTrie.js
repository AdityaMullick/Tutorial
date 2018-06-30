define(
    /* Class name */
    'test/runtime/TestDiffSignatureTrie',

    /* Class dependencies */
    ['main/api/diff/Path', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav',
        'main/api/path/ArrayStar', 'main/api/diff/DiffSignature', 'main/api/diff/Op', 'main/runtime/DiffSignatureTrie',
        'main/api/diff/DeleteDiff', 'main/api/diff/AppendDiff', 'main/api/diff/UpdateDiff', 'lodash',
        'main/api/path/PathSignature'],

    /* Class symbols */
    function (Path, Root, TupleNav, TupleStar, ArrayNav, ArrayStar, DiffSignature, Op, DiffSignatureTrie,
              DeleteDiff, AppendDiff, UpdateDiff, _, PathSignature) {

        'use strict';

        describe('A DiffSignatureTrie', function () {

            it('can be constructed from diff signatures with paths that contain tuple navs and it ' +
            'matches the appropriate diffs', function () {

                // list of diff signatures
                var diff_signature_and_delta_func_combo_list = [];
                var f = function (diff) { return diff.toString(); };
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')), delta_function:f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^'));
                diff_signature_and_delta_func_combo_list.push({diff_signature:ds1, delta_function:f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.fg.hcig'));
                diff_signature_and_delta_func_combo_list.push({diff_signature:ds2, delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^.abc.d.e.fg.hcig')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.DELETE, new PathSignature('^.abc.d.e.fg.hcig')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e')), delta_function:f});

                var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^.abc.d.e'));
                diff_signature_and_delta_func_combo_list.push({diff_signature:ds3, delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.something.else')), delta_function:f});
                diff_signature_and_delta_func_combo_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.fg.something.else2')), delta_function:f});

                var trie = new DiffSignatureTrie(diff_signature_and_delta_func_combo_list);

                var does_match = trie.matches(new DeleteDiff(new Path('^.abc')));
                expect(does_match).toBe(null); // there is no diff signature for the path '^.abc'
                does_match = trie.matches(new DeleteDiff(new Path('^')));
                expect(does_match.diff_signature).toBe(ds1); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal

                var json = generatePayload(0);
                does_match = trie.matches(new AppendDiff(new Path('^.abc.d.e.fg.hcig'), json));
                expect(does_match.diff_signature).toBe(ds2); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true);


                does_match = trie.matches(new UpdateDiff(new Path('^.abc.d.e'), json));
                expect(does_match.diff_signature).toBe(ds3); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


            });

            it('cannot be constructed from diff signatures that refer to the same path with and without wildcards', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures
                var diff_signature_list = [];
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')), delta_function:f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^'));
                diff_signature_list.push({diff_signature:ds1, delta_function:f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.fg.hcig'));
                diff_signature_list.push({diff_signature:ds2, delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^.abc.d.e.*.hcig')), delta_function:f});

                expect(function() {return new DiffSignatureTrie(diff_signature_list); }).toThrow();

            });

            it('can be constructed from diff signatures with paths that contain tuple navs and tuple stars and it ' +
            'matches the appropriate diffs', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures
                var diff_signature_list = [];
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')), delta_function:f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^'));
                diff_signature_list.push({diff_signature:ds1, delta_function:f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.*.hcig'));
                diff_signature_list.push({diff_signature:ds2, delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^.abc.d.e.*.hcig')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.DELETE, new PathSignature('^.abc.d.e.*.hcig')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e')), delta_function:f});

                var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^.abc.d.e'));
                diff_signature_list.push({diff_signature:ds3, delta_function:f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^.abc.d.e.*'));
                diff_signature_list.push({diff_signature:ds4, delta_function:f});

                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.*.else')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.*.something.else2')), delta_function:f});

                var trie = new DiffSignatureTrie(diff_signature_list);

                var does_match = trie.matches(new DeleteDiff(new Path('^.abc')));
                expect(does_match).toBe(null); // there is no diff signature for the path '^.abc'
                does_match = trie.matches(new DeleteDiff(new Path('^')));
                expect(does_match.diff_signature).toBe(ds1); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal

                var json = generatePayload(0);
                does_match = trie.matches(new AppendDiff(new Path('^.abc.d.e.fg.hcig'), json));
                expect(does_match.diff_signature).toBe(ds2); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


                does_match = trie.matches(new UpdateDiff(new Path('^.abc.d.e'), json));
                expect(does_match.diff_signature).toBe(ds3); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal

                does_match = trie.matches(new DeleteDiff(new Path('^.abc.d.e.gggg')));
                expect(does_match.diff_signature).toBe(ds4); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


            });




            it('can be constructed from diff signatures with paths that contain array navs and it ' +
            'matches the appropriate diffs', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures
                var diff_signature_list = [];
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')), delta_function:f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[1]'));
                diff_signature_list.push({diff_signature:ds1, delta_function:f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e.fg[4].hcig'));
                diff_signature_list.push({diff_signature:ds2, delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.INSERT_INTO_TUPLE,
                    new PathSignature('^.abc.d.e.fg.hcig')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.DELETE, new PathSignature('^.abc.d.e.fg.hcig')),
                    delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e')),
                    delta_function:f});

                var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^.abc[2].d.e[1]'));
                diff_signature_list.push({diff_signature:ds3, delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND,
                    new PathSignature('^.abc.d.e.something.else')), delta_function:f});
                diff_signature_list.push({diff_signature:new DiffSignature(Op.APPEND,
                    new PathSignature('^.abc.d.e.fg.something.else2')), delta_function:f});

                var trie = new DiffSignatureTrie(diff_signature_list);

                var json = generatePayload(0);
                var does_match = trie.matches(new AppendDiff(new Path('^[1]'), json));
                expect(does_match).toBe(null); // there is no append diff signature for the path '^[1]'
                does_match = trie.matches(new DeleteDiff(new Path('^[1]')));
                expect(does_match.diff_signature).toBe(ds1); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


                does_match = trie.matches(new AppendDiff(new Path('^.abc.d.e.fg[4].hcig'), json));
                expect(does_match.diff_signature).toBe(ds2); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


                does_match = trie.matches(new UpdateDiff(new Path('^.abc[2].d.e[1]'), json));
                expect(does_match.diff_signature).toBe(ds3); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


            });

            it('cannot be constructed from diff signatures that refer to the same path with and without wildcards', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures
                var diff_signature_list = [];
                diff_signature_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')), delta_function:f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^'));
                diff_signature_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^.abc.d.e[1].hcig'));
                diff_signature_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^.abc.d.e[*].hcig')),
                    delta_function: f});

                expect(function() {return new DiffSignatureTrie(diff_signature_list); }).toThrow();

            });

            it('can be constructed from diff signatures with paths that contain tuple navs and tuple stars and it ' +
            'matches the appropriate diffs', function () {

                // The delta function
                var f = function (diff) { return diff.toString(); };

                // list of diff signatures
                var diff_signature_list = [];
                diff_signature_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^')),
                    delta_function: f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^')),
                    delta_function: f});

                var ds1 = new DiffSignature(Op.DELETE, new PathSignature('^[*]'));
                diff_signature_list.push({diff_signature: ds1, delta_function: f});

                var ds2 = new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.hcig'));
                diff_signature_list.push({diff_signature: ds2, delta_function: f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.INSERT_INTO_TUPLE, new PathSignature('^[*].abc.d.e[*].*.hcig')),
                    delta_function: f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e[*].*.hcig')),
                    delta_function: f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*]')),
                    delta_function: f});

                var ds3 = new DiffSignature(Op.UPDATE, new PathSignature('^[*].abc.d.e[*]'));
                diff_signature_list.push({diff_signature: ds3, delta_function: f});
                var ds4 = new DiffSignature(Op.DELETE, new PathSignature('^[*].abc.d.e[*]'));
                diff_signature_list.push({diff_signature: ds4, delta_function: f});

                diff_signature_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.else')),
                    delta_function: f});
                diff_signature_list.push({diff_signature: new DiffSignature(Op.APPEND, new PathSignature('^[*].abc.d.e[*].*.something.else2')),
                    delta_function: f});

                var trie = new DiffSignatureTrie(diff_signature_list);

                var does_match = trie.matches(new DeleteDiff(new Path('^.abc')));
                expect(does_match).toBe(null); // there is no diff signature for the path '^.abc'
                does_match = trie.matches(new DeleteDiff(new Path('^[2]')));
                expect(does_match.diff_signature).toBe(ds1); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal


                var json = generatePayload(0);
                does_match = trie.matches(new AppendDiff(new Path('^[1].abc.d.e[15].fg.hcig'), json));
                expect(does_match.diff_signature).toBe(ds2); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal

                does_match = trie.matches(new UpdateDiff(new Path('^[15].abc.d.e[1000]'), json));
                expect(does_match.diff_signature).toBe(ds3); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal

                does_match = trie.matches(new DeleteDiff(new Path('^[200000].abc.d.e[35000]')));
                expect(does_match.diff_signature).toBe(ds4); // there is a diff signature for the given path
                expect(_.isEqual(f, does_match.delta_function)).toBe(true); // the delta functions have to be equal

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