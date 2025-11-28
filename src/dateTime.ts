import dayjs from "dayjs";
import {
    DATE_TIME_FORMAT,
    max_anios,
    max_meses,
    max_dias,
    max_horas
} from "./constants.js";


/**
 * Interfaz que representa una expresión de tiempo con un signo, un número y una unidad.
 * Se utiliza para especificar intervalos de tiempo relativos.
 *
 * sign - Signo que indica si el intervalo de tiempo es hacia adelante (+) o hacia atrás (-)
 *
 * number - Intervalo de tiempo
 *
 * unit - Unidad de tiempo que se aplica al intervalo de tiempo:
 * - h: horas (máximo ${max_horas})
 * - d: días (máximo ${max_dias})
 * - m: meses (máximo ${max_meses})
 * - a: años (máximo ${max_anios})
 */
export interface TimeExpression {
    sign: '+' | '-';
    number: number;
    unit: string;
}


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
export const str2dayjs = (value: string): string => {
    const parsed = dayjs(value, DATE_TIME_FORMAT, true); // modo estricto
    if (!parsed.isValid()) {
        throw new Error(`-F,--from debe coincidir con el formato ${DATE_TIME_FORMAT}`);
    } else
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
 * h: horas (máximo ${max_horas})
 * d: días (máximo ${max_dias})
 * m: meses (máximo ${max_meses})
 * a: años (máximo {max_nios})
 */
export const timeFrame = (value: string): TimeExpression => {
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

    if (unit === "d" && number > max_dias) {
        throw new Error(`Si especifica las unidades como d (días), número debe ser máximo ${max_dias}`);
    }

    if (unit === "m" && number > max_meses) {
        throw new Error(`Si especifica las unidades como m (mes), número debe ser máximo ${max_meses}`);
    }

    if (unit === "a" && number > max_anios) {
        throw new Error(`Si especifica las unidades como a (años), número debe ser máximo ${max_anios}`);
    }

    return <TimeExpression>{ sign, number, unit };
}


/**
 * Interfaz que define un intervalo de tiempo con fecha de inicio y fin. Las fechas están como
 * cadena de caracteres en el formato DATE_TIME_FORMAT.
 */
export interface TimeInterval {
    start: string
    end: string
}


/**
 * Interfaz que representa la diferencia de tiempo desglosada en días, horas y minutos.
 */
export interface TimeIntervalDiff {
    days: number
    hours: number
    minutes: number
}


/**
 * Calcula el intervalo de tiempo resultante de aplicar una expresión de tiempo a una fecha dada.
 *
 * @param {string} dateTime - La fecha y hora base en formato string.
 * @param {TimeExpression} te - La expresión de tiempo que contiene la cantidad, unidad y dirección (signo) a aplicar.
 * @returns {TimeInterval} Un objeto que contiene la fecha de inicio y fin del intervalo calculado.
 * @throws {Error} Si la fecha base no es válida según el formato esperado.
 * @throws {Error} Si la unidad de tiempo en la expresión no es reconocida.
 */
export const computeTimeInterval = (dateTime: string, te: TimeExpression): TimeInterval => {
    const parsed = dayjs(dateTime, DATE_TIME_FORMAT, true);
    if (!parsed.isValid()) {
        throw new Error(`computeDates(), ${dateTime} no coincide con el formato ${DATE_TIME_FORMAT}`);
    }

    let unit: 'hour' | 'day' | 'month' | 'year';
    switch (te.unit) {
        case 'h': unit = 'hour'; break;
        case 'd': unit = 'day'; break;
        case 'm': unit = 'month'; break;
        case 'a': unit = 'year'; break;
        default: throw new Error(`Unidad desconocida: ${te.unit}`);
    }

    const targetDate = te.sign === '+'
        ? parsed.add(te.number, unit)
        : parsed.subtract(te.number, unit);

    const startDate = parsed.isBefore(targetDate) ? parsed : targetDate;
    const endDate = parsed.isBefore(targetDate) ? targetDate : parsed;

    return {
        start: startDate.format(DATE_TIME_FORMAT),
        end: endDate.format(DATE_TIME_FORMAT)
    };

}


/**
 * Calcula la diferencia entre las fechas de inicio y fin de un intervalo de tiempo dado.
 *
 * @param {TimeInterval} interval - El objeto de intervalo de tiempo que contiene las fechas de inicio y fin.
 * @returns {TimeIntervalDiff} Un objeto que representa la diferencia entre las fechas del intervalo.
 * @throws {Error} Si la fecha de inicio del intervalo no es válida.
 * @throws {Error} Si la fecha de fin del intervalo no es válida.
 */
export const timeIntervalDiff = (interval: TimeInterval): TimeIntervalDiff => {
    let startDate = dayjs(interval.start);
    let endDate = dayjs(interval.end);

    if (!startDate.isValid()) {
        throw new Error('"start" del intervalo de tiempo no es válido');
    }

    if (!endDate.isValid()) {
        throw new Error('"end" del intervalo de tiempo no es válido');
    }

    if (startDate.isAfter(endDate)) {
        [startDate, endDate] = [endDate, startDate];
    }

    if (!startDate.isValid()) {
        throw new Error('"start" del intervalo de tiempo no es válido');
    }

    if (!endDate.isValid()) {
        throw new Error('"end" del intervalo de tiempo no es válido');
    }

    let minutesLeft = endDate.diff(startDate, 'minute');
    const days = Math.floor(minutesLeft / 1440);
    minutesLeft -= days * 1440;
    const hours = Math.floor(minutesLeft / 60);
    minutesLeft -= hours * 60;
    const minutes = minutesLeft;

    return <TimeIntervalDiff>{
        days,
        hours,
        minutes
    };
}


/**
 * Trunca una fecha y hora dada a la unidad especificada (mes, día, hora o minuto).
 * Por ejemplo, truncar '2023-10-26T14:35:12' a 'day' resultaría en '2023-10-26T00:00:00'.
 *
 * @param {string} dateTime - La fecha y hora a truncar, en formato DATE_TIME_FORMAT.
 * @param {'month' | 'day' | 'hour' | 'minute'} unit - La unidad a la que se debe truncar la fecha y hora.
 * @returns {string} La fecha y hora truncada, en formato DATE_TIME_FORMAT.
 * @throws {Error} Si la fecha de entrada no es válida según el formato DATE_TIME_FORMAT.
 *
 * @example
 * truncDateTime('2023-10-26T14:35', 'month') // retorna '2023-10-01T00:00'
 * truncDateTime('2023-10-26T14:35', 'day')   // retorna '2023-10-26T00:00'
 * truncDateTime('2023-10-26T14:35', 'hour')  // retorna '2023-10-26T14:00'
 * truncDateTime('2023-10-26T14:35', 'minute') // retorna '2023-10-26T14:35'
 */
export const truncDateTime = (dateTime: string, unit: 'month' | 'day' | 'hour' | 'minute'): string => {
    const parsed = dayjs(dateTime, DATE_TIME_FORMAT, true);
    if (!parsed.isValid()) {
        throw new Error(`truncDateTime(), '${dateTime}' no coincide con el formato ${DATE_TIME_FORMAT}`);
    }

    let truncated = parsed;
    if (unit === 'month') {
        truncated = parsed.date(1).hour(0).minute(0).second(0).millisecond(0);
    } else if (unit === 'day') {
        truncated = parsed.hour(0).minute(0).second(0).millisecond(0);
    } else if (unit === 'hour') {
        truncated = parsed.minute(0).second(0).millisecond(0);
    } else if (unit === 'minute') {
        truncated = parsed.second(0).millisecond(0);
    }

    return truncated.format(DATE_TIME_FORMAT);
}


/**
 * Redondea una fecha y hora dada a la unidad especificada (mes, día o hora).
 * Por ejemplo, redondear '2023-10-26T14:35:12' a 'day' resultaría en '2023-10-26T00:00:00'.
 *
 * @param {string} dateTime - La fecha y hora a redondear, en formato DATE_TIME_FORMAT.
 * @param {'month' | 'day' | 'hour'} unit - La unidad a la que se debe redondear la fecha y hora.
 * @returns {string} La fecha y hora redondeada, en formato DATE_TIME_FORMAT.
 * @throws {Error} Si la fecha de entrada no es válida según el formato DATE_TIME_FORMAT.
 *
 * @example
 * roundDateTime('2023-10-26T14:35', 'month') // retorna '2023-11-01T00:00'
 * roundDateTime('2023-10-26T14:35', 'day')   // retorna '2023-10-26T00:00'
 * roundDateTime('2023-10-26T14:35', 'hour')  // retorna '2023-10-26T15:00'
 */
export const roundDateTime = (dateTime: string, unit: 'month' | 'day' | 'hour'): string => {
    const parsed = dayjs(dateTime, DATE_TIME_FORMAT, true);
    if (!parsed.isValid()) {
        throw new Error(`roundDateTime(), '${dateTime}' no coincide con el formato ${DATE_TIME_FORMAT}`);
    }

    let rounded = parsed;
    if (unit === 'month') {
        rounded = parsed.add(1, 'month').date(1).hour(0).minute(0).second(0).millisecond(0);
    } else if (unit === 'day') {
        rounded = parsed.add(1, 'day').hour(0).minute(0);
    } else if (unit === 'hour') {
        rounded = parsed.add(1, 'hour').minute(0);
    }

    return rounded.format(DATE_TIME_FORMAT);
}
