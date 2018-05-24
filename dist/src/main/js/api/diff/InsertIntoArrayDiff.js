define(
    /* Class name */
    'main/api/diff/InsertIntoArrayDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/Path', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, Path, Op) {

        'use strict';

        /**
         * @class An insert into array diff.
         *
         * @constructor
         *
         * @param {!Path} target        - The target.
         * @param {!object} payload     - The payload.
         *
         */

        function InsertIntoArrayDiff(target, payload) {
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');
            assert(target instanceof Path, 'Target must be a path');


            /* Super constructor */
            Diff.call(this, Op.INSERT_INTO_ARRAY, target);


            /**
             * @private
             * @type {!Object}
             */
            this.payload = payload;
        }

        /* Super class */
        InsertIntoArrayDiff.prototype = new Diff();

        /**
         * Returns the payload.
         *
         * @returns {!Object} - The payload
         */
        InsertIntoArrayDiff.prototype.getPayload = function(){
            return this.payload;
        };

        return InsertIntoArrayDiff;
    }
);