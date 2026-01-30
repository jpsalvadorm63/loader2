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
 * Verifica si un código de estación airVisio es válido
 *
 * Busca el código proporcionado en la lista oficial de estaciones de monitoreo
 * configuradas en el sistema.
 *
 * @param {string | null | undefined} opoint - Código airVisio de la estación a verificar
 * @returns {boolean} true si la estación existe y es válida, false en caso contrario
 *
 * @example
 * // Verificar estación válida
 * reviewOpoint('Belisario')
 * // Retorna: true
 *
 * @example
 * // Verificar estación inválida
 * reviewOpoint('ESTACION_FANTASMA')
 * // Retorna: false
 *
 * @example
 * reviewOpoint(null) // false
 * reviewOpoint(undefined) // false
 *
 * @see OPOINTS Para ver la lista completa de estaciones disponibles
 * @see opoints2array Para validar múltiples estaciones a la vez
 * @see getSimpleOpoints Para obtener todos los códigos airVisio válidos
 */
export const reviewOpoint = (opoint: string | null | undefined): boolean => {
    return OPOINTS.some((o : IOpoint) => o.airVisio === opoint);
}


/** Representa un punto de observación con nombre y código airVisio */
type OpointSummary = Pick<IOpoint, 'nombre' | 'airVisio'>;

/**
 * Obtiene una lista simple de códigos airVisio de todas las estaciones disponibles
 *
 * Esta función extrae únicamente los códigos airVisio de todas las estaciones
 * configuradas en el sistema, retornando un array simple de strings. Es útil
 * cuando solo se necesitan los identificadores sin información adicional.
 *
 * @returns {string[]} Array de strings con los códigos airVisio de todas las estaciones
 *
 * @example
 * // Obtener lista simple de códigos
 * const estaciones = getSimpleOpoints();
 * // Retorna: ['Belisario', 'Carapungo', 'Centro', ...]
 *
 * @example
 * // Usar en validación
 * const estacionesValidas = getSimpleOpoints();
 * if (estacionesValidas.includes('Belisario')) {
 *     console.log('Estación válida');
 * }
 *
 * @see getDetailedOpoints Para obtener estaciones con nombre y código airVisio
 * @see OPOINTS Para acceder a la configuración completa incluyendo códigos visor
 * @see opoints2array Para procesar y validar una cadena de estaciones
 */
export function getSimpleOpoints(): string[] {
    return OPOINTS.map((o: IOpoint) => o.airVisio);
}

/**
 * Obtiene una lista detallada de estaciones con nombre y código airVisio
 *
 * Esta función retorna un array de objetos que contienen únicamente el nombre descriptivo
 * y el código airVisio de cada estación disponible en el sistema. Es útil cuando se necesita
 * mostrar información más completa que solo los códigos airVisio.
 *
 * @returns {OpointSummary[]} Array de objetos con las propiedades:
 *                            - nombre: Nombre de la estación
 *                            - airVisio: Código identificador en el sistema AirVisio
 *
 * @example
 * // Obtener lista detallada de estaciones
 * const estaciones = getDetailedOpoints();
 * // Retorna: [
 * //   { nombre: 'Belisario', airVisio: 'Belisario' },
 * //   { nombre: 'Carapungo', airVisio: 'Carapungo' },
 * //   ...
 * // ]
 *
 * @see getSimpleOpoints Para obtener solo los códigos airVisio sin nombres
 * @see OPOINTS Para acceder a la configuración completa de estaciones
 */
export function getDetailedOpoints(): OpointSummary[] {
    return OPOINTS.map((o: IOpoint): OpointSummary => ({
        nombre: o.nombre,
        airVisio: o.airVisio,
    }));
}

