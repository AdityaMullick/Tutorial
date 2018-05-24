define(
    /* Class name */
    'main/api/diff/ConstructDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'main/api/diff/Path', 'main/api/diff/Op', 'main/util/Lang'],

    /* Class symbols */
    function (Diff, assert, Path, Op, Lang) {

        'use strict';

        /**
         * @class A construct diff.
         *
         * @param {Jsonpp} payload - the payload.
         */

        function ConstructDiff(payload){

            //assert(Lang.isJsonpp(payload), 'Payload must be a JSON++ value');

            /* Super constructor */
            Diff.call(this, Op.CONSTRUCT, new Path('^'));

            /**
             * @private
             * @type {Jsonpp}
             */
            this._payload = payload;

        }

        /* Super class */
        ConstructDiff.prototype = new Diff();

        /**
         * Returns the payload.
         *
         * @returns {Jsonpp} - the payload
         */
        ConstructDiff.prototype.getPayload = function() {
            return this._payload;
        };

        return ConstructDiff;
    }
);