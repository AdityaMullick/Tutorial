define(
    /* Class name */
    'main/api/_util/Enum',

    /* Class dependencies */
    ['main/util/assert', 'lodash'],

    /* Class symbols */
    function (assert, lodash) {

        'use strict';

        /*
         * Adapted from:
         * https://github.com/hax/typed-enum
         */

        /**
         * Creates a new enum class.
         *
         * @returns {!Function} the enum class.
         */
        function Enum() {

            // The enum class is a function, so that instanceof works
            var enum_class = function () {
                assert(false, 'An enum class cannot be instantiated');
            };

            enum_class.values = [];

            // Create an enum object for each enum name
            lodash.forEach(arguments, function (enum_name) {

                assert(lodash.isString(enum_name));

                // Inherit from the enum class, so that instanceof works
                var enum_object = Object.create(enum_class.prototype);

                // The enum object has a name property
                Object.defineProperties(enum_object, {name: {value: enum_name}});

                // The enum object is immutable
                Object.freeze(enum_object);

                // The enum object is accessible from the enum class
                enum_class[enum_name] = enum_object;
                enum_class.values.push(enum_object);
            });

            // The enum class is immutable
            Object.freeze(enum_class);

            return enum_class;
        }

        return Enum;
    }
);