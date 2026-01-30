import {
    NONE,
    IIntervals
} from "./configs/params.constants.js";

import {
    IInterval
} from "./configs/params.interfaces.js";

import chalk from "chalk";

import process from "process";

import Table from "cli-table3";

import {
    INFO_MESSAGE,
    TConsoleMessageType
} from "../commons/console.js";

import {
    fnConsole
} from "../commons/console.js";

/**
 * Verifica si un código de intervalo proporcionado existe en la lista de intervalos válidos del sistema.
 *
 * Realiza una búsqueda en el arreglo de intervalos permitidos (IIntervals) para determinar
 * si el código proporcionado corresponde a un intervalo válido.
 *
 * @param {string | null | undefined} interval - Código del intervalo a verificar (ej: '001m', '001h')
 * @returns {boolean} true si el intervalo existe en la lista de intervalos permitidos, false en caso contrario
 *
 * @example
 * reviewInterval('001m') // true - intervalo válido de 1 minuto
 * reviewInterval('001h') // true - intervalo válido de 1 hora
 * reviewInterval('invalid') // false - intervalo no existe
 * reviewInterval(null) // false - valor nulo
 * reviewInterval(undefined) // false - valor indefinido
 */
export const reviewInterval = (interval: string | null | undefined): boolean => {
    return IIntervals.some((i: IInterval) => i.interval === interval);
}

/**
 * Retorna los intervalos válidos del sistema en diferentes formatos según el parámetro especificado.
 *
 * Proporciona flexibilidad para obtener la lista de intervalos permitidos ya sea como una cadena
 * de texto simple separada por comas (útil para mensajes de error o ayuda), o como un arreglo de
 * objetos estructurados con información detallada de cada intervalo.
 *
 * @param {boolean} [simple=true] - Indica el formato de salida:
 *                                  - true: retorna una cadena con códigos separados por comas
 *                                  - false: retorna un array de objetos con nombre e interval
 * @returns {string | Array<{nombre: string, interval: string}>} String con intervalos separados por comas
 *                                                                 cuando simple=true, o array de objetos
 *                                                                 con propiedades nombre e interval
 *                                                                 cuando simple=false
 *
 * @example
 * // Formato simple (cadena de texto)
 * validIntervals(true) // "001m, 001h, 001d"
 * validIntervals() // "001m, 001h, 001d" (por defecto simple=true)
 *
 * @example
 * // Formato completo (array de objetos)
 * validIntervals(false)
 * // [
 * //   { nombre: "1 minuto", interval: "001m" },
 * //   { nombre: "1 hora", interval: "001h" },
 * //   { nombre: "1 día", interval: "001d" }
 * // ]
 */
export const validIntervals = (simple: boolean = true) => {
    return simple
        ? IIntervals.map(i => i.interval).join(', ')
        : IIntervals.map(i => ({ nombre: i.nombre, interval: i.interval }));
}

/**
 * Valida que un código de intervalo proporcionado sea válido y esté definido en el sistema.
 *
 * Realiza dos verificaciones fundamentales:
 * 1. Comprueba que el intervalo no sea el valor constante NONE (sin especificar)
 * 2. Verifica que el código del intervalo exista en la lista de intervalos permitidos (IIntervals)
 *
 * Si alguna validación falla, interrumpe la ejecución lanzando un error descriptivo que incluye
 * información sobre los intervalos válidos disponibles.
 *
 * @param {string} interval - Código del intervalo a validar (ej: '001m', '001h', '001d')
 * @returns {boolean} true si el intervalo es válido y existe en la lista de intervalos permitidos
 * @throws {Error} Si el intervalo es NONE (constante que indica no especificado)
 * @throws {Error} Si el intervalo no existe en la lista de intervalos válidos, incluyendo
 *                 en el mensaje la lista completa de intervalos permitidos
 *
 * @example
 * // Validación exitosa
 * validateIntervals('001m') // true
 * validateIntervals('001h') // true
 *
 * @example
 * // Validación fallida - intervalo no especificado
 * validateIntervals(NONE)
 * // Lanza Error: "No se ha especificado un intervalo"
 *
 * @example
 * // Validación fallida - intervalo inválido
 * validateIntervals('invalid')
 * // Lanza Error: "El intervalo 'invalid' no es válido. Los intervalos válidas son: 001m, 001h, 001d"
 */
export const validateIntervals = (interval: string): boolean => {
    if (interval === NONE) {
        throw new Error("No se ha especificado un intervalo");
    }

    if (!reviewInterval(interval)) {
        throw new Error(`El intervalo '${interval}' no es válido. Los intervalos válidas son: ${IIntervals.map(i => i.interval).join(', ')}`);
    }
    return true;
}

/**
 * Crea una instancia de tabla ASCII con formato predefinido para mostrar información de intervalos.
 *
 * Configura una tabla visual utilizando la biblioteca cli-table3 con las siguientes características:
 * - Encabezados: "nombre" e "interval" con formato en negrita
 * - Anchos de columna fijos: 28 caracteres cada una
 * - Caracteres de borde: estilo Unicode con líneas y esquinas (─│┌┐└┘├┤┬┴┼)
 * - Alineación: texto a la izquierda para nombres, centrado para códigos de intervalo
 *
 * Esta función es de uso interno y sirve como base para generar tablas de intervalos
 * que serán pobladas con datos posteriormente.
 *
 * @returns {Table} Instancia de tabla cli-table3 configurada con formato ASCII, lista para
 *                  recibir datos mediante el método push()
 *
 * @example
 * const table = createAsciiIntervalsTable();
 * table.push(['1 minuto', '001m']);
 * table.push(['1 hora', '001h']);
 * console.log(table.toString());
 * // ┌──────────────────────────┬──────────────────────────┐
 * // │ nombre                   │         interval         │
 * // ├──────────────────────────┼──────────────────────────┤
 * // │ 1 minuto                 │          001m            │
 * // │ 1 hora                   │          001h            │
 * // └──────────────────────────┴──────────────────────────┘
 */
