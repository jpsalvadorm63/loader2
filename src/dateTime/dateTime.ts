import dayjs from "dayjs";

import customParseFormat from 'dayjs/plugin/customParseFormat.js';

import {
    DATE_TIME_FORMAT,
    MAX_ANIOS,
    MAX_MESES,
    MAX_DIAS,
    MAX_HORAS,
    DEFAULT_MAX_HORAS_ERROR_MSG,
    DEFAULT_MAX_DIAS_ERROR_MSG,
    DEFAULT_MAX_MESES_ERROR_MSG,
    DEFAULT_MAX_ANIOS_ERROR_MSG,
    DEFAULT_DATE_TIME_FORMAT_ERROR_MSG, DEFAULT_TIME_FRAME_FORMAT_ERROR
} from "./dateTime.constants.js";

import {
    ITimeExpression,
    ITimeInterval,
    ITimeIntervalDiff
} from "./dateTime.interfaces.js";

import chalk from "chalk";

import {
    fnConsole,
    INFO_MESSAGE,
    TConsoleMessageType
} from "../commons/index.js";

import {
    PLACEHOLDER
} from "../commons/console.js";

dayjs.extend(customParseFormat);

/**
 * Formatea la fecha y hora actual utilizando el formato de fecha y hora global especificado.
 *
 * La función `formatNow` utiliza la biblioteca `dayjs` para obtener y formatear la
 * fecha y hora actual. Aplica el formato descrito por la constante `DATE_TIME_FORMAT`
 * para garantizar consistencia en todas las salidas de fecha y hora.
 *
 * @function
 * @returns {string} Una cadena que representa la fecha y hora actual en el
 *                   formato `DATE_TIME_FORMAT` especificado.
 */
export const formatNow = () => dayjs().format(DATE_TIME_FORMAT);

/**
 * Confirma que una cadena de texto esté en formato fecha/hora DATE_TIME_FORMAT
 * estandarizado y que sea una fecha válida.
 *
 * @param {string} value - Cadena de texto que representa una fecha y hora
 * @param {string} errorMsg - Mensaje de error personalizado en caso de que no sea una fecha válida o no esté en el formato DATE_TIME_FORMAT.
 *                            Si contiene "..." será reemplazado por el mensaje de error predeterminado.
 * @returns {string} Fecha y hora formateada en formato ${DATE_TIME_FORMAT}
 * @throws {Error} Si el formato de la fecha de entrada no coincide con DATE_TIME_FORMAT o si la fecha no es válida
 *
 * @example
 * str2dayjs('2025-11-19T14:30') // retorna '2025-11-19T14:30'
 * str2dayjs('2025-11-19T14:59') // retorna '2025-11-19T14:59'
 * str2dayjs('2025-11-19T14:60') // lanza error `debe coincidir con el formato ${DATE_TIME_FORMAT}`
 * str2dayjs('2025-11-19T14:00') // retorna '2025-11-19T14:00'
 */
export const str2dayjs = (value: string, errorMsg: string = DEFAULT_DATE_TIME_FORMAT_ERROR_MSG): string => {
    const parsed = dayjs(value, DATE_TIME_FORMAT, true); // modo estricto
    if (!parsed.isValid()) {
        const formattedErrorMessage = errorMsg.includes(PLACEHOLDER) ? errorMsg.replace(PLACEHOLDER, DEFAULT_DATE_TIME_FORMAT_ERROR_MSG) : errorMsg;
        throw new Error(formattedErrorMessage);
    } else
        return parsed.format(DATE_TIME_FORMAT);
};

/**
 * Analiza una cadena de texto que representa una expresión de tiempo y la convierte en un objeto estructurado.
 * El valor predeterminado es '-3h' que significa 3 horas antes.
 *
 * @param {string} value - Cadena de texto que representa una expresión de tiempo (ej., "+1h", "-3d", "2m")
 * @returns {ITimeExpression} Objeto que contiene el signo (antes o después), número (el tiempo) y unidad de tiempo (h horas, d días, m meses, a años)
 * @throws {Error} Si el formato de la expresión no es válido o si los valores exceden los límites permitidos
 *
 * @example
 * timeFrame('2h')    // retorna { sign: '-', number: 2, unit: 'h' }
 * timeFrame('+12m')  // retorna { sign: '+', number: 12, unit: 'm' }
 * timeFrame('-6d')   // retorna { sign: '-', number: 6, unit: 'd' }
 * timeFrame('1a')    // retorna { sign: '-', number: 1, unit: 'a' }
 *
 * Unidades permitidas:
 * h: horas (máximo ${MAX_HORAS})
 * d: días (máximo ${MAX_DIAS})
 * m: meses (máximo ${MAX_MESES})
 * a: años (máximo {MAX_ANIOS})
 */
