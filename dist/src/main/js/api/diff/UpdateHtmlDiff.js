define(
    /* Class name */
    'main/api/diff/UpdateHtmlDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/HtmlPath', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, HtmlPath, Op) {

        'use strict';


        /**
         * @class An update diff class.
         *
         * @param{!Path} target        - The target.
         * @param {!object} payload    - The payload.
         *
         * @constructor
         */

        function UpdateHtmlDiff(target, payload){
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');
            assert(target instanceof HtmlPath, 'Target must be an HTML Path');


            Diff.call(this, Op.UPDATE, target);

            /**
             * @private
             * @type {!Object}
             */
            this.payload = payload;
        }

        /* Super class */
        UpdateHtmlDiff.prototype = new Diff();

        /**
         * Returns the payload.
         *
         * @returns {!Object} - the payload
         */
        UpdateHtmlDiff.prototype.getPayload = function(){
            return this.payload;
        };

        return UpdateHtmlDiff;

    }
);