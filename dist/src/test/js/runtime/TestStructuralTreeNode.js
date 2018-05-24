
define(
    /* Class name */
    'test/data/TestStructuralTreeNode',

    /* Class dependencies */
    ['main/runtime/StructuralTreeNode', 'main/runtime/StructuralTree', 'main/api/diff/Path', 'lodash', 'main/util/assert'],

    /* Class symbols */
    function (StructuralTreeNode, StructuralTree, Path, _, assert) {

        'use strict';

        describe('A Structural tree node', function () {
            it('is equal to another node if they point to equal values and their parents and children are equal', function () {

                // generates 2 trees from the same json
                var t = generateFixedTreeStructure(0);
                var t2 = generateFixedTreeStructure(0);

                // the two paths point to the same node in the two trees
                var context_path = new Path('^.menu.popup');
                var context_path2 = new Path('^.menu.popup');

                // find the two nodes
                var n = t.find(context_path);
                var n2 = t2.find(context_path2);

                // the two nodes should be equal
                expect(n.equals(n2)).toBe(true);

            });

            it('is equal to another node if they point to equal values even if their paths are different', function () {

                // generates 2 trees from different json values
                var t = generateFixedTreeStructure(0);
                var t2 = generateFixedTreeStructure(2);

                // the two paths point to the same node in the two trees
                var context_path = new Path('^.menu.popup');
                var context_path2 = new Path('^.menu.popup.menu.popup');

                // find the two nodes
                var n = t.find(context_path);
                var n2 = t2.find(context_path2);

                // the two nodes should be equal
                expect(n.equals(n2)).toBe(true);

            });


            it('is equal to another node (checking equality at the root of the tree)', function () {

                // generates 2 trees from the same json
                var t = generateFixedTreeStructure(0);
                var t2 = generateFixedTreeStructure(0);

                // the two paths point to the same node in the two trees, the root node
                var context_path = new Path('^');
                var context_path2 = new Path('^');

                // find the two nodes
                var n = t.find(context_path);
                var n2 = t2.find(context_path2);

                // the two nodes should be equal
                expect(n.equals(n2)).toBe(true);

            });

        });

        it('is not equal to another node if the second node has more attributes than the first one', function () {

            // generates 2 trees from different json values
            var t = generateFixedTreeStructure(0);
            var t2 = generateFixedTreeStructure(1);

            // the two paths point to the same node in the two trees
            var context_path = new Path('^.menu.popup');
            var context_path2 = new Path('^.menu.popup');

            var n = t.find(context_path);
            var n2 = t2.find(context_path2);

            // the two nodes should be equal
            expect(n.equals(n2)).not.toBe(true);

        });

        it('is not equal to another node if the first node has more attributes than the first one', function () {

            // generates 2 trees from different json values
            var t = generateFixedTreeStructure(1);
            var t2 = generateFixedTreeStructure(0);

            // the two paths point to the same node in the two trees
            var context_path = new Path('^.menu.popup');
            var context_path2 = new Path('^.menu.popup');

            var n = t.find(context_path);
            var n2 = t2.find(context_path2);

            // the two nodes should be equal
            expect(n.equals(n2)).not.toBe(true);

        });

        /**
         * Generates a structural tree given a choice: 0-2.
         * @param {!number} choice
         * @returns {StructuralTree}
         */
        function generateFixedTreeStructure(choice) {
            assert(!(_.isNull()), 'choice cannot be null');
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
                t = new StructuralTree(json);
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
                t = new StructuralTree(json);
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
                t = new StructuralTree(json);
            }
            return t;
        }

    }
);