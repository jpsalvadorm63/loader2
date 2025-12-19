/**
 * Mensaje de error que se muestra cuando la fecha de fin ("ebd") de un intervalo de tiempo no es válida
 */
export const INVALID_END_DATE = '"end" del intervalo de tiempo no es válido';

/**
 * Mensaje de error que se muestra cuando la fecha de inicio ("start") de un intervalo de tiempo no es válida
 */
export const INVALID_START_DATE = '"start" del intervalo de tiempo no es válido';

/**
 * Mensaje de error por defecto que se muestra cuando el formato de una expresión de tiempo (por ejemplo, -24f, +3d, -1a) no es válida
 */
export const DEFAULT_TIME_FRAME_FORMAT_ERROR = 'Formato para expresión de tiempo no válido'

/**
 * Formato de fecha y hora utilizado en la aplicación y aceptada por la API de AirVisio
 * El formato sigue el patrón: YYYY (año), MM (mes), DD (día), T (separador), HH (hora), mm (minutos)
 * Ejemplo: 2025-11-19T14:30
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

/**
 * El error por defecto que se muestra cuando una fecha no tiene el formato correcto definido en DATE_TIME_FORMAT
 * o tampoco es una fecha correcta.
 */
export const DEFAULT_DATE_TIME_FORMAT_ERROR_MSG = `debe coincidir con el formato ${DATE_TIME_FORMAT}`

/**
 * Máximo tamaño en años de un intervalo de tiempo
 */
export const MAX_ANIOS = 2

/**
 * Mensaje de error por defecto que se muestra cuando un intervalo de tiempo excede el máximo permitido
 * definido en MAX_ANIOS
 */
export const DEFAULT_MAX_ANIOS_ERROR_MSG = `El intervalo de tiempo no puede ser mayor que ${MAX_ANIOS} años`

/**
 * Máximo tamaño en meses de un intervalo de tiempo
 */
export const MAX_MESES = 12*MAX_ANIOS

/**
 * Mensaje de error por defecto que se muestra cuando un intervalo de tiempo excede el máximo permitido
 * definido en MAX_MESES
 */
export const DEFAULT_MAX_MESES_ERROR_MSG = `El intervalo de tiempo no puede ser mayor que ${MAX_MESES} meses`

/**
 * Máximo tamaño en días de un intervalo de tiempo
 */
export const MAX_DIAS = 365*MAX_ANIOS

/**
 * Mensaje de error por defecto que se muestra cuando un intervalo de tiempo excede el máximo permitido
 * definido en MAX_DIAS
 */
export const DEFAULT_MAX_DIAS_ERROR_MSG = `El intervalo de tiempo no puede ser mayor que ${MAX_DIAS} días`

/**
 * Máximo tamaño en horas de un intervalo de tiempo
 */
export const MAX_HORAS = MAX_DIAS*24

/**
 * Mensaje de error por defecto que se muestra cuando un intervalo de tiempo excede el máximo permitido
 * definido en MAX_HORAS
 */
export const DEFAULT_MAX_HORAS_ERROR_MSG = `El intervalo de tiempo no puede ser mayor que ${MAX_HORAS} horas`