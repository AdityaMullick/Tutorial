define(
    /* Class name */
    'main/api/diff/AppendDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/Path', 'main/util/Lang', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, Path, Lang, Op) {

        'use strict';

        /**
         * @class An append diff class.
         *
         * @param {!Path} target        - The target.
         * @param {!object} payload     - The payload.
         *
         * @constructor
         */

        function AppendDiff(target, payload) {
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');

            assert(target instanceof Path, 'Target must be a path');

            Diff.call(this, Op.APPEND, target);

            /**
             * @private
             * @type {!Object}
             */
            this.payload = payload;
        }

        /* Super class */
        AppendDiff.prototype = new Diff();


        /**
         * Returns the payload.
         *
         * @returns {!Object} - The payload
         */
        AppendDiff.prototype.getPayload = function(){
            return this.payload;
        };


        return AppendDiff;

    }
);