const createAsciiIntervalsTable = () => {
    return new Table({
        head: [
            chalk.bold.black("nombre"),
            chalk.bold.black("interval"),
        ],
        colWidths: [28, 28],
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        },
        colAligns: ["left", "center"]
    });
};


/**
 * Genera una tabla ASCII formateada con todos los intervalos disponibles en el sistema AirVisio.
 *
 * Crea una representación visual tabular que enumera todos los intervalos válidos definidos
 * en la constante IIntervals. Cada fila contiene:
 * - El nombre descriptivo del intervalo (ej: "1 minuto", "1 hora")
 * - El código del intervalo formateado en negrita y color rojo (ej: "001m", "001h")
 *
 * La tabla utiliza caracteres Unicode para crear bordes estilo ASCII art, proporcionando
 * una salida clara y visualmente atractiva para la consola.
 *
 * @returns {Table} Instancia de tabla cli-table3 poblada con todos los intervalos del sistema,
 *                  lista para ser convertida a string mediante toString() y mostrada en consola
 *
 * @example
 * const table = intervalTable();
 * console.log(table.toString());
 * // Salida:
 * // ┌──────────────────────────┬──────────────────────────┐
 * // │ nombre                   │         interval         │
 * // ├──────────────────────────┼──────────────────────────┤
 * // │ 1 minuto                 │          001m            │
 * // │ 1 hora                   │          001h            │
 * // │ 1 día                    │          001d            │
 * // └──────────────────────────┴──────────────────────────┘
 *
 * @example
 * // Uso en mensajes de ayuda
 * console.log('Intervalos disponibles:');
 * console.log(intervalTable().toString());
 */
export const intervalTable = () => {
    const table = createAsciiIntervalsTable();
    IIntervals.forEach(i => {
        table.push([i.nombre, chalk.bold.red(i.interval)])
    })
    return table;
}

/**
 * Muestra un mensaje de ayuda formateado con información sobre los intervalos disponibles en AirVisio.
 *
 * Genera y presenta en consola una guía completa que incluye:
 * - Un encabezado descriptivo sobre intervalos aceptados
 * - Una tabla ASCII con todos los intervalos válidos del sistema (usando intervalTable())
 * - Leyenda explicativa de las columnas (nombre e interval)
 * - Instrucciones de uso con las opciones de línea de comandos (-I y --interval=)
 * - Ejemplos prácticos de comandos con intervalos
 *
 * El mensaje se colorea utilizando chalk para mejorar la legibilidad, con azul para
 * instrucciones y ejemplos, y rojo para códigos de intervalo en la tabla.
 *
 * @param {TConsoleMessageType} [msgType=INFO_MESSAGE] - Tipo de mensaje para el sistema de consola.
 *                                                        Define el nivel de logging (info, warning, error, etc.).
 *                                                        Por defecto usa INFO_MESSAGE para mensajes informativos
 * @returns {void} No retorna valor, imprime directamente en consola
 *
 * @example
 * // Mostrar ayuda con nivel de información por defecto
 * intervalsHelp();
 * // Salida en consola:
 * // -----
 * // Intervalos aceptados en la línea de comandos
 * // ┌──────────────────────────┬──────────────────────────┐
 * // │ nombre                   │         interval         │
 * // ├──────────────────────────┼──────────────────────────┤
 * // │ 1 minuto                 │          001m            │
 * // │ 1 hora                   │          001h            │
 * // │ 1 día                    │          001d            │
 * // └──────────────────────────┴──────────────────────────┘
 * //  nombre   .- Nombre del intervalo
 * //  interval .- Código del intervalo en el sistema AirVisio
 * //
 * //  Los intervalos se especifican con '-I ' o con '--interval='
 * //    seguido de un solo 'código interval'.
 * //
 * // Ejemplos:
 * //
 * // $ loader2 fromAirVisio --interval=001m
 * //
 * // $ loader2 fromAirVisio -I 001m
 *
 * @example
 * // Mostrar ayuda con nivel de advertencia personalizado
 * import { WARNING_MESSAGE } from "../commons/console.js";
 * intervalsHelp(WARNING_MESSAGE);
 */
export const intervalsHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const messages = [
        '\n-----',
        chalk.rgb(0, 0, 139).bold('Intervalos aceptados en la línea de comandos'),
        intervalTable().toString(),
        chalk.black.bold(' nombre   .- Nombre del intervalo'),
        chalk.black.bold(' interval .- Código del intervalo en el sistema AirVisio'),
        chalk.blue("\n Los intervalos se especifican con '-I ' o con '--interval='"),
        chalk.blue("   seguido de un solo 'código interval'.\n"),
        chalk.blue("\nEjemplos:\n\n$ ") + chalk.bold("loader2 fromAirVisio --interval=001m"),
        chalk.blue("\n$ ") + chalk.bold("loader2 fromAirVisio -I 001m\n")
    ];

    fnConsole(msgType)(messages.join('\n'));
}
