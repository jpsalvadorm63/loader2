import { describe, it, expect } from 'vitest';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from "dayjs";
import {computeDates, str2dayjs, TimeExpression, timeFrame} from "../src/commons.js";
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

    it('computeDates 1', () => {
        const result = computeDates('2025-11-19T14:30', <TimeExpression>{ sign: '-', number: 1, unit: 'h' });
        expect(result).toEqual({
            start: '2025-11-19T13:30',
            end: '2025-11-19T14:30',
            daysBetween: 0,
            hoursBetween: 1,
            minutesBetween: 0
        });
    });

    it('computeDates 1', () => {
        const result = computeDates('2005-11-19T14:30', <TimeExpression>{ sign: '-', number: 1, unit: 'a' });
        expect(result).toEqual({
            start: '2004-11-19T14:30',
            end: '2005-11-19T14:30',
            daysBetween: 365,
            hoursBetween: 0,
            minutesBetween: 0
        });
    });

});