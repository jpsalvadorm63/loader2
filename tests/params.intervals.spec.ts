import { describe, it, expect, vi } from 'vitest';
import { reviewInterval, validIntervals, validateIntervals, intervalTable, intervalsHelp } from '../src/parameters/params.intervals.js';
import { IIntervals, NONE } from '../src/parameters/configs/params.constants.js';
import * as consoleModule from '../src/commons/console.js';

describe('params.intervals', () => {
    describe('reviewInterval', () => {
        it('should return true for a valid interval', () => {
            expect(reviewInterval('001m')).toBe(true);
            expect(reviewInterval('001h')).toBe(true);
        });

        it('should return false for an invalid interval', () => {
            expect(reviewInterval('invalid')).toBe(false);
            expect(reviewInterval('')).toBe(false);
        });
    });

    describe('validIntervals', () => {
        it('should return a comma-separated string when simple is true', () => {
            const result = validIntervals(true);
            expect(result).toBe(IIntervals.map(i => i.interval).join(', '));
        });

        it('should return an array of objects when simple is false', () => {
            const result = validIntervals(false);
            expect(result).toEqual(IIntervals.map(i => ({ nombre: i.nombre, interval: i.interval })));
        });

        it('should default to simple=true', () => {
            expect(validIntervals()).toBe(validIntervals(true));
        });
    });

    describe('validateIntervals', () => {
        it('should return true for a valid interval', () => {
            expect(validateIntervals('001m')).toBe(true);
        });

        it('should throw an error if interval is NONE', () => {
            expect(() => validateIntervals(NONE)).toThrow("No se ha especificado un intervalo");
        });

        it('should throw an error for an invalid interval', () => {
            const invalid = 'invalid_int';
            expect(() => validateIntervals(invalid)).toThrow(`El intervalo '${invalid}' no es válido. Los intervalos válidas son: ${IIntervals.map(i => i.interval).join(', ')}`);
        });
    });

    describe('intervalTable', () => {
        it('should return a Table instance', () => {
            const table = intervalTable();
            expect(table).toBeDefined();
            expect(table.push).toBeDefined();
            // Checking if all intervals are in the table
            expect(table.length).toBe(IIntervals.length);
        });
    });

    describe('intervalsHelp', () => {
        it('should call fnConsole with the help message', () => {
            const mockFnConsole = vi.fn().mockReturnValue(vi.fn());
            const spy = vi.spyOn(consoleModule, 'fnConsole').mockImplementation(mockFnConsole);

            intervalsHelp();

            expect(spy).toHaveBeenCalled();
            expect(mockFnConsole).toHaveBeenCalled();

            spy.mockRestore();
        });
    });
});
