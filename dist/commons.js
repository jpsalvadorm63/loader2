import dayjs from "dayjs";
import { DATE_TIME_FORMAT, max_anios, max_dias, max_horas, max_meses } from "./constants.js";
/**
 * Convierte una cadena de texto en formato fecha/hora a un formato estandarizado
 *
 * @param {string} value - Cadena de texto que representa una fecha y hora
 * @returns {string} Fecha y hora formateada según el formato DATE_TIME_FORMAT
 * @throws {Error} Si el formato de la fecha de entrada no coincide con DATE_TIME_FORMAT
 *
 * @example
 * str2dayjs('2025-11-19T14:30') // retorna '2025-11-19T14:30'
 * str2dayjs('2025-11-19T14:59') // retorna '2025-11-19T14:59'
 * str2dayjs('2025-11-19T14:60') // retorna error '-F,--from debe coincidir con el formato . . .'
 * str2dayjs('2025-11-19T14:00') // retorna '2025-11-19T14:00'
 */
export const str2dayjs = (value) => {
    const parsed = dayjs(value, DATE_TIME_FORMAT, true); // modo estricto
    if (!parsed.isValid()) {
        throw new Error(`-F,--from debe coincidir con el formato ${DATE_TIME_FORMAT}`);
    }
    else
        return parsed.format(DATE_TIME_FORMAT);
};
/**
 * Analiza una cadena de texto que representa una expresión de tiempo y la convierte en un objeto estructurado.
 * El valor predeterminado es '-3h' que significa 3 horas antes.
 *
 * @param {string} value - Cadena de texto que representa una expresión de tiempo (ej., "+1h", "-3d", "2m")
 * @returns {TimeExpression} Objeto que contiene el signo (antes o después), número (el tiempo) y unidad de tiempo (h horas, d días, m meses, a años)
 * @throws {Error} Si el formato de la expresión no es válido o si los valores exceden los límites permitidos
 *
 * @example
 * timeFrame('2h')    // retorna { sign: '-', number: 2, unit: 'h' }
 * timeFrame('+12m')  // retorna { sign: '+', number: 12, unit: 'm' }
 * timeFrame('-6d')   // retorna { sign: '-', number: 6, unit: 'd' }
 * timeFrame('1a')    // retorna { sign: '-', number: 1, unit: 'a' }
 *
 * Unidades permitidas:
 * h: horas (máximo 24)
 * d: días (máximo 6)
 * m: meses (máximo 12)
 * a: años (máximo 2)
 */
export const timeFrame = (value) => {
    // ^([+-])?   → optional sign (+ or -) default -
    // (\d*)      → optional number (0 or more digits) default 3
    // ([hdma])?  → final character (one letter) default h
    const regex = /^([+-])?(\d*)([hdma])?$/;
    const match = value.match(regex);
    if (!match) {
        throw new Error('Formato para expresión de tiempo no válido');
    }
    const sign = match[1] || "-";
    const number = parseInt(match[2] || "3", 10);
    const unit = match[3] || "h";
    if (unit === "h" && number > max_horas) {
        throw new Error(`Si especifica las unidades como h (horas), número debe ser máximo ${max_horas}`);
    }
    if (unit === "d" && number > 6) {
        throw new Error(`Si especifica las unidades como d (días), número debe ser máximo ${max_dias}`);
    }
    if (unit === "m" && number > max_meses) {
        throw new Error(`Si especifica las unidades como m (mes), número debe ser máximo ${max_meses}`);
    }
    if (unit === "a" && number > max_anios) {
        throw new Error(`Si especifica las unidades como a (años), número debe ser máximo ${max_anios}`);
    }
    return { sign, number, unit };
};
