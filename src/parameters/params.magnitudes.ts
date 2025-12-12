import {
    ALLPARAM,
    NONEPARAM,
    MAGNITUDES,
} from "./configs/params.constants.js";

import {
    IMagnitude,
} from "./configs/params.interfaces.js";

import chalk from "chalk";

import Table from "cli-table3";

import {
    INFO_MESSAGE,
    TConsoleMessageType
} from "../commons/commons.js";

import {fnConsole} from "../commons/commons.js";


/**
 * Verifica si una magnitud específica es válida
 * @param magnitude - Cadena que representa la magnitud a verificar
 * @returns true si la magnitud es válida, false en caso contrario
 */
export const reviewMagnitude = (magnitude: string): boolean => {
    return MAGNITUDES.some((m : IMagnitude) => m.airVisio === magnitude);
}

/**
 * Obtiene la lista de magnitudes válidas
 * @param simple - Si es true, devuelve solo los códigos airVisio. Si es false, devuelve objetos con nombre y código
 * @returns Array de magnitudes en formato simple o detallado
 */
export const validMagnitudes = (simple: boolean = true) => {
    return simple
        ? MAGNITUDES.map(m => m.airVisio).join(', ')
        : MAGNITUDES.map(m => ({nombre: m.nombre, airVisio: m.airVisio}));
}

/**
 * Verifica si una lista de magnitudes separadas por comas es válida
 * @param magnitudes - Cadena de magnitudes separadas por comas
 * @returns true si todas las magnitudes son válidas
 * @throws Error si alguna magnitud no es válida o si no se especifica ninguna
 */
export const validateMagnitudes = (magnitudes: string): boolean => {
    if (magnitudes === NONEPARAM) {
        throw new Error("No se ha especificado uno o más magnitudes separadas por coma");
    }
    if (magnitudes === ALLPARAM) {
        return true
    }
    magnitudes.split(',').forEach((magnitude : string) => {
        if(!reviewMagnitude(magnitude)) {
            throw new Error(`La magnitud '${magnitude}' no es válida. Las magnitudes válidas son: ${MAGNITUDES.map(m => m.airVisio).join(', ')}`);
        }
    })
    return true;
}

/**
 * Configuración de la tabla para mostrar información de magnitudes
 * @property {Array} head - Encabezados de las columnas (nombre, airVisio, visor)
 * @property {Array} colWidths - Ancho de cada columna en caracteres
 * @property {Object} chars - Caracteres utilizados para dibujar los bordes de la tabla
 * @property {Array} colAligns - Alineación del texto en cada columna
 */
const table = new Table({
    head: [
        chalk.bold.black("nombre"),
        chalk.bold.black("airVisio"),
        chalk.bold.black("visor")
    ],
    colWidths: [28, 10, 8], // ancho de columnas
    // style: {
    //     head: ['white'], // desactiva estilos automáticos
    //     // border: chalk.magenta // color de los bordes
    // },
    chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
    },
    colAligns: ["left", "center", "center"] // alineación por columna
});

/**
 * Genera una tabla con información de las magnitudes disponibles
 * @returns Objeto Table con las magnitudes formateadas (nombre, código airVisio y código visor)
 */
export const magnitudesTable = () => {
    MAGNITUDES.forEach(m => {
        table.push([m.nombre, chalk.bold.red(m.airVisio), m.visor])
    })
    return table;
}

/**
 * Muestra la ayuda sobre las magnitudes disponibles y cómo especificarlas
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola a utilizar (por defecto INFO_MESSAGE)
 */
export const magnitudesHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    myConsole('\n-----')
    myConsole(chalk.rgb(0, 0, 139).bold('Magnitudes aceptadas en la línea de comandos'))
    myConsole(magnitudesTable().toString())
    myConsole(chalk.black.bold(' nombre   .- Nombre de la magnitud'))
    myConsole(chalk.black.bold(' airVisio .- Código de la magnitud en el sistema AirVisio'))
    myConsole(chalk.black.bold(' visor    .- Código de la magnitud en el sistema RemmaqVisor'))
    myConsole(chalk.blue("\n Las magnitudes se especifican con '-M ' o con '--magnitudes='"))
    myConsole(chalk.blue("   seguido de una lista de'códigos airVisio' separados por comas.\n"))
    myConsole(chalk.blue("\nEjemplos:\n\n$ "), chalk.bold("loader2 fromAirVisio --magnitudes=PM2.5_ug,TEMP_AMB,DIR_VEC"))
    myConsole(chalk.blue("\n$ "), chalk.bold("loader2 fromAirVisio -M PM2.5_ug,TEMP_AMB,DIR_VEC\n"))
}