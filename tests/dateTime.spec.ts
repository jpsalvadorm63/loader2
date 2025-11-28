import { describe, it, expect } from 'vitest';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from "dayjs";
import { computeTimeInterval, roundDateTime, str2dayjs, TimeExpression, timeFrame, timeIntervalDiff, truncDateTime } from "../src/dateTime.js";
import { DATE_TIME_FORMAT, max_anios, max_dias, max_horas, max_meses } from "../src/constants.js";

dayjs.extend(customParseFormat);

describe('str2dayjs', () => {
    it('should format valid date string correctly', () => {
        const result = str2dayjs('2025-11-19T14:30');
        expect(result).toBe('2025-11-19T14:30');
    });

    it('should throw error for invalid date format', () => {
        expect(() => str2dayjs('2025-11-19')).toThrow();
        expect(() => str2dayjs('2025/11-19T14:30')).toThrow();
        expect(() => str2dayjs('invalid')).toThrow();
    });

    it('should throw error with correct message', () => {
        expect(() => str2dayjs('invalid'))
            .toThrow(`--from debe coincidir con el formato ${DATE_TIME_FORMAT}`);
    });
});

describe('timeFrame', () => {
    it('Time frame válido', () => {
        expect(() => timeFrame('invalid'))
            .toThrow('Formato para expresión de tiempo no válido');
    });

    it('Time frame válido para años', () => {
        expect(() => timeFrame(`${max_anios + 2}a`))
            .toThrow(`Si especifica las unidades como a (años), número debe ser máximo ${max_anios}`);

        const result = timeFrame(`${max_anios - 1}a`);
        expect(result.number).toBe(max_anios - 1);
    });

    it('Time frame válido para meses', () => {
        expect(() => timeFrame(`${max_meses + 2}m`))
            .toThrow(`Si especifica las unidades como m (mes), número debe ser máximo ${max_meses}`);

        const result = timeFrame(`${max_meses - 1}m`);
        expect(result.number).toBe(max_meses - 1);
    });

    it('Time frame válido para días', () => {
        expect(() => timeFrame(`${max_dias + 2}d`))
            .toThrow(`Si especifica las unidades como d (días), número debe ser máximo ${max_dias}`);

        const result = timeFrame(`${max_dias - 1}d`);
        expect(result.number).toBe(max_dias - 1);
    });

    it('Time frame válido para horas', () => {
        expect(() => timeFrame(`-${max_horas + 4}h`))
            .toThrow(`Si especifica las unidades como h (horas), número debe ser máximo ${max_horas}`);

        const result = timeFrame(`-${max_horas - 1}h`);
        expect(result.number).toBe(max_horas - 1);
    });

});

describe('computeTimeInterval', () => {
    it('computeTimeInterval -1 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '-', number: 1, unit: 'h' });
        expect(result).toEqual({
            start: '2025-11-19T13:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +24 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '+', number: 24, unit: 'h' });
        expect(result).toEqual({
            start: '2025-11-19T14:30',
            end: '2025-11-20T14:30',
        });
    });

    it('computeTimeInterval -21 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '-', number: 21, unit: 'h' });
        expect(result).toEqual({
            start: '2025-11-18T17:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +24 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '+', number: 24, unit: 'h' });
        expect(result).toEqual({
            start: '2025-11-19T14:30',
            end: '2025-11-20T14:30',
        });
    });

    it('computeTimeInterval +79 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '+', number: 79, unit: 'h' });
        expect(result).toEqual({
            start: '2025-11-19T14:30',
            end: '2025-11-22T21:30',
        });
    });


    it('computeTimeInterval +11 mes', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '+', number: 11, unit: 'm' });
        expect(result).toEqual({
            start: '2025-11-19T14:30',
            end: '2026-10-19T14:30',
        });
    });

    it('computeTimeInterval -11 mes', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '-', number: 11, unit: 'm' });
        expect(result).toEqual({
            start: '2024-12-19T14:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +1 año', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '+', number: 1, unit: 'a' });
        expect(result).toEqual({
            start: '2025-11-19T14:30',
            end: '2026-11-19T14:30',
        });
    });

    it('computeTimeInterval -1 año', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <TimeExpression>{ sign: '-', number: 1, unit: 'a' });
        expect(result).toEqual({
            start: '2024-11-19T14:30',
            end: '2025-11-19T14:30',
        });
    });

})

describe('timeIntervalDiff', () => {
    it('timeIntervalDiff should throw error for invalid dates', () => {
        expect(() => timeIntervalDiff({ start: 'invalid', end: '2025-11-20T14:30' }))
            .toThrow('"start" del intervalo de tiempo no es válido');

        expect(() => timeIntervalDiff({ start: '2025-11-19T14:30', end: 'invalid' }))
            .toThrow('"end" del intervalo de tiempo no es válido');
    });

    it('timeIntervalDiff start < end', () => {
        const result = timeIntervalDiff({ start: '2025-11-19T14:30', end: '2026-11-20T12:31' });
        expect(result).toEqual({
            days: 365,
            hours: 22,
            minutes: 1,
        });
    });

    it('timeIntervalDiff start > dif', () => {
        const result = timeIntervalDiff({ start: '2026-11-20T12:31', end: '2025-11-19T14:30' });
        expect(result).toEqual({
            days: 365,
            hours: 22,
            minutes: 1,
        });
    });

})

describe('truncDateTime invalid date', () => {
    it('truncDateTime should throw error for invalid date', () => {
        expect(() => truncDateTime('invalid', 'day'))
            .toThrow(`truncDateTime(), 'invalid' no coincide con el formato ${DATE_TIME_FORMAT}`);
    });

    it('truncDateTime 2025-11-19T14:30 month', () => {
        const result = truncDateTime('2025-11-19T14:30', 'month');
        expect(result).toBe('2025-11-01T00:00');
    });

    it('truncDateTime 2025-11-19T14:30 day', () => {
        const result = truncDateTime('2025-11-19T14:30', 'day');
        expect(result).toBe('2025-11-19T00:00');
    });

    it('truncDateTime 2025-11-19T14:30 hour', () => {
        const result = truncDateTime('2025-11-19T14:30', 'hour');
        expect(result).toBe('2025-11-19T14:00');
    });

    it('truncDateTime 2025-11-19T14:30 minute', () => {
        const result = truncDateTime('2025-11-19T14:30', 'minute');
        expect(result).toBe('2025-11-19T14:30');
    });
})

describe('roundDateTime', () => {
    it('roundDateTime invalid date', () => {
        expect(() => roundDateTime('invalid', 'day'))
            .toThrow(`roundDateTime(), 'invalid' no coincide con el formato ${DATE_TIME_FORMAT}`);
    });

    it('roundDateTime month', () => {
        const result = roundDateTime('2025-11-19T14:30', 'month');
        expect(result).toBe('2025-12-01T00:00');
    });

    it('roundDateTime day', () => {
        const result = roundDateTime('2025-11-19T14:30', 'day');
        expect(result).toBe('2025-11-20T00:00');
    });

    it('roundDateTime hour', () => {
        const result = roundDateTime('2025-11-19T14:30', 'hour');
        expect(result).toBe('2025-11-19T15:00');
    });
})
