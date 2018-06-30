
define(
    /* Class name */
    'test/api/diff/TestDiff',

    /* Class dependencies */
    ['main/api/diff/Path', 'main/api/diff/InsertIntoTupleDiff', 'lodash', 'main/util/assert'],

    /* Class symbols */
    function (Path, InsertIntoTupleDiff, _, assert) {

        'use strict';

        describe('A diff', function () {
            it('can be identified as an insert diff if it is an instance of the corresponding class', function () {

                var json = {
                    'menu': {
                        'id': String('file'),
                        'value': String('File'),
                        'popup': {
                            'menuitem': [
                                {'value': String('New'), 'onclick': String('CreateNewDoc()')},
                                {'value': String('Open'), 'onclick': String('OpenDoc()')},
                                {'value': String('Close'), 'onclick': String('CloseDoc()')}
                            ]
                        }
                    }
                };
                var path_str = '^';
                var context_path = new Path(path_str);
                var insert_diff = new InsertIntoTupleDiff(context_path, 'string', json);


            });
        });
    }
);