define(
    /* Class name */
    'main/api/diff/DiffSignature',

    /* Class dependencies */
    ['main/util/assert', 'main/api/diff/Op', 'main/api/path/PathSignature'],

    /* Class symbols */
    function (assert, Op, PathSignature) {

        'use strict';

        /**
         * @class A diff signature.
         *
         * @param {!Op}             op              - the op.
         * @param {!PathSignature}  path signature  - the path signature.
         */
        function DiffSignature(op, path_signature) {
            assert(op instanceof Op);
            assert((path_signature instanceof PathSignature) || (path_signature === null),
                'The path signature must be a Path or null (HTML case)');
            /**
             * @public
             * @type {!Op}
             */
            this.op = op;

            /**
             * @public
             * @type {!PathSignature}
             */
            this.path_signature = path_signature;
        }

        return DiffSignature;
    }
);