define(
    /* Class name */
    'main/api/_util/Encoder',

    /* Class dependencies */
    ['main/util/assert', 'lodash'],

    /* Class symbols */
    function (assert, lodash) {

        'use strict';

        /**
         * @class An encoder escapes and unescapes special characters in a string.
         *
         * @param {!object} escape_map - an escape map that maps from source special characters to target escaped characters.
         */
        function Encoder(escape_map) {

            assert(lodash.isPlainObject(escape_map));

            // The unescape map is the inverse of the escape map
            var unescape_map = lodash.invert(escape_map);
            assert(Object.keys(escape_map).length === Object.keys(unescape_map).length,
                'The targets of the escape map must be unique');

            /**
             * @private
             * @type {!RegExp}
             */
            this._escape_test_regexp = newRegExp(escape_map);

            /**
             * @private
             * @type {!RegExp}
             */
            this._escape_replace_regexp = newRegExp(escape_map, 'g');

            /**
             * @private
             * @type {!RegExp}
             */
            this._unescape_test_regexp = newRegExp(unescape_map);

            /**
             * @private
             * @type {!RegExp}
             */
            this._unescape_replace_regexp = newRegExp(unescape_map, 'g');

            /**
             * @private
             * This function closure is needed so that string.replace() below has access to escape_map
             */
            this._escapeChar = function (c) {
                return escape_map[c];
            };

            /**
             * @private
             * This function closure is needed so that string.replace() below has access to unescape_map
             */
            this._unescapeChar = function (c) {
                return unescape_map[c];
            };
        }

        /**
         * Escapes the special characters in the string.
         * @param {!string} string - the string.
         * @returns {!string} the escaped string.
         */
        Encoder.prototype.escape = function (string) {
            // Adapted from lodash.escape()
            assert(lodash.isString(string));
            if (this._escape_test_regexp.test(string)) {
                return string.replace(this._escape_replace_regexp, this._escapeChar);
            } else {
                return string;
            }
        };

        /**
         * Unescapes the escaped characters in the string.
         * @param {!string} string - the string.
         * @returns {!string} the unescaped string.
         */
        Encoder.prototype.unescape = function (string) {
            // Adapted from lodash.unescape()
            assert(lodash.isString(string));
            if (this._unescape_test_regexp.test(string)) {
                return string.replace(this._unescape_replace_regexp, this._unescapeChar);
            } else {
                return string;
            }
        };

        /**
         * Creates a new regexp for testing/replacing source characters.
         *
         * @param {!object} escape_map      - the escape map.
         * @param {string} [regexp_flags]   - the flags for the regexp. Omit for the test regexp, use 'g' for the replace regexp.
         * @returns {!RegExp} the regexp.
         */
        function newRegExp(escape_map, regexp_flags) {

            assert(lodash.isPlainObject(escape_map));
            assert(regexp_flags === undefined || regexp_flags === 'g');

            // Get the source special characters
            var sources = Object.keys(escape_map);

            // If a source character is also a RegExp special character, escape it first
            sources = lodash.map(sources, function (s) {
                return lodash.escapeRegExp(s);
            });

            // Return a RegExp that checks a disjunction of the source characters
            return new RegExp(sources.join('|'), regexp_flags);
        }

        return Encoder;
    }
);