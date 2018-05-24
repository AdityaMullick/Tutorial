define(
    /* Class name */
    'test/api/activeFunction/TestSqlActiveFunction',

    /* Class dependencies */
    [ 'main/activeFunctions/Sql', 'main/api/diff/Op'
    ],

    /* Class symbols */
    function (Sql, Op) {

        'use strict';


        describe('Sql Active Function ', function () {

            it('is instantiated successfully', function() {

                var sql = new Sql();

                var result = sql.executeInitFunction();

                var delta = sql.getDeltaFunction(Op.UPDATE, 'groupby');

                delta.call(this);
                // console.log('sql', sql ,result);
            });



        });
    }
);