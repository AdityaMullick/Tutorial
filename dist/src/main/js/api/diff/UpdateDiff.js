define(
    /* Class name */
    'main/api/diff/UpdateDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/Path', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, Path, Op) {

        'use strict';


        /**
         * @class An update diff class.
         *
         * @param{!Path} target        - The target.
         * @param {!object} payload    - The payload.
         *
         * @constructor
         */

        function UpdateDiff(target, payload){
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');
            assert(target instanceof Path, 'Target must be a path');


            Diff.call(this, Op.UPDATE, target);

            /**
             * @private
             * @type {!Object}
             */
            this.payload = payload;
        }

        /* Super class */
        UpdateDiff.prototype = new Diff();

        /**
         * Returns the payload.
         *
         * @returns {!Object} - the payload
         */
        UpdateDiff.prototype.getPayload = function(){
            return this.payload;
        };

        return UpdateDiff;

    }
);