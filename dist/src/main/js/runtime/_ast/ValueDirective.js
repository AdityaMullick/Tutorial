define(
    /* Class name */
    'main/runtime/_ast/ValueDirective',

    /* Class dependencies */
    ['main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (assert, lodash, Directive) {

        'use strict';

        /**
         * @class A value directive.
         *
         * @param {!string} contents - the contents.
         */
        function ValueDirective(contents) {

            assert(lodash.isString(contents) || lodash.isNumber(contents) || lodash.isPlainObject(contents));

            if (lodash.isNumber(contents)) {
                contents = contents;//.toString();
            }

            /* Super constructor */
            Directive.call(this);

            /**
             * The contents.
             *
             * @public
             * @type {!string}
             */
            this.contents = contents;
        }

        /* Super class */
        ValueDirective.prototype = new Directive();

        ValueDirective.prototype.shallowClone = function() {
            var clone_directive = new ValueDirective(this.contents);
            return clone_directive
        };

        return ValueDirective;
    }
);