export const timeFrame = (value: string): ITimeExpression => {
    // ^([+-])?   → optional sign (+ or -) default -
    // (\d*)      → optional number (0 or more digits) default 3
    // ([hdma])?  → final character (one letter) default h
    const regex = /^([+-])?(\d*)([hdma])?$/;
    const match = value.match(regex);

    if (!match) {
        throw new Error(DEFAULT_TIME_FRAME_FORMAT_ERROR);
    }

    const sign = match[1] || "-";
    const number = parseInt(match[2] || "3", 10);
    const unit = match[3] || "h";

    if (unit === "h" && number > MAX_HORAS) {
        throw new Error(DEFAULT_MAX_HORAS_ERROR_MSG);
    }

    if (unit === "d" && number > MAX_DIAS) {
        throw new Error(DEFAULT_MAX_DIAS_ERROR_MSG);
    }

    if (unit === "m" && number > MAX_MESES) {
        throw new Error(DEFAULT_MAX_MESES_ERROR_MSG);
    }

    if (unit === "a" && number > MAX_ANIOS) {
        throw new Error(DEFAULT_MAX_ANIOS_ERROR_MSG);
    }

    return <ITimeExpression>{ sign, number, unit };
}

/**
 * Calcula el intervalo de tiempo resultante de aplicar una expresión de tiempo a una fecha dada.
 *
 * @param {string} dateTime - La fecha y hora base en formato string.
 * @param {ITimeExpression} te - es un string que representa un time frame (-24h, +2a, +3m) o una expresión de tiempo que contiene la cantidad, unidad y dirección (signo) a aplicar.
 * @returns {ITimeInterval} Un objeto que contiene la fecha de inicio y fin del intervalo calculado.
 * @throws {Error} Si la fecha base no es válida según el formato esperado.
 * @throws {Error} Si la unidad de tiempo en la expresión no es reconocida.
 */
