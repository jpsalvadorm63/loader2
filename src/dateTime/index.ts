/**
 * Módulo de gestión de fechas y tiempos.
 * Proporciona constantes, funciones de manipulación y tipos para el manejo de intervalos temporales.
 */

/**
 * Constantes para el manejo de fechas y tiempos:
 * - DATE_TIME_FORMAT: Formato estándar de fecha y hora (YYYY-MM-DDTHH:mm)
 * - MAX_ANIOS: Número máximo de años permitido para intervalos
 * - MAX_DIAS: Número máximo de días permitido para intervalos
 * - MAX_HORAS: Número máximo de horas permitido para intervalos
 * - MAX_MESES: Número máximo de meses permitido para intervalos
 * - Mensajes de error por defecto y configuraciones de marco de tiempo
 */
export {
    INVALID_START_DATE,
    INVALID_END_DATE,
    DATE_TIME_FORMAT,
    MAX_ANIOS,
    MAX_DIAS,
    MAX_HORAS,
    MAX_MESES,
    DEFAULT_TIME_FRAME_FORMAT_ERROR_MSG,
    DEFAULT_DATE_TIME_FORMAT_ERROR_MSG,
    DEFAULT_MAX_ANIOS_ERROR_MSG,
    DEFAULT_MAX_DIAS_ERROR_MSG,
    DEFAULT_MAX_HORAS_ERROR_MSG,
    DEFAULT_MAX_MESES_ERROR_MSG,
    DEFAULT_TIME_FRAME,
    DEFAULT_DEFAULT_TIME_FRAME_ERROR_MSG
} from './dateTime.constants.js';

/**
 * Funciones para manipulación de fechas y tiempos:
 * - THIS_MOMENT: Obtiene el momento actual formateado
 * - str2dayjs: Valida y convierte una cadena a formato de fecha
 * - timeFrame: Procesa expresiones de marco de tiempo (ej. -3h)
 * - computeTimeInterval: Calcula intervalos de tiempo basados en una fecha y marco de tiempo
 * - timeIntervalDiff: Calcula la diferencia desglosada de un intervalo
 * - truncDateTime: Trunca fechas a la unidad especificada
 * - roundDateTime: Redondea fechas hacia arriba a la unidad especificada
 */
export {
    THIS_MOMENT,
    str2dayjs,
    timeFrame,
    computeTimeInterval,
    timeIntervalDiff,
    truncDateTime,
    roundDateTime,
} from './dateTime.js';

/**
 * Interfaces y tipos para el manejo de expresiones e intervalos de tiempo.
 */
export type {
    ITimeExpression,
    ITimeInterval,
    ITimeIntervalDiff
} from './dateTime.interfaces.js';
