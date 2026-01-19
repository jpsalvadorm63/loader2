import {
    ALL,
    NONE,
    MAGNITUDES,
} from "./configs/params.constants.js";

import {
    IMagnitude,
} from "./configs/params.interfaces.js";

import chalk from "chalk";

import Table from "cli-table3";

import {
    ERROR_MESSAGE,
    INFO_MESSAGE,
    TConsoleMessageType
} from "../commons/console.js";

import {fnConsole} from "../commons/console.js";

/**
 * Verifica si una magnitud específica es válida
 * @param magnitude - Cadena que representa la magnitud a verificar
 * @returns true si la magnitud es válida, false en caso contrario
 */
export const reviewMagnitude = (magnitude: string): boolean => {
    return MAGNITUDES.some((m : IMagnitude) => m.airVisio === magnitude);
}

/**
 * Obtiene una lista simple de códigos airVisio de todas las magnitudes
 * @returns Array de strings con los códigos airVisio
 */
export function getSimpleMagnitudes(): string[] {
    return MAGNITUDES.map(({ airVisio }) => airVisio);
}

/** Representa una magnitud con nombre y código airVisio */
type MagnitudeSummary = Pick<IMagnitude, 'nombre' | 'airVisio'>;

/**
 * Obtiene una lista detallada con nombre y código airVisio de todas las magnitudes
 * @returns Array de objetos MagnitudeSummary con nombre y airVisio
 */
export function getDetailedMagnitudes(): MagnitudeSummary[] {
    return MAGNITUDES.map(({nombre, airVisio}): MagnitudeSummary => ({nombre, airVisio,}));
}

/**
 * Convierte una cadena de magnitudes en un array de códigos airVisio válidos
 *
 * Esta función procesa una cadena que contiene magnitudes separadas por comas,
 * valida que todas sean magnitudes reconocidas en el sistema, y retorna un array
 * con los códigos airVisio correspondientes. Si se especifica 'ALL', retorna todas
 * las magnitudes disponibles. Si la entrada es inválida, termina el proceso con error.
 *
 * @param {string | null} magnitudes - Cadena con magnitudes separadas por comas,
 *                                      'ALL' para todas las magnitudes, NONE, cadena vacía o null
 * @returns {string[]} Array de strings con los códigos airVisio de las magnitudes válidas
 *
 * @throws {Error} Termina el proceso con código 1 si:
 *                 - No se especifica ninguna magnitud (null, NONE o cadena vacía)
 *                 - Se incluye una magnitud no válida en la lista
 *
 * @example
 * // Uso con magnitudes específicas válidas
 * magnitudes2array('PM2.5_ug,TEMP_AMB')
 * // Retorna: ['PM2.5_ug', 'TEMP_AMB']
 *
 * @example
 * // Uso con 'ALL' para obtener todas las magnitudes
 * magnitudes2array('ALL')
 * // Muestra mensaje en consola y retorna: ['PM2.5_ug', 'TEMP_AMB', 'DIR_VEC', ...]
 *
 * @example
 * // Uso con magnitudes con espacios (se normalizan)
 * magnitudes2array(' PM2.5_ug , TEMP_AMB ')
 * // Retorna: ['PM2.5_ug', 'TEMP_AMB']
 *
 * @example
 * // Error: entrada vacía o null
 * magnitudes2array(null)
 * // Muestra error y termina proceso: "ERROR: No se ha especificado uno o más magnitudes..."
 *
 * @example
 * // Error: magnitud no válida
 * magnitudes2array('PM2.5_ug,INVALID_MAG')
 * // Muestra error y termina proceso: "La magnitud 'INVALID_MAG' no es válida..."
 *
 * @see reviewMagnitude Para validar una magnitud individual
 * @see getSimpleMagnitudes Para obtener la lista completa de magnitudes válidas
 */