export const computeTimeInterval = (dateTime: string, te: string | ITimeExpression): ITimeInterval => {
    const parsed = dayjs(dateTime, DATE_TIME_FORMAT, true);
    if (!parsed.isValid()) {
        throw new Error(`computeTimeInterval(), la fecha base "${dateTime}" ${DEFAULT_DATE_TIME_FORMAT_ERROR_MSG}`);
    }

    const timeExpression : ITimeExpression = (typeof te) === 'string' ? timeFrame(te) : <ITimeExpression>te;

    let unit: 'hour' | 'day' | 'month' | 'year';
    switch (timeExpression.unit) {
        case 'h': unit = 'hour'; break;
        case 'd': unit = 'day'; break;
        case 'm': unit = 'month'; break;
        case 'a': unit = 'year'; break;
        default: throw new Error(`Unidad desconocida: ${timeExpression.unit}`);
    }

    const targetDate = timeExpression.sign === '+'
        ? parsed.add(timeExpression.number, unit)
        : parsed.subtract(timeExpression.number, unit);

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
 * @param {ITimeInterval} interval - El objeto de intervalo de tiempo que contiene las fechas de inicio y fin.
 * @returns {ITimeIntervalDiff} Un objeto que representa la diferencia entre las fechas del intervalo.
 * @throws {Error} Si la fecha de inicio del intervalo no es válida.
 * @throws {Error} Si la fecha de fin del intervalo no es válida.
 */
export const timeIntervalDiff = (interval: ITimeInterval): ITimeIntervalDiff => {
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

    return <ITimeIntervalDiff>{
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
 * Redondea una fecha y hora dada hacia arriba a la siguiente unidad especificada (mes, día u hora).
 * Por ejemplo, redondear '2023-10-26T14:35:12' a 'day' resultaría en '2023-10-27T00:00:00'.
 *
 * @param {string} dateTime - La fecha y hora a redondear, en formato DATE_TIME_FORMAT.
 * @param {'month' | 'day' | 'hour'} unit - La unidad a la que se debe redondear la fecha y hora hacia arriba.
 * @returns {string} La fecha y hora redondeada hacia arriba, en formato DATE_TIME_FORMAT.
 * @throws {Error} Si la fecha de entrada no es válida según el formato DATE_TIME_FORMAT.
 *
 * @example
 * roundDateTime('2023-10-26T14:35', 'month') // retorna '2023-11-01T00:00'
 * roundDateTime('2023-10-26T14:35', 'day')   // retorna '2023-10-27T00:00'
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

/**
 * Registra mensajes de consola que describen el uso de los parámetros de rango de tiempo para la extracción de datos desde
 * la interfaz de línea de comandos del sistema AirVisio.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - El tipo de mensaje de consola a mostrar.
 * Se utiliza para determinar la apariencia y el formato de la salida del mensaje en la consola.
 *
 * Esta función explica cómo usar el parámetro `-F` o `--from` para especificar una fecha de referencia
 * y un rango de tiempo. El parámetro es opcional y proporciona una forma de calcular una fecha de inicio y
 * una fecha de fin para la extracción de datos.
 *
 * - La fecha de referencia debe proporcionarse en el formato definido por `DATE_TIME_FORMAT`
 *   (por ejemplo, `2021-12-31T05:10`).
 * - El rango de tiempo es un valor que especifica una duración. Si el valor es negativo, indica
 *   la duración antes de la fecha de referencia; si es positivo, indica la duración después de la
 *   fecha de referencia.
 */
export const dateTimeHelp0 = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    myConsole('\n-----')
    myConsole(chalk.rgb(173, 216, 230).bold.underline("Franja de tiempo para la extracción de datos desde el sistema AirVisio\nen la línea de comandos.\n"))
    myConsole(chalk.bold("-F o --from"), chalk.bold(" <fecha de referencia;franja de tiempo>       (parámetro no obligatorio)\n"))
    myConsole("Sirve para especificar la ", chalk.bold("<fecha de referencia>"), " desde la cual (o hasta la cual)\naplicar una", chalk.bold("<franja de tiempo>"),
        " suficientes para calcular una fecha inicial y una fecha\nfinal, que establecen el", chalk.bold("filtro de tiempo"), "para extraer los datos del sistema visor.\n")
    myConsole(chalk.bold("    <fecha de referencia>"), ` se especifica con el formato ${DATE_TIME_FORMAT}.\n                           Por ejemplo: 2021-12-31T05:10\n`)
    myConsole(chalk.bold("    <Franja de tiempo>   "), ` Es una cantidad de tiempo que especifica una qué\n                           tiempo antes de la fecha de referencia (si la franja es\n                           negativa) o qué tiempo después (si la franja e positiva).\n`)
}

/**
 * Muestra mensajes de consola describiendo el uso del parámetro de franja de tiempo por horas
 * para la extracción de datos desde la interfaz de línea de comandos del sistema AirVisio.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - El tipo de mensaje de consola a mostrar.
 * Se utiliza para determinar la apariencia y el formato de la salida del mensaje en la consola.
 *
 * Esta función explica cómo especificar franjas de tiempo en horas usando valores negativos
 * (para tiempo antes de la fecha de referencia) o positivos (para tiempo después de la fecha
 * de referencia). Incluye ejemplos prácticos de uso del comando con el parámetro --from.
 */
export const dateTimeHelp1 = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    dateTimeHelp0(msgType)
    myConsole(chalk.bold("   Franja de tiempo por horas.- "),
        `rango aceptado: -1h a -${MAX_HORAS}h, es decir un valor entre\n                           -1 a -${MAX_HORAS} horas antes de la fecha y hora de referencia.`)
    myConsole(`                           rango aceptado: 1h a ${MAX_HORAS}h, es decir un valor entre\n                           1 a ${MAX_HORAS} horas luego de la fecha y hora de referencia.\n`)
    myConsole(chalk.bold("                           Ejemplo 1:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;-4h\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-11-30T22:00, y final = 2024-12-01T02:00\n"))
    myConsole(chalk.bold("                           Ejemplo 2:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;+4h\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-12-01T02:00, y final = 2024-12-01T06:00\n"))
}

/**
 * Muestra mensajes de consola describiendo el uso del parámetro de franja de tiempo por días
 * para la extracción de datos desde la interfaz de línea de comandos del sistema AirVisio.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - El tipo de mensaje de consola a mostrar.
 * Se utiliza para determinar la apariencia y el formato de la salida del mensaje en la consola.
 *
 * Esta función explica cómo especificar franjas de tiempo en días usando valores negativos
 * (para tiempo antes de la fecha de referencia) o positivos (para tiempo después de la fecha
 * de referencia). Incluye ejemplos prácticos de uso del comando con el parámetro --from.
 */
export const dateTimeHelp2 = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    dateTimeHelp0(msgType)
    myConsole(chalk.bold("   Franja de tiempo por dias.- "),
        `rango aceptado: -1d a -${MAX_DIAS}d, es decir un valor entre\n                           -1 a -${MAX_DIAS} dias antes de la fecha y hora de referencia.`)
    myConsole(`                           rango aceptado: 1d a ${MAX_DIAS}d, es decir un valor entre\n                           1 a ${MAX_DIAS} dias luego de la fecha y hora de referencia.\n`)
    myConsole(chalk.bold("                           Ejemplo 1:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;-4d\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-11-27T02:00, y final = 2024-12-01T02:00\n"))
    myConsole(chalk.bold("                           Ejemplo 2:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;+4d\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-12-01T02:00, y final = 2024-12-05T02:00\n"))
}

