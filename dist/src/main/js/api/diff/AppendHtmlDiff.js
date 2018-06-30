define(
    /* Class name */
    'main/api/diff/AppendHtmlDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/HtmlPath', 'main/util/Lang', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, HtmlPath, Lang, Op) {

        'use strict';

        /**
         * @class An append diff class.
         *
         * @param {!Path} target        - The target.
         * @param {!object} payload     - The payload.
         *
         * @constructor
         */

        function AppendHtmlDiff(target, payload) {
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');

            assert(target instanceof HtmlPath, 'Target must be an HTML Path');

            Diff.call(this, Op.APPEND, target);

            /**
             * @private
             * @type {!Object}
             */
            this.payload = payload;
        }

        /* Super class */
        AppendHtmlDiff.prototype = new Diff();


        /**
         * Returns the payload.
         *
         * @returns {!Object} - The payload
         */
        AppendHtmlDiff.prototype.getPayload = function(){
            return this.payload;
        };


        return AppendHtmlDiff;

    }
);