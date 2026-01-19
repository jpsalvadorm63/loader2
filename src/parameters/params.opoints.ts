import {
    ALL,
    NONE,
    OPOINTS
} from "./configs/params.constants.js";

import {
    IOpoint
} from "./configs/params.interfaces.js";

import chalk from "chalk";

import Table from "cli-table3";

import {
    ERROR_MESSAGE,
    INFO_MESSAGE,
    TConsoleMessageType
} from "../commons/console.js";

import {
    fnConsole
} from "../commons/console.js";



/**
 * Verifica si un punto de observación específico es válido
 * @param opoint - Cadena que representa el punto de observación a verificar
 * @returns true si el punto de observación es válido, false en caso contrario
 */
export const reviewOpoint = (opoint: string): boolean => {
    return OPOINTS.some((o : IOpoint) => o.airVisio === opoint);
}


/** Representa un punto de observación con nombre y código airVisio */
type OpointSummary = Pick<IOpoint, 'nombre' | 'airVisio'>;

/**
 * Obtiene una lista simple de códigos airVisio de todos los puntos de observación
 * @returns Array de strings con los códigos airVisio
 */
export function getSimpleOpoints(): string[] {
    return OPOINTS.map((o: IOpoint) => o.airVisio);
}

/**
 * Obtiene una lista detallada con nombre y código airVisio de todos los puntos de observación
 * @returns Array de objetos OpointSummary con nombre y airVisio
 */
export function getDetailedOpoints(): OpointSummary[] {
    return OPOINTS.map((o: IOpoint): OpointSummary => ({
        nombre: o.nombre,
        airVisio: o.airVisio,
    }));
}

/**
 * Convierte una cadena de puntos de observación en un array de códigos airVisio válidos
 *
 * @param {string | null} opoints - Cadena con puntos de observación separados por comas, 'ALL' para todas las magnitudes, NONE, cadena vacía o null
 * @returns {string[]} Array de strings con los códigos airVisio de los puntos de observación válidos
 * @throws {Error} Termina el proceso con código 1 si la entrada es inválida o algún punto no es reconocido
 */
export const opoints2array = (opoints: string | null): string[] => {
    const exitWithError = (message: string) => {
        fnConsole(ERROR_MESSAGE)(message);
        process.exit(1);
    };

    if (!opoints || opoints === NONE || opoints === '') {
        exitWithError(`ERROR: No se ha especificado uno o más puntos de observación separadas por coma. Un subconjunto de ${getSimpleOpoints()}`);
    }

    if (opoints === ALL) {
        const result = getSimpleOpoints();
        console.log('Se utilizarán todos los puntos de observación válidos : ', result);
        return result;
    }

    const normalizedOpoints = (!opoints)?[]:opoints
        .split(',')
        .map(o => o.trim())
        .filter(o => o.length > 0);

    const invalidOpoint = normalizedOpoints.find(opoint => !reviewOpoint(opoint));
    if (invalidOpoint) {
        exitWithError(`El punto de observación '${invalidOpoint}' no es válido. Las estaciones válidas son: ${getSimpleOpoints().join(',')}`);
    }
    console.log('....Puntos de observación válidos procesados: ', normalizedOpoints);
    return normalizedOpoints;
};

/**
 * Valida que los puntos de observación especificados sean correctos y existan en la lista de puntos permitidos
 * @param {string | null} opoints - Cadena con uno o más códigos de puntos de observación separados por comas, o ALL para todos
 * @returns {boolean} true si todos los puntos de observación son válidos
 */
export const validateOpoints = (opoints: string | null): boolean => {
    return opoints2array(opoints).length > 0;
};

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
    colWidths: [20, 20, 8], // ancho de columnas
    chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
    },
    colAligns: ["left", "center", "center"] // alineación por columna
});

/**
 * Genera una tabla con información de los puntos de observación disponibles o estaciones
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
    myConsole(chalk.blue("\nEjemplos:\n\n$ "), chalk.bold("loader2 fromAirVisio --estaciones=\"Belizario,Carapungo,Centro\""))
    myConsole(chalk.blue("\n$ "), chalk.bold("loader2 fromAirVisio -E \"Belizario,Carapungo,Centro\"\n"))
}