/**
 * Muestra mensajes de consola describiendo el uso del parámetro de franja de tiempo por meses
 * para la extracción de datos desde la interfaz de línea de comandos del sistema AirVisio.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - El tipo de mensaje de consola a mostrar.
 * Se utiliza para determinar la apariencia y el formato de la salida del mensaje en la consola.
 *
 * Esta función explica cómo especificar franjas de tiempo en meses usando valores negativos
 * (para tiempo antes de la fecha de referencia) o positivos (para tiempo después de la fecha
 * de referencia). Incluye ejemplos prácticos de uso del comando con el parámetro --from.
 */
export const dateTimeHelp3 = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    dateTimeHelp0(msgType)
    myConsole(chalk.bold("   Franja de tiempo por meses.- "),
        `rango aceptado: -1d a -${MAX_MESES}m, es decir un valor entre\n                           -1 a -${MAX_MESES} meses antes de la fecha y hora de referencia.`)
    myConsole(`                           rango aceptado: 1d a ${MAX_MESES}m, es decir un valor entre\n                           1 a ${MAX_MESES} meses luego de la fecha y hora de referencia.\n`)
    myConsole(chalk.bold("                           Ejemplo 1:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;-4m\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-08-01T02:00, y final = 2024-12-01T02:00\n"))
    myConsole(chalk.bold("                           Ejemplo 2:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;+4m\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-12-01T02:00, y final = 2025-04-01T02:00\n"))
}

/**
 * Muestra mensajes de consola describiendo el uso del parámetro de franja de tiempo por años
 * para la extracción de datos desde la interfaz de línea de comandos del sistema AirVisio.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - El tipo de mensaje de consola a mostrar.
 * Se utiliza para determinar la apariencia y el formato de la salida del mensaje en la consola.
 *
 * Esta función explica cómo especificar franjas de tiempo en años usando valores negativos
 * (para tiempo antes de la fecha de referencia) o positivos (para tiempo después de la fecha
 * de referencia). Incluye ejemplos prácticos de uso del comando con el parámetro --from.
 */
export const dateTimeHelp4 = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    dateTimeHelp0(msgType)
    myConsole(chalk.bold("   Franja de tiempo por años.- "),
        `rango aceptado: -1d a -${MAX_ANIOS}a, es decir un valor entre\n                           -1 a -${MAX_ANIOS} años antes de la fecha y hora de referencia.`)
    myConsole(`                           rango aceptado: 1d a ${MAX_ANIOS}a, es decir un valor entre\n                           1 a ${MAX_ANIOS} años luego de la fecha y hora de referencia.\n`)
    myConsole(chalk.bold("                           Ejemplo 1:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;-1a\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2023-12-01T02:00, y final = 2024-12-01T02:00\n"))
    myConsole(chalk.bold("                           Ejemplo 2:\n"))
    myConsole(chalk.bold("                           $ loader2 fromAirVisio --from=\"2024-12-01T02:00;+1a\"   <otros params>\n"))
    myConsole("                           Equivale al filtro de tiempo:")
    myConsole(chalk.bold("                           fecha hora inicial = 2024-12-01T02:00, y final = 2025-12-01T02:00\n"))
}

/**
 * Muestra mensajes de consola explicando el comportamiento por defecto cuando no se especifica
 * el parámetro -F o --from en la línea de comandos del sistema AirVisio.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - El tipo de mensaje de consola a mostrar.
 * Se utiliza para determinar la apariencia y el formato de la salida del mensaje en la consola.
 *
 * Esta función informa al usuario que cuando no se proporciona una fecha de referencia explícita,
 * el sistema utilizará la fecha y hora actual como valor por defecto, mostrando cuál es ese valor
 * en el momento de la consulta.
 */
export const dateTimeHelp5 = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    dateTimeHelp0(msgType)
    myConsole(chalk.bold("    Si no se especifica níngún parámetro -F o --from .- "))
    myConsole("                           Fecha y hora de referencia por defecto, la actual:")
    myConsole(chalk.bold(`                           (${formatNow()})\n`))
    myConsole("                           Franja de tiempo por defecto:")
    myConsole(chalk.bold(`                           -3h, -3 horas\n`))
}
