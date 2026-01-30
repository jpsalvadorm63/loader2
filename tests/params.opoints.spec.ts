import {describe, it, expect, vi} from 'vitest';
import {opoints2array, getSimpleOpoints, reviewOpoint} from '../src/parameters/params.opoints.js';

describe('params.opoints', () => {
    describe('reviewOpoint', () => {
        it('should return true for a valid opoint', () => {
            const validOpoints = getSimpleOpoints();
            if (validOpoints.length > 0) {
                expect(reviewOpoint(validOpoints[0])).toBe(true);
            }
        });

        it('should return false for an invalid opoint', () => {
            expect(reviewOpoint('INVALID_OPOINT')).toBe(false);
            expect(reviewOpoint('')).toBe(false);
            expect(reviewOpoint(null)).toBe(false);
            expect(reviewOpoint(undefined)).toBe(false);
        });
    });

    describe('opoints2array', () => {
    it('should show help and exit when input is null', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        expect(() => opoints2array(null)).toThrow('process.exit(1)');
        expect(exitSpy).toHaveBeenCalledWith(1);

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should show help and exit when input is empty string', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        expect(() => opoints2array('')).toThrow('process.exit(1)');
        expect(exitSpy).toHaveBeenCalledWith(1);

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should return array with single valid opoint', () => {
        const validOpoints = getSimpleOpoints();
        if (validOpoints.length > 0) {
            const result = opoints2array(validOpoints[0]);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result[0]).toBe(validOpoints[0]);
        }
    });

    it('should return array with multiple valid opoints', () => {
        const validOpoints = getSimpleOpoints();
        if (validOpoints.length >= 2) {
            const input = `${validOpoints[0]},${validOpoints[1]}`;
            const result = opoints2array(input);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result).toContain(validOpoints[0]);
            expect(result).toContain(validOpoints[1]);
        }
    });

    it('should exit with error for invalid opoint', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        expect(() => opoints2array('INVALID_OPOINT')).toThrow('process.exit(1)');
        expect(exitSpy).toHaveBeenCalledWith(1);

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should handle whitespace in opoint list', () => {
        const validOpoints = getSimpleOpoints();
        if (validOpoints.length >= 2) {
            const input = `${validOpoints[0]} , ${validOpoints[1]}`;
            const result = opoints2array(input);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result).toContain(validOpoints[0]);
            expect(result).toContain(validOpoints[1]);
        }
    });

    it('should return all opoints when input is ALL', () => {
        const validOpoints = getSimpleOpoints();
        const result = opoints2array('ALL');
        expect(result).toEqual(validOpoints);
    });
});
});
