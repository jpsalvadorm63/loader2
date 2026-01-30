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
 * Valida si una magnitud especificada existe en el sistema
 *
 * Esta función verifica si un código airVisio de magnitud proporcionado
 * corresponde a alguna de las magnitudes configuradas en el sistema.
 * Es útil para validación de entrada antes de procesar solicitudes.
 *
 * @param {string | null | undefined} magnitude - Código airVisio de la magnitud a validar
 * @returns {boolean} true si la magnitud existe en el sistema, false en caso contrario
 *
 * @example
 * // Validar una magnitud existente
 * reviewMagnitude('PM2.5_ug')
 * // Retorna: true
 *
 * @example
 * // Validar una magnitud no existente
 * reviewMagnitude('INVALID_MAG')
 * // Retorna: false
 *
 * @example
 * reviewMagnitude(null) // false
 * reviewMagnitude(undefined) // false
 *
 * @example
 * // Uso en validación de entrada
 * const magnitud = 'TEMP_AMB';
 * if (reviewMagnitude(magnitud)) {
 *     console.log('Magnitud válida, procesando...');
 * } else {
 *     console.error('Magnitud no reconocida');
 * }
 *
 * @see MAGNITUDES Para ver la lista completa de magnitudes disponibles
 * @see magnitudes2array Para validar múltiples magnitudes a la vez
 * @see getSimpleMagnitudes Para obtener todos los códigos airVisio válidos
 */
export const reviewMagnitude = (magnitude: string | null | undefined): boolean => {
    return MAGNITUDES.some((m: IMagnitude) => m.airVisio === magnitude);
}

/**
 * Obtiene una lista simple de códigos airVisio de todas las magnitudes disponibles
 *
 * Esta función extrae únicamente los códigos airVisio de todas las magnitudes
 * configuradas en el sistema, retornando un array simple de strings. Es útil
 * cuando solo se necesitan los identificadores sin información adicional.
 *
 * @returns {string[]} Array de strings con los códigos airVisio de todas las magnitudes
 *
 * @example
 * // Obtener lista simple de códigos
 * const codigos = getSimpleMagnitudes();
 * // Retorna: ['PM2.5_ug', 'TEMP_AMB', 'DIR_VEC', ...]
 *
 * @example
 * // Usar en validación
 * const magnitudesValidas = getSimpleMagnitudes();
 * if (magnitudesValidas.includes('PM2.5_ug')) {
 *     console.log('Magnitud válida');
 * }
 *
 * @example
 * // Mostrar magnitudes disponibles
 * console.log(`Magnitudes disponibles: ${getSimpleMagnitudes().join(', ')}`);
 * // Muestra: "Magnitudes disponibles: PM2.5_ug, TEMP_AMB, DIR_VEC, ..."
 *
 * @see getDetailedMagnitudes Para obtener magnitudes con nombre y código airVisio
 * @see MAGNITUDES Para acceder a la configuración completa incluyendo códigos visor
 * @see magnitudes2array Para procesar y validar una cadena de magnitudes
 */
export function getSimpleMagnitudes(): string[] {
    return MAGNITUDES.map(({airVisio}) => airVisio);
}

/** Representa una magnitud con nombre y código airVisio */
type MagnitudeSummary = Pick<IMagnitude, 'nombre' | 'airVisio'>;

/**
 * Obtiene una lista detallada de magnitudes con nombre y código airVisio
 *
 * Esta función retorna un array de objetos que contienen únicamente el nombre descriptivo
 * y el código airVisio de cada magnitud disponible en el sistema. Es útil cuando se necesita
 * mostrar información más completa que solo los códigos airVisio.
 *
 * @returns {MagnitudeSummary[]} Array de objetos con las propiedades:
 *                                - nombre: Nombre descriptivo de la magnitud
 *                                - airVisio: Código identificador en el sistema AirVisio
 *
 * @example
 * // Obtener lista detallada de magnitudes
 * const magnitudes = getDetailedMagnitudes();
 * // Retorna: [
 * //   { nombre: 'Partículas PM2.5', airVisio: 'PM2.5_ug' },
 * //   { nombre: 'Temperatura ambiente', airVisio: 'TEMP_AMB' },
 * //   { nombre: 'Dirección vectorial', airVisio: 'DIR_VEC' },
 * //   ...
 * // ]
 *
 * @example
 * // Mostrar magnitudes en formato tabla
 * getDetailedMagnitudes().forEach(({ nombre, airVisio }) => {
 *     console.log(`${nombre}: ${airVisio}`);
 * });
 * // Muestra:
 * // Partículas PM2.5: PM2.5_ug
 * // Temperatura ambiente: TEMP_AMB
 * // Dirección vectorial: DIR_VEC
 *
 * @example
 * // Usar en selección de UI
 * const options = getDetailedMagnitudes().map(m => ({
 *     label: m.nombre,
 *     value: m.airVisio
 * }));
 *
 * @see getSimpleMagnitudes Para obtener solo los códigos airVisio sin nombres
 * @see MAGNITUDES Para acceder a la configuración completa de magnitudes incluyendo códigos visor
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
 * Crea una tabla ASCII formateada para mostrar información de magnitudes
 *
 * Esta función inicializa una tabla con formato ASCII que contiene tres columnas:
 * nombre, airVisio y visor. La tabla utiliza caracteres especiales para crear
 * bordes y separadores con estilo de caja.
 *
 * @returns {Table} Instancia de tabla configurada con:
 *                  - Encabezados: nombre (28 chars), airVisio (10 chars), visor (8 chars)
 *                  - Alineación: izquierda para nombre, centrada para airVisio y visor
 *                  - Caracteres de borde estilo línea continua (─, │, ┌, ┐, └, ┘, etc.)
 *
 * @example
 * const table = createAsciiMagnitudesTable();
 * table.push(['Partículas PM2.5', 'PM2.5_ug', '01']);
 * console.log(table.toString());
 * // Muestra:
 * // ┌────────────────────────────┬──────────┬────────┐
 * // │ nombre                     │ airVisio │ visor  │
 * // ├────────────────────────────┼──────────┼────────┤
 * // │ Partículas PM2.5           │ PM2.5_ug │   01   │
 * // └────────────────────────────┴──────────┴────────┘
 */
