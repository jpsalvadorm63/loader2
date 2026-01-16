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
 * Obtiene la lista de magnitudes válidas disponibles en el sistema
 *
 * Esta función sobrecargada puede retornar las magnitudes en formato simple (solo códigos airVisio)
 * o en formato completo (objetos con nombre y código airVisio).
 *
 * @param {true} [simple] - Si es true o no se especifica, retorna array de strings con códigos airVisio
 * @returns {string[]} Array de códigos airVisio cuando simple es true
 *
 * @overload
 * @param {false} simple - Si es false, retorna array de objetos con nombre y código airVisio
 * @returns {{ nombre: string; airVisio: string }[]} Array de objetos con información completa de magnitudes
 *
 * @example
 * // Retorna array simple de códigos: ['PM2.5_ug', 'TEMP_AMB', 'DIR_VEC', ...]
 * validMagnitudes()
 * validMagnitudes(true)
 *
 * @example
 * // Retorna array de objetos con información completa:
 * // [{ nombre: 'Partículas PM2.5', airVisio: 'PM2.5_ug' }, ...]
 * validMagnitudes(false)
 */
export function validMagnitudes(simple?: true): string[];
export function validMagnitudes(simple: false): { nombre: string; airVisio: string }[];
export function validMagnitudes(simple: boolean = true): string[] | { nombre: string; airVisio: string }[] {
    return simple
        ? MAGNITUDES.map(m => m.airVisio)
        : MAGNITUDES.map(m => ({nombre: m.nombre, airVisio: m.airVisio}));
}

/**
 * Convierte una cadena de magnitudes en un array de códigos de magnitudes válidos
 * @param magnitudes - Cadena con magnitudes separadas por comas, 'ALL' para todas las magnitudes, o null
 * @returns Array de códigos de magnitudes válidos en formato airVisio
 * @throws {Error} Termina el proceso si no se especifican magnitudes válidas
 * @example
 * // Retorna todas las magnitudes disponibles
 * magnitudes2array('ALL')
 *
 * @example
 * // Retorna array con magnitudes específicas
 * magnitudes2array('PM2.5_ug,TEMP_AMB,DIR_VEC')
 * // Retorna: ['PM2.5_ug', 'TEMP_AMB', 'DIR_VEC']
 *
 * @example
 * // Error si no se especifica ninguna magnitud
 * magnitudes2array(null)
 * // Termina el proceso con código de error 1
 *
 * @example
 * // Error si se especifica una magnitud inválida
 * magnitudes2array('PM2.5_ug,INVALIDA')
 * // Muestra error y termina el proceso con código de error 1
 */
export const magnitudes2array = (magnitudes: string | null): string[] => {
    if (!magnitudes || magnitudes === NONE || magnitudes === '') {
        fnConsole(ERROR_MESSAGE)(`ERROR: No se ha especificado uno o más magnitudes separadas por coma. Un subconjunto de ${validMagnitudes()}`);
        process.exit(1);
    }
    if (magnitudes === ALL) {
        return validMagnitudes(true);
    }
    
    const inputMagnitudes = magnitudes.split(',').map(m => m.trim()).filter(m => m.length > 0);

    inputMagnitudes.forEach((magnitude: string) => {
        if (!reviewMagnitude(magnitude)) {
            fnConsole(ERROR_MESSAGE)(`La magnitud '${magnitude}' no es válida. Las magnitudes válidas son: ${validMagnitudes().join(',')}`);
            process.exit(1);
        }
    });

    return inputMagnitudes;
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
