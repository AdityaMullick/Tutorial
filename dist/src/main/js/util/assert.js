define(
    /* Class name */
    // Lower-case indicates that only a function is exported
    'main/util/assert',

    /* Class dependencies */
    [],

    /* Class symbols */
    function () {

        'use strict';

        /**
         * Checks an assertion.
         * @param {!boolean} condition - the condition.
         * @param {string} [message] - the message.
         */
        function assert(condition, message) {

            // Assertion passes
            if (condition === true) {
                return;
            }

            // Throw the error with a stack trace
            throw new Error(message);
        }

        return assert;
    }
);