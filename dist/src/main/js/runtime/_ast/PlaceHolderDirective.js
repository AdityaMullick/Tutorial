define(
    /* Class name */
    'main/runtime/_ast/PlaceHolderDirective',

    /* Class dependencies */
    ['main/util/Lang', 'main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (util, Diff, assert, lodash, Directive) {

        'use strict';

        /**
         * @class For directive constructor
         *
         */
        function PlaceHolderDirective(placeholderID, placeholderDiv) {

            /* Super constructor */
            Directive.call(this);


            assert(!util.isNullOrUndefined(placeholderID));
            assert(!util.isNullOrUndefined(placeholderDiv));

            /**
             * The id of the placeholder
             *
             * @public
             *
             * @type {!string}
             */
            this.placeholderID = placeholderID;

            /**
             * The placeholder div
                *
                * @public
                *
                * @type {!string}
            */
            this.placeholderDiv = placeholderDiv;

        }

        /* Super class */
        PlaceHolderDirective.prototype = new Directive();

        /**
         * Generates a clone of the current directive.
         * @returns {IfDirective}
         */
        PlaceHolderDirective.prototype.shallowClone = function() {
            var clone_directive = new PlaceHolderDirective(this.placeholderID);
            return clone_directive;
        };



        return PlaceHolderDirective;
    }
);
