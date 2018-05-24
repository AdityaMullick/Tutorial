define(
    /* Class name */
    'test/api/path/TestPathParser',

    /* Class dependencies */
    ['main/api/path/PathParser', 'main/api/path/PathStep', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav', 'main/api/path/ArrayStar'],

    /* Class symbols */
    function (PathParser, PathStep, Root, TupleNav, TupleStar, ArrayNav, ArrayStar) {

        'use strict';

        describe('A path parser', function () {

            var parser = new PathParser();

            it('parses a root step', function () {
                var steps = parser.parse('^');
                expect(steps.length).toBe(1);
                expect(steps[0].equals(new Root())).toBe(true);
            });

            it('parses a tuple nav step', function () {
                var steps = parser.parse('^.abc');
                expect(steps.length).toBe(2);
                expect(steps[0].equals(new Root())).toBe(true);
                expect(steps[1].equals(new TupleNav('abc'))).toBe(true);
            });

            it('parses a tuple nav step with special characters escaped', function () {
                var steps = parser.parse('^.abc%5e%2e%2a%5b%5d%25def');
                expect(steps.length).toBe(2);
                expect(steps[0].equals(new Root())).toBe(true);
                expect(steps[1].equals(new TupleNav('abc^.*[]%def'))).toBe(true);
            });

            it('parses a tuple star step', function () {
                var steps = parser.parse('^.*');
                expect(steps.length).toBe(2);
                expect(steps[0].equals(new Root())).toBe(true);
                expect(steps[1].equals(new TupleStar())).toBe(true);
            });

            it('parses an array nav step', function () {
                var steps = parser.parse('^[123]');
                expect(steps.length).toBe(2);
                expect(steps[0].equals(new Root())).toBe(true);
                expect(steps[1].equals(new ArrayNav(123))).toBe(true);
            });

            it('parses an array star step', function () {
                var steps = parser.parse('^[*]');
                expect(steps.length).toBe(2);
                expect(steps[0].equals(new Root())).toBe(true);
                expect(steps[1].equals(new ArrayStar())).toBe(true);
            });

            it('parses a path comprising all possible types of steps', function () {
                var steps = parser.parse('^.countries[*][5].*');
                expect(steps.length).toBe(5);
                expect(steps[0].equals(new Root())).toBe(true);
                expect(steps[1].equals(new TupleNav('countries'))).toBe(true);
                expect(steps[2].equals(new ArrayStar())).toBe(true);
                expect(steps[3].equals(new ArrayNav(5))).toBe(true);
                expect(steps[4].equals(new TupleStar())).toBe(true);
            });

            it('forbids non-strings', function () {
                expect(function() { return parser.parse(123); }).toThrowError('Path must be a string');
                expect(function() { return parser.parse(null); }).toThrowError('Path must be a string');
            });


            it('forbids an invalid path with unmatched steps', function () {
                expect(function() { return parser.parse('^[*]invalid[5]'); }).toThrowError('Path is invalid at position 4');
                expect(function() { return parser.parse('^[*][5]invalid'); }).toThrowError('Path is invalid at position 7');
            });

            it('is reset after a parse failure occurs', function () {
                // Cause a parse failure
                expect(function() { return parser.parse('^[*]invalid[5]'); }).toThrowError('Path is invalid at position 4');

                // The next parse should start from a clean slate
                var steps = parser.parse('^');
                expect(steps.length).toBe(1);
                expect(steps[0].equals(new Root())).toBe(true);
            });
        });
    }
);