/**
 * Convierte una cadena de estaciones en un array de códigos airVisio válidos
 *
 * Esta función procesa una cadena que contiene códigos de estaciones separados por comas,
 * valida que todas sean estaciones reconocidas en el sistema, y retorna un array
 * con los códigos airVisio correspondientes. Si se especifica 'ALL', retorna todas
 * las estaciones disponibles. Si la entrada es inválida, termina el proceso con error.
 *
 * @param {string | null} opoints - Cadena con estaciones separadas por comas,
 *                                  'ALL' para todas las estaciones, NONE, cadena vacía o null
 * @returns {string[]} Array de strings con los códigos airVisio de las estaciones válidas
 *
 * @throws {Error} Termina el proceso con código 1 si:
 *                 - No se especifica ninguna estación (null, NONE o cadena vacía)
 *                 - Se incluye una estación no válida en la lista
 *
 * @example
 * // Uso con estaciones específicas
 * opoints2array('Belisario,Carapungo')
 * // Retorna: ['Belisario', 'Carapungo']
 *
 * @example
 * // Uso para obtener todas las estaciones
 * opoints2array('ALL')
 * // Retorna: ['Belisario', 'Carapungo', 'Centro', ...]
 *
 * @see reviewOpoint Para la validación individual de estaciones
 * @see getSimpleOpoints Para ver qué estaciones son aceptadas
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
 * Valida que una cadena de estaciones sea correcta y contenga elementos válidos
 *
 * Comprueba que la entrada no sea nula/vacía y que todos los códigos de estación
 * proporcionados existan en el sistema.
 *
 * @param {string | null} opoints - Cadena con uno o más códigos de estaciones separados por comas, o 'ALL'
 * @returns {boolean} true si la cadena es válida y contiene estaciones existentes
 *
 * @example
 * validateOpoints('Belisario,Centro') // true
 * validateOpoints('INVALID') // Termina proceso con error (vía opoints2array)
 *
 * @see opoints2array Para el procesamiento detallado de la cadena
 */
export const validateOpoints = (opoints: string | null): boolean => {
    return opoints2array(opoints).length > 0;
};

/**
 * Configuración de la tabla para mostrar información de estaciones (puntos de observación)
 *
 * Define el formato, encabezados y estilos visuales para la tabla ASCII que
 * muestra el listado de estaciones disponibles en el sistema.
 *
 * @returns {Table} Instancia de tabla cli-table3 configurada con encabezados y estilos
 * @private
 */
const createAsciiOpointsTable = () => {
    return new Table({
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
};

/**
 * Genera una tabla ASCII formateada con todas las estaciones disponibles
 *
 * Esta función crea una tabla visualmente estructurada que incluye el nombre,
 * el código airVisio (resaltado) y el código visor de cada estación configurada.
 * Es utilizada principalmente para generar la salida de ayuda por consola.
 *
 * @returns {Table} Instancia de tabla cli-table3 poblada con los datos de las estaciones
 *
 * @example
 * const tabla = opointsTable();
 * console.log(tabla.toString());
 *
 * @see opointsHelp Para ver cómo se integra esta tabla en el mensaje de ayuda
 * @see OPOINTS Para la fuente de datos de la tabla
 */
export const opointsAsciiTable = () => {
    const table = createAsciiOpointsTable();
    OPOINTS.forEach(m => {
        table.push([m.nombre, chalk.bold.red(m.airVisio), m.visor])
    })
    return table;
}

/**
 * Muestra información de ayuda sobre las estaciones aceptadas en la línea de comandos
 *
 * Genera y muestra en la consola una guía completa que incluye:
 * - Una tabla con todas las estaciones disponibles (nombre, airVisio, visor)
 * - Explicación de los campos
 * - Instrucciones sobre cómo especificar estaciones vía parámetros (-E o --estaciones)
 * - Ejemplos prácticos de uso
 *
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola a utilizar (por defecto INFO_MESSAGE)
 * @returns {void}
 *
 * @example
 * // Mostrar ayuda con formato de información estándar
 * opointsHelp();
 *
 * @example
 * // Mostrar ayuda con formato de error (ej. ante un parámetro inválido)
 * opointsHelp(ERROR_MESSAGE);
 *
 * @see opointsTable Para el generador de la tabla incluida en la ayuda
 */
export const opointsHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const messages = [
        '\n-----',
        chalk.rgb(0, 0, 139).bold('Estaciones aceptadas en la línea de comandos'),
        opointsAsciiTable().toString(),
        chalk.black.bold(' nombre   .- Nombre de la estación'),
        chalk.black.bold(' airVisio .- Código de la estación en el sistema AirVisio'),
        chalk.black.bold(' visor    .- Código de la estación en el sistema RemmaqVisor'),
        chalk.blue("\n Las estaciones se especifican con '-E ' o con '--estaciones='"),
        chalk.blue("   seguido de una lista de 'códigos airVisio' separados por comas.\n"),
        chalk.blue("\nEjemplos:\n\n$ ") + chalk.bold("loader2 fromAirVisio --estaciones=\"Belizario,Carapungo,Centro\""),
        chalk.blue("\n$ ") + chalk.bold("loader2 fromAirVisio -E \"Belizario,Carapungo,Centro\"\n")
    ];

    fnConsole(msgType)(messages.join('\n'));
}
