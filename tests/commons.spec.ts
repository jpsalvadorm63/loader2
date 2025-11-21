import { describe, it, expect } from 'vitest';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from "dayjs";
import {str2dayjs} from "../src/commons.js";
import {DATE_TIME_FORMAT} from "../src/constants.js";

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