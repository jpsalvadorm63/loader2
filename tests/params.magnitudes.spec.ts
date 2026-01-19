import {describe, it, expect, vi} from 'vitest';
import {magnitudes2array, getSimpleMagnitudes} from '../src/parameters/params.magnitudes.js';

describe('magnitudes2array(null)', () => {
    it('should show help and exit when input is null', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        expect(() => magnitudes2array(null)).toThrow('process.exit(1)');
        expect(exitSpy).toHaveBeenCalledWith(1);

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should show help and exit when input is empty string', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        expect(() => magnitudes2array('')).toThrow('process.exit(1)');
        expect(exitSpy).toHaveBeenCalledWith(1);

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should return array with single valid magnitude', () => {
        const validMags = getSimpleMagnitudes();
        if (validMags.length > 0) {
            const result = magnitudes2array(validMags[0]);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result[0]).toBe(validMags[0]);
        }
    });

    it('should return array with multiple valid magnitudes', () => {
        const validMags = getSimpleMagnitudes();
        if (validMags.length >= 2) {
            const input = `${validMags[0]},${validMags[1]}`;
            const result = magnitudes2array(input);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result).toContain(validMags[0]);
            expect(result).toContain(validMags[1]);
        }
    });

    it('should exit with error for invalid magnitude', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        expect(() => magnitudes2array('INVALID_MAG')).toThrow('process.exit(1)');
        expect(exitSpy).toHaveBeenCalledWith(1);

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should exit with error for mixed valid and invalid magnitudes', () => {
        const validMags = getSimpleMagnitudes();
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null | undefined): never => {
            throw new Error(`process.exit(${code})`);
        });

        if (validMags.length > 0) {
            const input = `${validMags[0]},INVALID_MAG`;
            expect(() => magnitudes2array(input)).toThrow('process.exit(1)');
            expect(exitSpy).toHaveBeenCalledWith(1);
        }

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should handle whitespace in magnitude list', () => {
        const validMags = getSimpleMagnitudes();
        if (validMags.length >= 2) {
            const input = `${validMags[0]} , ${validMags[1]}`;
            const result = magnitudes2array(input);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result).toContain(validMags[0]);
            expect(result).toContain(validMags[1]);
        }
    });

    it('should return all magnitudes when input is ALL', () => {
        const validMags = getSimpleMagnitudes();
        const result = magnitudes2array('ALL');
        expect(result).toEqual(validMags);
    });
});
