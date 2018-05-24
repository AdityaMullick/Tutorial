define(
    /* Class name */
    'test/api/_util/TestEnum',

    /* Class dependencies */
    ['main/api/_util/Enum'],

    /* Class symbols */
    function (Enum) {

        'use strict';

        describe('An enum', function () {

            var Color = new Enum('RED', 'GREEN', 'BLUE');

            it('is an instance of the enum class', function () {
                expect(Color.RED instanceof Color).toBe(true);
                expect(Color.GREEN instanceof Color).toBe(true);
                expect(Color.BLUE instanceof Color).toBe(true);
            });

            it('has a name', function () {
                expect(Color.RED.name).toBe('RED');
                expect(Color.GREEN.name).toBe('GREEN');
                expect(Color.BLUE.name).toBe('BLUE');
            });

            it('can be compared with === and !==', function () {
                expect(Color.RED).toBe(Color.RED);
                expect(Color.RED === Color.RED).toBe(true);
                expect(Color.RED === Color.GREEN).toBe(false);
                expect(Color.RED !== Color.RED).toBe(false);
                expect(Color.RED !== Color.GREEN).toBe(true);
            });

            it('can only be defined through Enum()', function() {
                expect(function () { return new Color('YELLOW'); }).toThrow();
            });

            it('is within the values array', function() {
                expect(Color.values[0]).toBe(Color.RED);
                expect(Color.values[1]).toBe(Color.GREEN);
                expect(Color.values[2]).toBe(Color.BLUE);
            });

        });
    }
);