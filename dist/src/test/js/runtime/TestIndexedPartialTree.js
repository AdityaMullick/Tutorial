
define(
    /* Class name */
    'test/runtime/TestIndexedPartialTree',

    /* Class dependencies */
    ['main/api/diff/Path', 'lodash', 'main/runtime/IndexedPartialTree'],

    /* Class symbols */
    function (Path, _, IndexedPartialTree) {

        'use strict';


        describe('A structural tree', function () {


            it('is equal to another if they got generated using the same json value', function () {
                // generates 2 trees from the same json
                var t = generateFixedTreeStructure(0);
                var t2 = generateFixedTreeStructure(0);


                // the two nodes should be equal
                expect(t.equals(t2)).toBe(true);
            });


            it('is not equal to another if they got generated using different json values', function () {
                // generates 2 trees from the same json
                var t = generateFixedTreeStructure(0);
                var t2 = generateFixedTreeStructure(1);


                // the two nodes should be equal
                expect(t.equals(t2)).not.toBe(true);
            });

            it('is equal to another if they got generated using the same json values but with their attributes in a different order', function () {
                // generates 2 trees from the same json
                var t = generateFixedTreeStructure(2);
                var t2 = generateFixedTreeStructure(3);

                // the two structural trees should be equal
                expect(t.equals(t2)).toBe(true);
            });


            it('can be generated from JSON that contains primitives', function () {

                var json = {'menu': {
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

                expect(function(){
                    // Structural tree
                    var t = new IndexedPartialTree(json);
                    return t;
                }).not.toThrow();


            });


            it('can be generated from JSON that contains objects', function () {
                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                expect(function(){
                    var t = new IndexedPartialTree(json);

                    // uncomment the following line to visualize the tree
                    // console.log(t);
                    return t;
                }).not.toThrow();


            });


            it('that was generated using primitives is equal to another structural tree that was ' +
               'generated using objects of the same type', function () {

                var json = {'menu': {
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

                var t = new IndexedPartialTree(json);

                var json2 = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                var t2 = new IndexedPartialTree(json2);

                // the two structural trees should be equal
                expect(t.equals(t2)).toBe(true);
            });


            it('can insert a scalar under a node with a specific path', function () {

                var json = {'menu': {
                    'id': String('not file'),
                    'value': String('Not File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                var t = new IndexedPartialTree(json);
                var path_str = '^.menu.popup';
                var attr = 'new_attr';
                var context_path = new Path(path_str);
                t.insertIntoTuple(context_path, attr, 'primitive_value');

                var json_final = {'menu': {
                    'id': String('not file'),
                    'value': String('Not File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ],
                        'new_attr' : 'primitive_value'
                    }
                }};
                var t_final = new IndexedPartialTree(json_final);

                expect(t.equals(t_final)).toBe(true);
            });


            it('can support insertion of a branch under a node with a specific path', function () {

                var json = {'menu': {
                    'id': String('not file'),
                    'value': String('Not File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                var t = new IndexedPartialTree(json);
                var json2 = {'batters':
                {
                    'batter':
                        [
                            { 'id': '1001', 'type': 'Regular' },
                            { 'id': '1002', 'type': 'Chocolate' },
                            { 'id': '1003', 'type': 'Blueberry' },
                            { 'id': '1004', 'type': 'Devil\'s Food' }
                        ]
                }};

                var path_str = '^.menu.popup';
                var attr = 'new_attr';
                var context_path = new Path(path_str);
                t.insertIntoTuple(context_path, attr, json2);

                var json_final = {'menu': {
                    'id': String('not file'),
                    'value': String('Not File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ],
                        'new_attr': {
                            'batters': {
                                'batter': [

                                    {'id': '1001', 'type': 'Regular'},
                                    {'id': '1002', 'type': 'Chocolate'},
                                    {'id': '1003', 'type': 'Blueberry'},
                                    {'id': '1004', 'type': 'Devil\'s Food'}
                                ]

                            }
                        }
                    }
                }};

                var t_final = new IndexedPartialTree(json_final);

                expect(t.equals(t_final)).toBe(true);

            });

            it('can insert a branch under the root node if the root node is a complex element', function () {

                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                var t = new IndexedPartialTree(json);

                var json2 = {'batters':
                {
                    'batter':
                        [
                            { 'id': '1001', 'type': 'Regular' },
                            { 'id': '1002', 'type': 'Chocolate' },
                            { 'id': '1003', 'type': 'Blueberry' },
                            { 'id': '1004', 'type': 'Devil\'s Food' }
                        ]
                }};

                var path_str = '^';
                var attr = 'new_attr';
                var context_path = new Path(path_str);
                t.insertIntoTuple(context_path, attr, json2);

                var json_final = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                },
                    'new_attr': {
                        'batters': {
                            'batter': [
                                {'id': '1001', 'type': 'Regular'},
                                {'id': '1002', 'type': 'Chocolate'},
                                {'id': '1003', 'type': 'Blueberry'},
                                {'id': '1004', 'type': 'Devil\'s Food'}
                            ]
                        }
                    }

                };

                var t_final = new IndexedPartialTree(json_final);

                expect(t.equals(t_final)).toBe(true);

            });


            it('cannot insert a branch under the root node if the root node is a primitive', function () {

                var json = 'primitive';

                var t = new IndexedPartialTree(json);

                var json2 = {'batters':
                {
                    'batter':
                        [
                            { 'id': '1001', 'type': 'Regular' },
                            { 'id': '1002', 'type': 'Chocolate' },
                            { 'id': '1003', 'type': 'Blueberry' },
                            { 'id': '1004', 'type': 'Devil\'s Food' }
                        ]
                }};

                var path_str = '^';
                var attr = 'new_attr';
                var context_path = new Path(path_str);


                expect(function(){
                    return t.insertIntoTuple(context_path, attr, json2);
                }).toThrow();

            });

            it('can support insertion of a primitive value under a node with a specific path', function () {

                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};



                var t = new IndexedPartialTree(json);
                var json2 = 'I\'m a primitive!';

                var path_str = '^.menu.popup';
                var attr = 'primitive_attr';
                var context_path = new Path(path_str);

                expect(function(){
                    return t.insertIntoTuple(context_path, attr, json2);
                }).not.toThrow();
            });


            it('cannot insert a branch as a root in an empty tree', function () {

                var t = new IndexedPartialTree(null);

                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                var path_str = '^';
                var attr = 'primitive_attr';
                var context_path = new Path(path_str);

                expect(function(){
                    t.insertIntoTuple(context_path, attr, json);
                }).toThrow();



                //var json_final = {'primitive_attr' : json};
                //var t_final = new IndexedPartialTree(json_final);
                //expect(t.equals(t_final)).toBe(true);
            });


            it('can delete a branch if the corresponding path is valid', function () {


                var t2 = generateTree();
                var path_str2 = '^.menu.popup.new_attr';
                var context_path2 = new Path(path_str2);
                t2.remove(context_path2);

                var json_final = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t_final = new IndexedPartialTree(json_final);
                expect(t2.equals(t_final)).toBe(true);

            });

            it('can\'t delete a branch if the corresponding path is not valid', function () {


                var t2 = generateTree();
                var path_str2 = '^.menu.popup.new_attr.new_attr2';
                var context_path2 = new Path(path_str2);
                expect(function(){
                    t2.remove(context_path2);

                }).toThrow();

            });

            //it('can delete the root node', function () {
            //
            //
            //    var t2 = generateTree();
            //    var path_str2 = '^';
            //    var context_path2 = new Path(path_str2);
            //    t2.remove(context_path2);
            //    var t = new IndexedPartialTree(null);
            //
            //
            //    expect(t2.equals(t)).toBe(true);
            //});

            it('can delete an array element', function () {


                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t2 = new IndexedPartialTree(json);


                var remove_path_str = '^.menu.popup.menuitem[1]';
                var remove_context_path = new Path(remove_path_str);
                t2.remove(remove_context_path);

                var json_final = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}

                        ]
                    }
                }};

                var t_final = new IndexedPartialTree(json_final);
                expect(t2.equals(t_final)).toBe(true);



            });

            it('cannot delete an array element if the index is out of the bounds of the array', function () {


                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t2 = new IndexedPartialTree(json);


                var remove_path_str = '^.menu.popup.menuitem[6]';
                var remove_context_path = new Path(remove_path_str);

                expect(function(){
                    t2.remove(remove_context_path);
                }).toThrow();




            });

            it('cannot update value with invalid path', function () {


                var t2 = generateTree();

                var json2 = {'updated1':
                {
                    'updated2':
                        [
                            { 'up': '1001', 'up2': 'Regular' },
                            { 'up': '1002', 'up2': 'Chocolate' },
                            { 'up': '1003', 'up2': 'Blueberry' },
                            { 'up': '1004', 'up2': 'Devil\'s Food' }
                        ]
                }};
                var path_str2 = '^.menu.value.new_attr.invalid.path';
                var context_path2 = new Path(path_str2);

                expect(function(){
                    t2.update(context_path2, json2);

                }).toThrow();
            });

            it('can update a value with a specified path', function () {


                var t2 = generateTree();

                var json2 = {'updated1':
                {
                    'updated2':
                        [
                            { 'up': '1001', 'up2': 'Regular' },
                            { 'up': '1002', 'up2': 'Chocolate' },
                            { 'up': '1003', 'up2': 'Blueberry' },
                            { 'up': '1004', 'up2': 'Devil\'s Food' }
                        ]
                }};
                var path_str2 = '^.menu.popup.new_attr';
                var context_path2 = new Path(path_str2);
                t2.update(context_path2, json2);

                var json_final = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ],
                        'new_attr' : {'updated1':
                        {
                            'updated2':
                                [
                                    { 'up': '1001', 'up2': 'Regular' },
                                    { 'up': '1002', 'up2': 'Chocolate' },
                                    { 'up': '1003', 'up2': 'Blueberry' },
                                    { 'up': '1004', 'up2': 'Devil\'s Food' }
                                ]
                        }}
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t_final = new IndexedPartialTree(json_final);

                expect(t2.equals(t_final)).toBe(true);


            });


            it('can update the root element with a branch', function () {

                var t2 = generateTree();
                var json2 = {'updated1':
                {
                    'updated2':
                        [
                            { 'up': '1001', 'up2': 'Regular' },
                            { 'up': '1002', 'up2': 'Chocolate' },
                            { 'up': '1003', 'up2': 'Blueberry' },
                            { 'up': '1004', 'up2': 'Devil\'s Food' }
                        ]
                }, 'second': 'element'};

                // update the root element
                var path_str2 = '^';
                var context_path2 = new Path(path_str2);
                t2.update(context_path2, json2);

                // new structural tree with the pointing to the given JSON value
                var t_final = new IndexedPartialTree(json2);

                expect(t2.equals(t_final)).toBe(true);
            });


            it('can update an array element', function () {
                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t2 = new IndexedPartialTree(json);


                var json2 = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'updated': String('value'), 'updated2': String('value2')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                var json_update = {'updated': String('value'), 'updated2': String('value2')};

                // update the root element
                var path_str2 = '^.menu.popup.menuitem[1]';
                var context_path2 = new Path(path_str2);
                t2.update(context_path2, json_update);

                // new structural tree with the pointing to the given JSON value
                var t_final = new IndexedPartialTree(json2);

                expect(t2.equals(t_final)).toBe(true);
            });


            it('can update the root element with a primitive', function () {

                var t2 = generateTree();
                var json2 = 'primitive';

                // update the root element
                var path_str2 = '^';
                var context_path2 = new Path(path_str2);
                t2.update(context_path2, json2);

                // new structural tree with the pointing to the given JSON value
                var t_final = new IndexedPartialTree(json2);

                expect(t2.equals(t_final)).toBe(true);
            });

            function generateTree(){
                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t2 = new IndexedPartialTree(json);

                var json2 = {'batters2':
                {
                    'batter2':
                        [
                            { 'id2': '1001', 'type2': 'Regular' },
                            { 'id2': '1002', 'type2': 'Chocolate' },
                            { 'id2': '1003', 'type2': 'Blueberry' },
                            { 'id2': '1004', 'type2': 'Devil\'s Food' }
                        ]
                }};

                // This is an invalid path. The structural tree does not have such a path.
                var path_str = '^.menu.popup';
                var context_path = new Path(path_str);
                t2.insertIntoTuple(context_path, 'new_attr', json2);
                return t2;
            }


            it('can\'t attach a subtree if the specific path is invalid', function () {

                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t2 = new IndexedPartialTree(json);

                var json2 = {'batters2':
                {
                    'batter2':
                        [
                            { 'id2': '1001', 'type2': 'Regular' },
                            { 'id2': '1002', 'type2': 'Chocolate' },
                            { 'id2': '1003', 'type2': 'Blueberry' },
                            { 'id2': '1004', 'type2': 'Devil\'s Food' }
                        ]
                }};

                // This is an invalid path. The structural tree does not have such a path.
                var path_str = '^.menu.value.something.invalid';
                var context_path = new Path(path_str);
                expect(function(){
                    t2.insertIntoTuple(context_path, 'new_attr', json2);
                    return t2;
                }).toThrow();


            });


            it('can append a complex object into an array', function () {

                var json = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')}
                        ]
                    }
                }};

                // new structural tree with the pointing to the given JSON value
                var t2 = new IndexedPartialTree(json);

                var json2 = {'another': 'value'};

                // This is an invalid path. The structural tree does not have such a path.
                var path_str = '^.menu.popup.menuitem';
                var context_path = new Path(path_str);
                t2.append(context_path, json2);

                var json_final = {'menu': {
                    'id': String('file'),
                    'value': String('File'),
                    'popup': {
                        'menuitem': [
                            {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                            {'value': String('Open'), 'onclick': String('OpenDoc()')},
                            {'value': String('Close'), 'onclick': String('CloseDoc()')},
                            {'another': 'value'}
                        ]
                    }
                }};

                var t_final = new IndexedPartialTree(json_final);
                expect(t2.equals(t_final)).toBe(true);

            });

        });


        it('can append a primitive into an array', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = 'primitive';

            // This is an invalid path. The structural tree does not have such a path.
            var path_str = '^.menu.popup.menuitem';
            var context_path = new Path(path_str);
            t2.append(context_path, json2);

            var json_final = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')},
                        'primitive'
                    ]
                }
            }};

            var t_final = new IndexedPartialTree(json_final);
            expect(t2.equals(t_final)).toBe(true);

        });


        it('cannot append a value to a non array object', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = 'primitive';

            // This is an invalid path. The structural tree does not have such a path.
            var path_str = '^.menu.popup';
            var context_path = new Path(path_str);

            expect(function(){
                t2.append(context_path, json2);
            }).toThrow();
        });


        it('cannot append a value to an array if the path to the array is invalid', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = 'primitive';

            // This is an invalid path. The structural tree does not have such a path.
            var path_str = '^.menu.popup.menuitem.invalid.path';
            var context_path = new Path(path_str);

            expect(function(){
                t2.append(context_path, json2);
            }).toThrow();
        });


        it('can append a value to an array that lies in the root of the structural tree', function () {

            var json = [ {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }];

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = {'added':'object'};

            // This is an invalid path. The structural tree does not have such a path.
            var path_str = '^';
            var context_path = new Path(path_str);
            t2.append(context_path, json2);

            var json_final = [ {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}

                    ]
                }

            }, {'added':'object'}];

            var t_final = new IndexedPartialTree(json_final);
            expect(t2.equals(t_final)).toBe(true);
        });


        it('can insert a complex object into an array', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = {'another': 'value'};

            var insert_at_path_str = '^.menu.popup.menuitem[1]';
            var insert_at_context_path = new Path(insert_at_path_str);
            t2.insertIntoArray(insert_at_context_path, json2);

            var json_final = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'another': 'value'},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}

                    ]
                }
            }};

            var t_final = new IndexedPartialTree(json_final);
            expect(t2.equals(t_final)).toBe(true);

        });

        it('can insert a primitive into an array', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = 'primitive';

            var insert_at_path_str = '^.menu.popup.menuitem[1]';
            var insertIntoArray_context_path = new Path(insert_at_path_str);
            t2.insertIntoArray(insertIntoArray_context_path, json2);

            var json_final = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        'primitive',
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}

                    ]
                }
            }};

            var t_final = new IndexedPartialTree(json_final);
            expect(t2.equals(t_final)).toBe(true);

        });


        it('cannot splice a value to a non array object', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = 'primitive';

            var insertIntoArray_path_str = '^.menu.popup[1]';
            var insertIntoArray_context_path = new Path(insertIntoArray_path_str);
            expect(function(){
                t2.insertIntoArray(insertIntoArray_context_path, json2);

            }).toThrow();
        });


        it('cannot insert a value to an array if the path to the array is invalid', function () {

            var json = {'menu': {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }};

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = 'primitive';

            var insertIntoArray_path_str = '^.menu.popup.menuitem.invalid.path[1]';
            var insertIntoArray_context_path = new Path(insertIntoArray_path_str);
            expect(function(){
                t2.insertIntoArray(insertIntoArray_context_path, json2);
            }).toThrow();
        });


        it('can insert a value to an array that lies in the root of the structural tree', function () {

            var json = [ {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }];

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = {'added':'object'};

            var insertIntoArray_path_str = '^[0]';
            var insertIntoArray_context_path = new Path(insertIntoArray_path_str);
            t2.insertIntoArray(insertIntoArray_context_path, json2);


            var json_final = [ {'added':'object'}, {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}

                    ]
                }

            }];

            var t_final = new IndexedPartialTree(json_final);
            t2.equals(t_final);
            expect(t2.equals(t_final)).toBe(true);
        });


        it('cannot insert a value to an array if the given position is greater than the size of the array', function () {

            var json = [ {
                'id': String('file'),
                'value': String('File'),
                'popup': {
                    'menuitem': [
                        {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                        {'value': String('Open'), 'onclick': String('OpenDoc()')},
                        {'value': String('Close'), 'onclick': String('CloseDoc()')}
                    ]
                }
            }];

            // new structural tree with the pointing to the given JSON value
            var t2 = new IndexedPartialTree(json);

            var json2 = {'added':'object'};

            var insertIntoArray_path_str = '^[5]';
            var insertIntoArray_context_path = new Path(insertIntoArray_path_str);
            expect(function(){
                // Structural tree
                return t2.insertIntoArray(insertIntoArray_context_path, json2);
            }).toThrow();
        });




        function generateFixedTreeStructure(choice) {
            var t;
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
                t = new IndexedPartialTree(json);
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
                t = new IndexedPartialTree(json);
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
                t = new IndexedPartialTree(json);
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
                t = new IndexedPartialTree(json);

            }
            return t;
        }

    });
