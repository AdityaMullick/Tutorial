define(
    /* Class name */
    'main/api/diff/Op',

    /* Class dependencies */
    ['main/api/_util/Enum'],

    /* Class symbols */
    function (Enum) {

        'use strict';

        return new Enum(
            'INSERT_INTO_ARRAY',
            'INSERT_INTO_BAG',
            'INSERT_INTO_TUPLE',
            'INSERT_HTML',
            'APPEND',
            'UPDATE',
            'DELETE',
            'CONSTRUCT',
            'DESTRUCT',
            'ATTACH',
            'DETACH'
        );
    }
);