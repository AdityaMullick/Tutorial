define(
    /* Class name */
    'test/api/diff/TestPath',

    /* Class dependencies */
    ['main/api/diff/Path', 'main/api/path/Root', 'main/api/path/TupleNav', 'main/api/path/TupleStar', 'main/api/path/ArrayNav', 'main/api/path/ArrayStar'],

    /* Class symbols */
    function (Path, Root, TupleNav, TupleStar, ArrayNav, ArrayStar) {

        'use strict';

        describe('A path', function () {

            it('can be constructed from a string', function () {
                var p = new Path('^.abc');
                expect(p.string).toBe('^.abc');
                expect(p.steps[0].equals(new Root())).toBe(true);
                expect(p.steps[1].equals(new TupleNav('abc'))).toBe(true);
            });

            it('can be constructed from steps', function () {
                var p = new Path([new Root(), new TupleNav('abc')]);
                expect(p.string).toBe('^.abc');
                expect(p.steps[0].equals(new Root())).toBe(true);
                expect(p.steps[1].equals(new TupleNav('abc'))).toBe(true);
            });

            it('cannot be constructed from invalid arguments', function () {
                expect(function() { return new Path(123); }).toThrowError('Path must be a string or an array of path steps');
            });

            it('can return the last step', function () {
                var p = new Path('^.abc[123]');
                expect(p.getLastStep().equals(new ArrayNav(123))).toBe(true);
            });

            it('supports equality comparisons', function () {
                var p = new Path([new Root(), new TupleNav('abc')]);
                expect(p.equals(new Path('^.abc'))).toBe(true);
            });

            it('can navigate upwards', function () {
                var p = new Path('^.abc[123]').up();
                expect(p.string).toBe('^.abc');
                expect(p.steps[0].equals(new Root())).toBe(true);
                expect(p.steps[1].equals(new TupleNav('abc'))).toBe(true);
            });

            it('cannot navigate upwards if it comprises only the root step', function () {
                expect(function() { return new Path('^').up(); }).toThrowError('Cannot navigate up from ^');
            });

            it('can be concatenated with a tuple nav step', function () {
                var p = new Path('abc').tupleNav('def');
                expect(p.string).toBe('abc.def');
                expect(p.steps[0].equals(new TupleNav('abc'))).toBe(true);
                expect(p.steps[1].equals(new TupleNav('def'))).toBe(true);
            });

            it('can be concatenated with a tuple star step', function () {
                var p = new Path('^').tupleStar();
                expect(p.string).toBe('^.*');
                expect(p.steps[0].equals(new Root())).toBe(true);
                expect(p.steps[1].equals(new TupleStar())).toBe(true);
            });

            it('can be concatenated with an array nav step', function () {
                var p = new Path('^').arrayNav(123);
                expect(p.string).toBe('^[123]');
                expect(p.steps[0].equals(new Root())).toBe(true);
                expect(p.steps[1].equals(new ArrayNav(123))).toBe(true);
            });

            it('can be concatenated with an array star step', function () {
                var p = new Path('^').arrayStar();
                expect(p.string).toBe('^[*]');
                expect(p.steps[0].equals(new Root())).toBe(true);
                expect(p.steps[1].equals(new ArrayStar())).toBe(true);
            });
        });
    }
);