import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "./constants.js";
/**
 * Convierte una cadena de texto en formato fecha/hora a un formato estandarizado
 *
 * @param {string} value - Cadena de texto que representa una fecha y hora
 * @returns {string} Fecha y hora formateada según el formato DATE_TIME_FORMAT
 * @throws {Error} Si el formato de la fecha de entrada no coincide con DATE_TIME_FORMAT
 *
 * @example
 * str2dayjs('2025-11-19T14:30') // retorna '2025-11-19T14:30'
 */
export const str2dayjs = (value) => {
    const parsed = dayjs(value, DATE_TIME_FORMAT, true); // modo estricto
    if (!parsed.isValid()) {
        throw new Error(`-F,--from debe coincidir con el formato ${DATE_TIME_FORMAT}`);
    }
    else
        return parsed.format(DATE_TIME_FORMAT);
};
