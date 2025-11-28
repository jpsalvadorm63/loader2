/**
 * Formato de fecha y hora utilizado en la aplicación y aceptada por la API de AirVisio
 * El formato sigue el patrón: YYYY (año), MM (mes), DD (día), T (separador), HH (hora), mm (minutos)
 * Ejemplo: 2025-11-19T14:30
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

/**
 * Máximo tamaño en horas de un intervalo de tiempo
 */
export const max_horas = 172 // 7 días en horas.

/**
 * Máximo tamaño en días de un intervalo de tiempo
 */
export const max_dias = 31

/**
 * Máximo tamaño en meses de un intervalo de tiempo
 */
export const max_meses = 12

/**
 * Máximo tamaño en horas de un intervalo de tiempo
 */
export const max_anios = 2
