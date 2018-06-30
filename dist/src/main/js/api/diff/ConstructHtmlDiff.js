define(
    /* Class name */
    'main/api/diff/ConstructHtmlDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'main/api/diff/HtmlPath', 'main/api/diff/Op', 'main/util/Lang'],

    /* Class symbols */
    function (Diff, assert, HtmlPath, Op, Lang) {

        'use strict';

        /**
         * @class A construct diff.
         *
         * @param {!object} payload - the payload.
         *
         * @constructor
         */

        function ConstructHtmlDiff(payload){

            //assert(Lang.isJsonpp(payload), 'Payload must be a JSON++ value');

            /* Super constructor */
            Diff.call(this, Op.CONSTRUCT, new HtmlPath('^'));

            /**
             * @private
             * @type {Jsonpp}
             */
            this._payload = payload;

        }

        /* Super class */
        ConstructHtmlDiff.prototype = new Diff();

        /**
         * Returns the payload.
         *
         * @returns {Jsonpp} - the payload
         */
        ConstructHtmlDiff.prototype.getPayload = function() {
            return this._payload;
        };

        return ConstructHtmlDiff;
    }
);