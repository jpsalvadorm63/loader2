import {
    // ALLPARAM,
    NONE,
    IIntervals
} from "./configs/params.constants.js";

import {
    IInterval
} from "./configs/params.interfaces.js";

import chalk from "chalk";

import Table from "cli-table3";

import {
    INFO_MESSAGE,
    TConsoleMessageType
} from "../commons/console.js";

import {
    fnConsole
} from "../commons/console.js";


/**
 * Verifica si un intervalo dado existe en la lista de intervalos válidos.
 *
 * @param {string} interval - Código del intervalo a verificar
 * @returns {boolean} true si el intervalo existe en la lista, false en caso contrario
 *
 * @example
 * reviewInterval('001m') // true
 * reviewInterval('invalid') // false
 */
export const reviewInterval = (interval: string): boolean => {
    return IIntervals.some((i : IInterval) => i.interval === interval);
}

/**
 * Obtiene la lista de intervalos válidos en formato simple o detallado.
 *
 * @param {boolean} simple - Si es true, retorna una cadena de códigos separados por comas;
 *                           si es false, retorna un array de objetos con nombre e interval.
 * @returns {string | Array<{nombre: string, interval: string}>} Lista de intervalos en el formato especificado
 *
 * @example
 * validIntervals(true) // "001m, 001h"
 * validIntervals(false) // [{nombre: 'Promedio x minuto', interval: '001m'}, ...]
 */
export const validIntervals = (simple: boolean = true) => {
    return simple
        ? IIntervals.map(i => i.interval).join(', ')
        : IIntervals.map(i => ({nombre: i.nombre, interval: i.interval}));
}

/**
 * Valida que un intervalo sea correcto y exista en la lista de intervalos permitidos.
 *
 * @param {string} interval - Código del intervalo a validar
 * @returns {boolean} true si el intervalo es válido
 * @throws {Error} Si no se especificó un intervalo o si el intervalo no es válido
 *
 * @example
 * validateIntervals('001m') // true
 * validateIntervals('NONE') // Lanza Error
 */
export const validateIntervals = (interval: string): boolean => {
    if (interval === NONE) {
        throw new Error("No se ha especificado un intervalo");
    }

    if(!reviewInterval(interval)) {
        throw new Error(`El intervalo '${interval}' no es válido. Los intervalos válidas son: ${IIntervals.map(i => i.interval).join(', ')}`);
    }
    return true;
}

/**
 * Configuración de la tabla para mostrar información de intervalos.
 *
 * @returns {Table} Instancia de tabla cli-table3 configurada con encabezados y estilos
 */
const createAsciiIntervalsTable = () => {
    return new Table({
        head: [
            chalk.bold.black("nombre"),
            chalk.bold.black("interval"),
        ],
        colWidths: [28, 28], // ancho de columnas
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        },
        colAligns: ["left", "center"] // alineación por columna
    });
};

/**
 * Genera una tabla ASCII formateada con todos los intervalos disponibles.
 *
 * @returns {Table} Instancia de tabla cli-table3 poblada con los intervalos,
 *                  incluyendo nombre y código de intervalo
 */
export const intervalTable = () => {
    const table = createAsciiIntervalsTable();
    IIntervals.forEach(i => {
        table.push([i.nombre, chalk.bold.red(i.interval)])
    })
    return table;
}

/**
 * Muestra información de ayuda sobre los intervalos aceptados en la línea de comandos.
 *
 * Esta función genera y muestra en consola una ayuda completa sobre los intervalos disponibles,
 * incluyendo una tabla formateada y ejemplos de uso.
 *
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola a utilizar (por defecto INFO_MESSAGE)
 * @returns {void}
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