export const magnitudes2array = (magnitudes: string | null): string[] => {
    const exitWithError = (message: string) => {
        fnConsole(ERROR_MESSAGE)(message);
        process.exit(1);
    };

    if (!magnitudes || magnitudes === NONE || magnitudes === '') {
        exitWithError(`ERROR: No se ha especificado uno o más magnitudes separadas por coma. Un subconjunto de ${getSimpleMagnitudes()}`);
    }

    if (magnitudes === ALL) {
        const result = getSimpleMagnitudes();
        return result;
    }

    const normalizedMagnitudes = (!magnitudes)?[]:magnitudes
        .split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0);

    const invalidMagnitude = normalizedMagnitudes.find(magnitude => !reviewMagnitude(magnitude));
    if (invalidMagnitude) {
        exitWithError(`La magnitud '${invalidMagnitude}' no es válida. Las magnitudes válidas son: ${getSimpleMagnitudes().join(',')}`);
    }
    return normalizedMagnitudes;
};

/**
 * Valida que una cadena de magnitudes resulte en al menos una magnitud válida
 *
 * Esta función utiliza `magnitudes2array` para convertir y validar la cadena de entrada,
 * y verifica que el resultado contenga al menos una magnitud válida.
 *
 * @param {string | null} magnitudes - Cadena con magnitudes separadas por comas, 'ALL' para todas las magnitudes, o null
 * @returns {boolean} true si hay al menos una magnitud válida, false en caso contrario
 *
 * @example
 * // Valida magnitudes específicas
 * validateMagnitudes('PM2.5_ug,TEMP_AMB')
 * // Retorna: true
 *
 * @example
 * // Valida con 'ALL' (todas las magnitudes)
 * validateMagnitudes('ALL')
 * // Retorna: true
 *
 * @example
 * // Valida cadena vacía o null
 * validateMagnitudes(null)
 * // El proceso termina con error antes de retornar debido a magnitudes2array
 *
 * @see magnitudes2array Para más detalles sobre el procesamiento de la cadena de magnitudes
 */
export const validateMagnitudes = (magnitudes: string | null): boolean => {
    return magnitudes2array(magnitudes).length > 0;
};

/**
 * Crea y configura una nueva instancia de tabla para mostrar información de magnitudes
 * @returns Instancia de Table configurada
 */
const createMagnitudesTable = () => {
    return new Table({
        head: [
            chalk.bold.black("nombre"),
            chalk.bold.black("airVisio"),
            chalk.bold.black("visor")
        ],
        colWidths: [28, 10, 8],
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        },
        colAligns: ["left", "center", "center"]
    });
};

/**
 * Genera una tabla con información de las magnitudes disponibles
 * @returns Objeto Table con las magnitudes formateadas (nombre, código airVisio y código visor)
 */
export const magnitudesTable = () => {
    const table = createMagnitudesTable();
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
    // Agrupar mensajes relacionados y reducir llamadas
    const messages = [
        '\n-----',
        chalk.rgb(0, 0, 139).bold('Magnitudes aceptadas en la línea de comandos'),
        magnitudesTable().toString(),
        chalk.black.bold(' nombre   .- Nombre de la magnitud'),
        chalk.black.bold(' airVisio .- Código de la magnitud en el sistema AirVisio'),
        chalk.black.bold(' visor    .- Código de la magnitud en el sistema RemmaqVisor'),
        chalk.blue("\n Las magnitudes se especifican con '-M ' o con '--magnitudes='"),
        chalk.blue("   seguido de una lista de 'códigos airVisio' separados por comas.\n"),
        chalk.blue("\nEjemplos:\n\n$ ") + chalk.bold("loader2 fromAirVisio --magnitudes=\"PM2.5_ug,TEMP_AMB,DIR_VEC\""),
        chalk.blue("\n$ ") + chalk.bold("loader2 fromAirVisio -M \"PM2.5_ug,TEMP_AMB,DIR_VEC\"\n")
    ];

    fnConsole(msgType)(messages.join('\n'));
}
