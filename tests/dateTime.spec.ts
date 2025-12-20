// @ts-ignore

import {
    describe,
    it,
    expect
} from 'vitest';

// @ts-ignore
import {
    DATE_TIME_FORMAT,
    MAX_ANIOS,
    MAX_DIAS,
    MAX_MESES,
    MAX_HORAS,
    DEFAULT_MAX_ANIOS_ERROR_MSG,
    DEFAULT_MAX_MESES_ERROR_MSG,
    DEFAULT_MAX_DIAS_ERROR_MSG,
    DEFAULT_MAX_HORAS_ERROR_MSG,
    INVALID_START_DATE,
    INVALID_END_DATE,
    computeTimeInterval,
    roundDateTime,
    str2dayjs,
    timeFrame,
    timeIntervalDiff,
    truncDateTime
    // @ts-ignore
} from "../src/dateTime";

import type {
    ITimeExpression,
    ITimeInterval,
    ITimeIntervalDiff
    // @ts-ignore
} from "../src/dateTime";

import {
    DEFAULT_DATE_TIME_FORMAT_ERROR_MSG,
    DEFAULT_TIME_FRAME_FORMAT_ERROR
    // @ts-ignore
} from "../src/dateTime";

import {PLACEHOLDER} from "../src/commons/console.js";

/**
 * Pruebas para la función str2dayjs.
 * Validar la conversión de cadenas de texto a objetos dayjs.
 */
describe('str2dayjs', () => {
    it('should format valid date string correctly', () => {
        expect(str2dayjs('2025-11-19T14:30')).toBe('2025-11-19T14:30');
    });

    it('should throw error for invalid date format', () => {
        expect(() => str2dayjs('2025-11-19')).toThrow();
    });

    it('should throw error for invalid date format', () => {
        expect(() => str2dayjs('2025/11-19T14:30')).toThrow();
    });

    it('should throw error for invalid date format', () => {
        expect(() => str2dayjs('invalid')).toThrow(DEFAULT_DATE_TIME_FORMAT_ERROR_MSG);
    });

    it('should throw error for invalid date format', () => {
        expect(() => str2dayjs('invalid',`-F --from ${PLACEHOLDER}`)).toThrow(`-F --from ${DEFAULT_DATE_TIME_FORMAT_ERROR_MSG}`);
    });
});

/**
 * Pruebas para la función timeFrame
 * Verifica la validación de expresiones de tiempo y sus límites
 */
describe('timeFrame', () => {
    it('Time frame válido', () => {
        expect(() => timeFrame('invalid'))
            .toThrow(DEFAULT_TIME_FRAME_FORMAT_ERROR);
    });

    it('Time frame no válido para años', () => {
        expect(() => timeFrame(`${MAX_ANIOS + 2}a`))
            .toThrow(DEFAULT_MAX_ANIOS_ERROR_MSG);
    });

    it('Time frame válido para años', () => {
        const result = timeFrame(`${MAX_ANIOS - 1}a`);
        expect(result.number).toBe(MAX_ANIOS - 1);
    });

    it('Time frame no válido para meses', () => {
        expect(() => timeFrame(`${MAX_MESES + 2}m`))
            .toThrow(DEFAULT_MAX_MESES_ERROR_MSG);
    });

    it('Time frame válido para meses', () => {
        const result = timeFrame(`${MAX_MESES - 1}m`);
        expect(result.number).toBe(MAX_MESES - 1);
    });

    it('Time frame no válido para días', () => {
        expect(() => timeFrame(`${MAX_DIAS + 2}d`))
            .toThrow(DEFAULT_MAX_DIAS_ERROR_MSG);
    });

    it('Time frame válido para días', () => {
        const result = timeFrame(`${MAX_DIAS - 1}d`);
        expect(result.number).toBe(MAX_DIAS - 1);
    });

    it('Time frame no válido para horas', () => {
        expect(() => timeFrame(`-${MAX_HORAS + 4}h`))
            .toThrow(DEFAULT_MAX_HORAS_ERROR_MSG);
    });

    it('Time frame válido para horas', () => {
        const result = timeFrame(`-${MAX_HORAS - 1}h`);
        expect(result.number).toBe(MAX_HORAS - 1);
    });
});

