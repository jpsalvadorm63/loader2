import {magnitudes2array} from "../parameters/params.magnitudes.js";

/**
 * Procesa el parámetro de línea de comandos 'magnitudes' para convertirlo en un array de magnitudes.
 *
 * Esta función analiza una cadena que contiene magnitudes separadas por comas y las convierte
 * en un array de magnitudes válidas. Si no se proporciona el parámetro o es null, se procesan
 * todas las magnitudes disponibles por defecto.
 *
 * @param {string|null} magnitudes - Cadena con magnitudes separadas por comas.
 *                                   Si es null o no se especifica, se usan todas las magnitudes disponibles.
 *
 * @returns {string[]} Array de magnitudes procesadas y validadas.
 *
 * @example
 * // Uso sin argumentos (usa todas las magnitudes disponibles)
 * commandMagnitudes(null)
 * // En la línea de comandos no se especifica este argumento
 * // Retorna: ['PM10', 'PM2.5', 'NO2', 'SO2', ...] (todas las magnitudes disponibles)
 *
 * @example
 * // Uso con magnitudes específicas
 * commandMagnitudes('PM10,PM2.5,NO2')
 * --magnitudes="PM10,PM2.5,NO2"
 * -M "PM10,PM2.5,NO2"
 * // Retorna: ['PM10', 'PM2.5', 'NO2']
 *
 * @example
 * // Uso con una sola magnitud
 * commandMagnitudes('PM10')
 * --magnitudes="PM10"
 * -M "PM10"
 * // Retorna: ['PM10']
 */
export const commandMagnitudes = (magnitudes : string | null) => {
    return magnitudes2array(magnitudes);
}
