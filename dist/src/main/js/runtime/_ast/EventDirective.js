define(
    /* Class name */
    'main/runtime/_ast/EventDirective',

    /* Class dependencies */
    ['main/api/diff/Diff', 'main/util/assert', 'lodash', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (Diff, assert, lodash, Directive) {

        'use strict';

        /**
         * @class For directive constructor
         *
         */
        function EventDirective(eventName, actionName) {

            /* Super constructor */
            Directive.call(this);


            assert(lodash.isString(eventName));
            assert(actionName instanceof Function);




            /**
             * The event name
             *
             * @public
             *
             * @type {!string}
             */
            this.eventName = eventName;

            /**
             * Array of children
             *
             * @public
             * @type {!Array}
             */
            this.children = [];


            /**
             * The action. The faction that will get triggered when the event occurs.
             *
             * @public
             * @type {!Function}
             */
            this.actionName = actionName;

        }

        /* Super class */
        EventDirective.prototype = new Directive();

        /**
         * Adds a child node to the directive
         * @param {!Directive} child    - The child that will be added
         */
        EventDirective.prototype.addChild = function (child) {
            assert(child instanceof Directive);
            this.children.push(child);
        };

        /**
         * Generates a clone of the current directive.
         * @returns {EventDirective}
         */
        EventDirective.prototype.shallowClone = function() {
            var clone_directive = new EventDirective(this.eventName, this.actionName);
            return clone_directive;
        };




        return EventDirective;
    }
);