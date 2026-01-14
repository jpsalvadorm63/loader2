import {
    computeTimeInterval,
    DEFAULT_TIME_FRAME,
    str2dayjs,
    timeFrame,
} from "../dateTime/index.js";
import {
    THIS_MOMENT
} from "../dateTime/dateTime.js";


/**
 * Procesa el parámetro de línea de comandos 'from' para calcular un intervalo de tiempo.
 *
 * Esta función analiza una cadena que contiene una fecha de inicio y un marco de tiempo opcional,
 * separados por punto y coma (;), y devuelve un intervalo de tiempo calculado.
 *
 * @param {string|null} from - Cadena con formato "fecha;marcoTiempo" o valores individuales.
 *                              Si es null, vacío o la fecha está vacía, usa la fecha actual.
 *                              Si no se especifica marcoTiempo, usa DEFAULT_TIME_FRAME (-3h).
 *
 * @returns {object} Objeto con propiedades 'start' y 'end' representando el intervalo de tiempo
 *                   en formato DATE_TIME_FORMAT (YYYY-MM-DDTHH:mm).
 *
 * @throws {Error} Si la fecha no tiene el formato correcto o no es válida.
 * @throws {Error} Si el marco de tiempo excede los límites máximos permitidos.
 *
 * @example
 * // Uso sin argumentos (usa fecha actual y marco de tiempo por defecto -3h)
 * commandFrom()
 * //en la línea de comandos no se especifica este argumento, por lo que se asumen valores por defecto: fecha y hora
 * // actual. Marco de tiempo por defecto: -3 horas antes
 * // Si la hora actual es 2025-01-19T11:30, retorna {start: '2025-01-19T11:30', end: '2025-01-19T14:30'}
 *
 * @example
 * // Uso con fecha específica y marco de tiempo por defecto -3h
 * commandFrom('2025-11-19T14:30')
 * --from="2025-11-19T14:30"
 * -F "2025-11-19T14:30"
 * // Retorna: {start: '2025-11-19T11:30', end: '2025-11-19T14:30'}
 *
 * @example
 * // Uso con fecha específica y marco de tiempo personalizado
 * commandFrom('2025-11-19T14:30;-24h')
 * --from="2025-11-19T14:30;-24h"
 * -F "2025-11-19T14:30;-24h"
 * // Retorna: {start: '2025-11-18T14:30', end: '2025-11-19T14:30'}
 *
 * @example
 * // Uso sin fecha, pero con marco de tiempo personalizado (usa fecha actual)
 * commandFrom(';-16h')
 * --from=";-16h"
 * -F ";-16h"
 * // Retorna: {start: '<fecha_actual_menos_16h>', end: '<fecha_actual>'}
 *
 * @example
 * // Marcos de tiempo válidos: -24h (horas), -7d (días), -2m (meses), -1a (años)
 * commandFrom('2025-11-19T14:30;-7d')
 * --from="2025-11-19T14:30;-7d"
 * -F "2025-11-19T14:30;-7d"
 * // Retorna: {start: '2025-11-12T14:30', end: '2025-11-19T14:30'}
 */
export const commandFrom = (from:string|null = '') => {
    const myVars = (from ?? '').split(';');
    const rawStart = (myVars[0] ?? '').trim() === "" ? THIS_MOMENT() : str2dayjs(myVars[0]);
    const myTimeFrame = (myVars.length >= 2) ? timeFrame(myVars[1]) : DEFAULT_TIME_FRAME;
    // console.log('. . . result: ', computeTimeInterval(rawStart, myTimeFrame))

    return computeTimeInterval(rawStart, myTimeFrame)
}