/**
 * Pruebas para la función computeTimeInterval
 * Verifica el cálculo de intervalos de tiempo con diferentes unidades
 */
describe('computeTimeInterval', () => {
    it('computeTimeInterval -1 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '-', number: 1, unit: 'h' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-19T13:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +24 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '+', number: 24, unit: 'h' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-19T14:30',
            end: '2025-11-20T14:30',
        });
    });

    it('computeTimeInterval -21 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '-', number: 21, unit: 'h' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-18T17:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +24 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '+', number: 24, unit: 'h' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-19T14:30',
            end: '2025-11-20T14:30',
        });
    });

    it('computeTimeInterval +79 horas', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '+', number: 79, unit: 'h' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-19T14:30',
            end: '2025-11-22T21:30',
        });
    });


    it('computeTimeInterval +11 mes', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '+', number: 11, unit: 'm' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-19T14:30',
            end: '2026-10-19T14:30',
        });
    });

    it('computeTimeInterval -11 mes', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '-', number: 11, unit: 'm' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2024-12-19T14:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +1 año', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '+', number: 1, unit: 'a' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-11-19T14:30',
            end: '2026-11-19T14:30',
        });
    });

    it('computeTimeInterval -1 año', () => {
        const result = computeTimeInterval('2025-11-19T14:30', <ITimeExpression>{ sign: '-', number: 1, unit: 'a' });
        expect(result).toEqual(<ITimeInterval>{
            start: '2024-11-19T14:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval -1 año com timeFrame', () => {
        const result = computeTimeInterval('2025-11-19T14:30', "-1a");
        expect(result).toEqual(<ITimeInterval>{
            start: '2024-11-19T14:30',
            end: '2025-11-19T14:30',
        });
    });

    it('computeTimeInterval +24 horas de timeFrame', () => {
        const result = computeTimeInterval('2025-12-19T14:30', "+20h");
        expect(result).toEqual(<ITimeInterval>{
            start: '2025-12-19T14:30',
            end: '2025-12-20T10:30',
        });
    });

    it('computeTimeInterval +1 mes con error', () => {
        expect(() => computeTimeInterval('2025-12-19T14:30', "xy")).toThrow(DEFAULT_TIME_FRAME_FORMAT_ERROR);
    });
})

/**
 * Pruebas para la función timeIntervalDiff
 * Verifica el cálculo de diferencias entre intervalos de tiempo
 */
describe('timeIntervalDiff', () => {
    it('timeIntervalDiff should throw error for invalid start date', () => {
        expect(() => timeIntervalDiff(<ITimeInterval>{ start: 'invalid', end: '2025-11-20T14:30' }))
            .toThrow(INVALID_START_DATE);
    });

    it('timeIntervalDiff should throw error for invalid end date', () => {
        expect(() => timeIntervalDiff(<ITimeInterval>{ start: '2025-11-19T14:30', end: 'invalid' }))
            .toThrow(INVALID_END_DATE);
    });

    it('timeIntervalDiff start < end', () => {
        const result = timeIntervalDiff(<ITimeInterval>{ start: '2025-11-19T14:30', end: '2026-11-20T12:31' });
        expect(result).toEqual(<ITimeIntervalDiff>{
            days: 365,
            hours: 22,
            minutes: 1,
        });
    });

    it('timeIntervalDiff start > dif', () => {
        const result = timeIntervalDiff(<ITimeInterval>{ start: '2026-11-20T12:31', end: '2025-11-19T14:30' });
        expect(result).toEqual(<ITimeIntervalDiff>{
            days: 365,
            hours: 22,
            minutes: 1,
        });
    });
})

/**
 * Pruebas para la función truncDateTime
 * Verifica el truncamiento de fechas a diferentes unidades de tiempo
 */
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

/**
 * Pruebas para la función roundDateTime
 * Verifica el redondeo de fechas a diferentes unidades de tiempo
 */
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