const createAsciiMagnitudesTable = () => {
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
 * Genera una tabla ASCII formateada con todas las magnitudes disponibles del sistema
 *
 * Esta función crea una tabla completa que muestra todas las magnitudes configuradas en el sistema,
 * incluyendo su nombre descriptivo, código airVisio (resaltado en rojo) y código visor.
 * La tabla está lista para ser impresa en consola con formato ASCII.
 *
 * @returns {Table} Instancia de tabla cli-table3 poblada con todas las magnitudes del sistema,
 *                  formateada con bordes ASCII y columnas alineadas
 *
 * @example
 * // Crear y mostrar tabla de magnitudes
 * const table = magnitudesTable();
 * console.log(table.toString());
 * // Muestra:
 * // ┌────────────────────────────┬──────────┬────────┐
 * // │ nombre                     │ airVisio │ visor  │
 * // ├────────────────────────────┼──────────┼────────┤
 * // │ Partículas PM2.5           │ PM2.5_ug │   01   │
 * // │ Temperatura ambiente       │ TEMP_AMB │   83   │
 * // │ Dirección vectorial        │ DIR_VEC  │   81   │
 * // └────────────────────────────┴──────────┴────────┘
 *
 * @example
 * // Usar en función de ayuda
 * export const showHelp = () => {
 *     console.log('Magnitudes disponibles:');
 *     console.log(magnitudesTable().toString());
 * }
 *
 * @see createAsciiMagnitudesTable Para más detalles sobre el formato de la tabla
 * @see MAGNITUDES Para ver la configuración completa de magnitudes disponibles
 * @see magnitudesHelp Para mostrar la ayuda completa con la tabla y ejemplos de uso
 */
export const magnitudesTable = () => {
    const table = createAsciiMagnitudesTable();
    MAGNITUDES.forEach(m => {
        table.push([m.nombre, chalk.bold.red(m.airVisio), m.visor])
    })
    return table;
}


/**
 * Muestra información de ayuda sobre las magnitudes aceptadas en la línea de comandos
 *
 * Esta función genera y muestra en consola una ayuda completa sobre las magnitudes disponibles,
 * incluyendo una tabla formateada con los códigos de magnitud para los sistemas AirVisio y
 * RemmaqVisor, junto con ejemplos de uso en la línea de comandos.
 *
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola a utilizar (por defecto INFO_MESSAGE).
 *                                         Puede ser INFO_MESSAGE, LOG_MESSAGE, ERROR_MESSAGE o WARN_MESSAGE
 * @returns {void} No retorna ningún valor, imprime directamente en consola
 *
 * @example
 * // Mostrar ayuda con tipo de mensaje por defecto (info)
 * magnitudesHelp()
 * // Muestra:
 * // -----
 * // Magnitudes aceptadas en la línea de comandos
 * // [tabla con magnitudes]
 * // nombre   .- Nombre de la magnitud
 * // airVisio .- Código de la magnitud en el sistema AirVisio
 * // visor    .- Código de la magnitud en el sistema RemmaqVisor
 * // ...ejemplos...
 *
 * @example
 * // Mostrar ayuda con tipo de mensaje warn
 * magnitudesHelp(WARN_MESSAGE)
 * // Muestra la misma información pero usando console.warn
 *
 * @example
 * // Mostrar ayuda con tipo de mensaje error
 * magnitudesHelp(ERROR_MESSAGE)
 * // Muestra la misma información pero usando console.error
 *
 * @see magnitudesTable Para obtener solo la tabla de magnitudes sin el resto de la ayuda
 * @see fnConsole Para más información sobre los tipos de mensajes de consola disponibles
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
