define(
    /* Class name */
    'main/api/diff/InsertHtmlDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/HtmlPath', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, HtmlPath, Op) {

        'use strict';


        /**
         * @class An insert HTML class.
         *
         * @param {!Path} target        - The target.
         * @param {!object} payload     - The payload.
         * @constructor
         */

        function InsertHtmlDiff(target, payload){
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');
            assert(target instanceof HtmlPath, 'Target must be a path');


            Diff.call(this, Op.INSERT_HTML, target);
            this.payload = payload;
        }


        /* Super class */
        InsertHtmlDiff.prototype = new Diff();


        /**
         * Returns the payload.
         *
         * @returns {!Object} - the payload
         */
        InsertHtmlDiff.prototype.getPayload = function(){
            return this.payload;
        };

        return InsertHtmlDiff;

    }
);