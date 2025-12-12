import {
    ALLPARAM,
    NONEPARAM,
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
} from "./configs/commons.js";

import {
    fnConsole
} from "./configs/commons.js";


/**
 * Verifica si un intervalo dado existe en la lista de intervalos válidos.
 * @param {string} interval - Código del intervalo a verificar
 * @returns {boolean} true si el intervalo existe en la lista, false en caso contrario
 */
export const reviewInterval = (interval: string): boolean => {
    return IIntervals.some((i : IInterval) => i.interval === interval);
}

/**
 * Obtiene la lista de intervalos válidos en formato simple o detallado.
 * @param {boolean} simple - Si es true, retorna una cadena de códigos separados por comas; si es false, retorna un array de objetos con nombre e interval
 * @returns {string | Array<{nombre: string, interval: string}>} Lista de intervalos en el formato especificado
 */
export const validIntervals = (simple: boolean = true) => {
    return simple
        ? IIntervals.map(i => i.interval).join(', ')
        : IIntervals.map(i => ({nombre: i.nombre, interval: i.interval}));
}

/**
 * Valida que un intervalo sea correcto y exista en la lista de intervalos permitidos.
 * @param {string} interval - Código del intervalo a validar
 * @returns {boolean} true si el intervalo es válido
 * @throws {Error} Si no se especificó un intervalo o si el intervalo no es válido
 */
export const validateIntervals = (interval: string): boolean => {
    if (interval === NONEPARAM) {
        throw new Error("No se ha especificado un intervalo");
    }

    if(!reviewInterval(interval)) {
        throw new Error(`El intervalo '${interval}' no es válido. Los intervalos válidas son: ${IIntervals.map(i => i.interval).join(', ')}`);
    }
    return true;
}

/**
 * Tabla configurada con formato específico para mostrar información de intervalos.
 * Incluye encabezados, anchos de columna, caracteres de borde y alineación.
 */
const table = new Table({
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

/**
 * Genera una tabla formateada con todos los intervalos disponibles.
 * @returns {Table} Tabla con los nombres y códigos de intervalos
 */
export const intervalTable = () => {
    IIntervals.forEach(i => {
        table.push([i.nombre, chalk.bold.red(i.interval)])
    })
    return table;
}

/**
 * Muestra ayuda en consola sobre los intervalos disponibles y cómo usarlos en la línea de comandos.
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola (por defecto INFO_MESSAGE)
 */
export const intervalsHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    myConsole('\n-----')
    myConsole(chalk.rgb(0, 0, 139).bold('Intervalos aceptados en la línea de comandos'))
    myConsole(intervalTable().toString())
    myConsole(chalk.black.bold(' nombre   .- Nombre de la estación'))
    myConsole(chalk.black.bold(' interval .- Código del intervalo en el sistema AirVisio'))
    myConsole(chalk.blue("\n Las magnitudes se especifican con '-I ' o con '--interval='"))
    myConsole(chalk.blue("   seguido de un solo 'código interval'.\n"))
    myConsole(chalk.blue("\nEjemplos:\n\n$ "), chalk.bold("loader2 fromAirVisio --interval=001m"))
    myConsole(chalk.blue("\n$ "), chalk.bold("loader2 fromAirVisio -I 001m\n"))
}