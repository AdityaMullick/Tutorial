define(
    /* Class name */
    'test/api/path/TestPathStep',

    /* Class dependencies */
    ['main/api/path/PathStep', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav', 'main/api/path/ArrayStar'],

    /* Class symbols */
    function (PathStep, Root, TupleNav, TupleStar, ArrayNav, ArrayStar) {

        'use strict';

        describe('A path step', function () {

            it('can be a root step', function () {
                var p = new Root();
                expect(p.string).toBe('^');
            });

            it('cannot be an invalid root step', function () {
                expect(function() { return new Root(123); }).toThrow();
            });

            it('can be a tuple nav step', function () {
                var p = new TupleNav('abc');
                expect(p.string).toBe('abc');
                expect(p.attribute).toBe('abc');
            });


            it('cannot be an invalid tuple nav step', function () {
                expect(function() { return new TupleNav(123); }).toThrow();
            });

            it('can be a tuple star step', function () {
                var p = new TupleStar();
                expect(p.string).toBe('.*');
            });

            it('cannot be an invalid tuple star step', function () {
                expect(function() { return new TupleStar(123); }).toThrow();
            });

            it('can be an array nav step', function () {
                var p = new ArrayNav(123);
                expect(p.string).toBe('[123]');
                expect(p.position).toBe(123);
            });

            it('cannot be an invalid array nav step', function () {
                expect(function() { return new ArrayNav('abc'); }).toThrow();
            });

            it('can be an array star step', function () {
                var p = new ArrayStar();
                expect(p.string).toBe('[*]');
            });

            it('cannot be an invalid array star step', function () {
                expect(function() { return new ArrayStar(123); }).toThrow();
            });

            it('supports equality comparisons', function () {
                expect((new Root()).equals(new Root())).toBe(true);
                expect((new TupleNav('abc')).equals(new TupleNav('abc'))).toBe(true);
                expect((new TupleStar()).equals(new TupleStar())).toBe(true);
                expect((new ArrayNav(123)).equals(new ArrayNav(123))).toBe(true);
                expect((new ArrayStar()).equals(new ArrayStar())).toBe(true);

                expect((new Root()).equals(new TupleStar())).toBe(false);
                expect((new TupleStar()).equals(new ArrayStar())).toBe(false);
                expect((new TupleNav('abc')).equals(new TupleNav('def'))).toBe(false);
                expect((new ArrayNav(123)).equals(new ArrayNav(456))).toBe(false);
            });

            it('supports match comparisons', function () {
                expect((new Root()).matches(new Root())).toBe(true);
                expect((new TupleNav('abc')).matches(new TupleNav('abc'))).toBe(true);
                expect((new TupleStar()).matches(new TupleNav('abc'))).toBe(true);
                expect((new TupleStar()).matches(new TupleStar())).toBe(true);
                expect((new ArrayNav(123)).matches(new ArrayNav(123))).toBe(true);
                expect((new ArrayStar()).matches(new ArrayNav(123))).toBe(true);
                expect((new ArrayStar()).matches(new ArrayStar())).toBe(true);

                expect((new Root()).matches(new TupleStar())).toBe(false);
                expect((new TupleStar()).matches(new ArrayStar())).toBe(false);
                expect((new TupleNav('abc')).matches(new TupleNav('def'))).toBe(false);
                expect((new ArrayNav(123)).matches(new ArrayNav(456))).toBe(false);
                expect((new TupleNav('abc')).matches(new TupleStar())).toBe(false);
                expect((new ArrayNav(123)).matches(new ArrayStar())).toBe(false);
            });
        });
    }
);