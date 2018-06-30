define(
    /* Class name */
    // Lower-case indicates that only a function is exported
    'main/util/Lang',

    /* Class dependencies */
    ['lodash', 'main/util/assert', 'main/runtime/_ast/Directive'],

    /* Class symbols */
    function (_, assert, Directive) {

        'use strict';


        function Lang() {
        }

        /**
         * Checks whether the given value is null or undefined.
         *
         * @param {object} value    - the value.
         * @returns {boolean}       - true if null or undefined, false otherwise
         */
        Lang.isNullOrUndefined = function(value) {
            return (_.isNull(value) || _.isUndefined(value));
        };

        /**
         * Checks whether the given value is a tuple.
         *
         * @param {object} value    - the value
         * @returns {boolean}       - true if tuple false otherwise.
         */
        Lang.isTuple = function(value) {
            return _.isPlainObject(value);
        };

        /**
         * Checks whether the given value is an array.
         *
         * @param {object} value    - the value.
         * @returns {boolean}       - true if array false otherwise.
         */
        Lang.isArray = function(value) {
            return _.isArray(value);
        };

        /**
         * Checks whether the given value is a primitive.
         *
         * @param {object} value    - the value.
         * @returns {boolean}       - true if primitive false otherwise.
         */
        Lang.isPrimitive = function (value) {
            return !(_.isArray(value)) || !(_.isPlainObject(value));
        };

        /**
         * Checks whether the given value is a JSON++ value.
         *
         * @param {object} value    - the value.
         * @returns {boolean}       - true if JSON++ value false otherwise.
         */
        Lang.isJsonpp = function(value) {
            return _.isBoolean(value) || _.isNumber(value) || _.isString(value) || _.isPlainObject(value) || _.isArray(value) || value === null;
        };


        /**
         * Returns a clone of the given Directive object
         * @param {!Directive} object
         * @returns {{}}
         */
        Lang.clone = function(object) {
            assert(object instanceof Directive);
            var target = {};
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    target[i] = object[i];
                }
            }
            return target;
        };

        return Lang;
    }
);