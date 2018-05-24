define(
    /* Class name */
    'main/api/diff/InsertIntoTupleDiff',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/api/diff/Path', 'main/api/diff/Op'],

    /* Class symbols */
    function (Diff, assert, _, Path, Op) {

        'use strict';


        /**
         * @class An insert into tuple diff class.
         *
         * @param {!Path} target        - The target.
         * @param {!string} attribute   - The attribute that will be used for the insertion.
         * @param {!object} payload     - The payload.
         * @constructor
         */

        function InsertIntoTupleDiff(target, attribute, payload){
            assert(!(_.isNull(payload)), 'Payload must be non-null');
            assert(!(_.isUndefined(payload)), 'Payload is undefined');
            assert(_.isString(attribute), 'The attribute must be a string');
            assert(target instanceof Path, 'Target must be a path');


            Diff.call(this, Op.INSERT_INTO_TUPLE, target);
            this.attribute = attribute;
            this.payload = payload;
        }


        /* Super class */
        InsertIntoTupleDiff.prototype = new Diff();

        /**
         * Returns the attribute.
         *
         * @returns {!string}
         */
        InsertIntoTupleDiff.prototype.getAttribute = function() {
            return this.attribute;
        };


        /**
         * Returns the payload.
         *
         * @returns {!Object} - the payload
         */
        InsertIntoTupleDiff.prototype.getPayload = function(){
            return this.payload;
        };

        return InsertIntoTupleDiff;

    }
);