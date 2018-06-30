/* eslint no-new-wrappers: 0 */

define(
    /* Class name */
    'test/api/_util/TestEncoder',

    /* Class dependencies */
    ['main/api/_util/Encoder', 'main/util/assert', 'lodash'],

    /* Class symbols */
    function (Encoder, assert, lodash) {

        'use strict';

        describe('An encoder', function () {

            var escape_map = {
                '^' : '%5e',
                '.' : '%2e'
            };

            var e = new Encoder(escape_map);

            it('can escape and unescape', function () {

                // Pair 1
                expect(e.escape('^')).toBe('%5e');
                expect(e.unescape('%5e')).toBe('^');

                // Pair 2
                expect(e.escape('.')).toBe('%2e');
                expect(e.unescape('%2e')).toBe('.');

                // Combinations
                expect(e.escape('a^b.c')).toBe('a%5eb%2ec');
                expect(e.unescape('a%5eb%2ec')).toBe('a^b.c');
            });

            it('does not affect strings that have no escape sequences', function () {

                // String primitives
                expect(e.escape('abc')).toBe('abc');
                expect(e.unescape('abc')).toBe('abc');

                // Check that the identical string object is returned
                var long_string = new String('012345678901234567890');
                assert(lodash.isObject(long_string));
                expect(e.escape(long_string)).toBe(long_string);
                expect(e.unescape(long_string)).toBe(long_string);
            });

        });
    }
);