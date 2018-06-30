define(
    /* Class name */
    'main/runtime/_ast/Directive',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert'],

    /* Class symbols */
    function (Diff, assert) {

        'use strict';

        /**
         * @abstract
         * @class A directive.
         */
        function Directive() {

        }

        Directive.prototype.match = function (diff) {
            assert(diff instanceof Diff);
            return null;
        };

        Directive.prototype.accept = function (visitor, parent) {
            new visitor().visit(this, parent);
        };


        return Directive;
    }
);