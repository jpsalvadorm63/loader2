import {opoints2array} from "../parameters/index.js";

/**
 * Procesa el parámetro de línea de comandos 'opoints' para convertirlo en un array de puntos de observación.
 *
 * Esta función analiza una cadena que contiene puntos de observación (estaciones) separados por comas
 * y los convierte en un array de estaciones válidas. Utiliza la lógica de validación definida en los parámetros.
 *
 * @param {string|null} opoints - Cadena con puntos de observación separados por comas.
 *                                Si es null o no se especifica, la función subyacente manejará el error o el valor por defecto.
 *
 * @returns {string[]} Array de puntos de observación procesados y validados.
 *
 * @example
 * // Uso con múltiples estaciones
 * commandOpoints('Belisario,Centro,Carapungo')
 * --opoints="Belisario,Centro,Carapungo"
 * -E "Belisario,Centro,Carapungo"
 * // Retorna: ['Belisario', 'Centro', 'Carapungo']
 *
 * @example
 * // Uso con todas las estaciones
 * commandOpoints('ALL')
 * --opoints="ALL"
 * -E "ALL"
 * // Retorna: ['Belisario', 'Carapungo', 'Centro', ...] (todas las estaciones disponibles)
 *
 * @example
 * // Uso con una sola estación
 * commandOpoints('Belisario')
 * --opoints="Belisario"
 * -E "Belisario"
 * // Retorna: ['Belisario']
 */
export const commandOpoints = (opoints: string|null) => {
	return opoints2array(opoints);
}
