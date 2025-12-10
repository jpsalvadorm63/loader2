import {
    ALLPARAM,
    NONEPARAM,
    OPOINTS
} from "./params.constants.js";

import {
    IOpoint
} from "./params.interfaces.js";

import chalk from "chalk";
import Table from "cli-table3";
import {INFO_MESSAGE, TConsoleMessageType} from "./commons.js";
import {fnConsole} from "./commons.js";
import {magnitudesTable, reviewMagnitude} from "./params.magnitudes.js";


/**
 * Verifica si un punto de observación específico es válido
 * @param opoint - Cadena que representa el punto de observación a verificar
 * @returns true si el punto de observación es válido, false en caso contrario
 */
export const reviewOpoint = (opoint: string): boolean => {
    return OPOINTS.some((o : IOpoint) => o.airVisio === opoint);
}


/**
 * Obtiene la lista de puntos de observación válidos
 * @param simple - Si es true, devuelve solo los códigos airVisio. Si es false, devuelve objetos con nombre y código
 * @returns Array de puntos de observación en formato simple o detallado
 */
export const validOpoints = (simple: boolean = true) => {
    return simple
        ? OPOINTS.map(m => m.airVisio).join(', ')
        : OPOINTS.map(m => ({nombre: m.nombre, airVisio: m.airVisio}));
}

/**
 * Verifica si una lista de puntos de observación separados por comas es válida
 * @param opoints - Cadena de puntos de observación separados por comas
 * @returns true si todos los puntos de observación son válidos
 * @throws Error si algún punto de observación no es válido o si no se especifica ninguno
 */
export const validateOpoints = (opoints: string): boolean => {
    if (opoints === NONEPARAM) {
        throw new Error("No se ha especificado uno o más magnitudes separadas por coma");
    }
    if (opoints === ALLPARAM) {
        return true
    }
    opoints.split(',').forEach((opoint : string) => {
        if(!reviewMagnitude(opoint)) {
            throw new Error(`La magnitud '${opoint}' no es válida. Las estaciones válidas son: ${OPOINTS.map(m => m.airVisio).join(', ')}`);
        }
    })
    return true;
}

/**
 * Configuración de la tabla para mostrar información de puntos de observación
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
    chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
    },
    colAligns: ["left", "center", "center"] // alineación por columna
});

/**
 * Genera una tabla con información de los puntos de observación disponibles
 * @returns Objeto Table con los puntos de observación formateados (nombre, código airVisio y código visor)
 */
export const opointsTable = () => {
    OPOINTS.forEach(m => {
        table.push([m.nombre, chalk.bold.red(m.airVisio), m.visor])
    })
    return table;
}

/**
 * Muestra la ayuda sobre los puntos de observación disponibles y cómo especificarlos
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola a utilizar (por defecto INFO_MESSAGE)
 */
export const opointsHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    myConsole('\n-----')
    myConsole(chalk.rgb(0, 0, 139).bold('Magnitudes aceptadas en la línea de comandos'))
    myConsole(opointsTable().toString())
    myConsole(chalk.black.bold(' nombre   .- Nombre de la estación'))
    myConsole(chalk.black.bold(' airVisio .- Código de la estación en el sistema AirVisio'))
    myConsole(chalk.black.bold(' visor    .- Código de la estación en el sistema RemmaqVisor'))
    myConsole(chalk.blue("\n Las magnitudes se especifican con '-E ' o con '--estaciones='"))
    myConsole(chalk.blue("   seguido de una lista de 'códigos airVisio' separados por comas.\n"))
    myConsole(chalk.blue("\nEjemplos:\n\n$ "), chalk.bold("loader2 fromAirVisio --estaciones=Belizario,Carapungo,Centro"))
    myConsole(chalk.blue("\n$ "), chalk.bold("loader2 fromAirVisio -E Belizario,Carapungo,Centro\n"))
}
