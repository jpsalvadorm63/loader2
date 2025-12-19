/**
 * Constantes exportadas:
 * - DATE_TIME_FORMAT: Formato estándar de fecha y hora
 * - max_anios: Número máximo de años permitido
 * - max_dias: Número máximo de días permitido
 * - max_horas: Número máximo de horas permitido
 * - max_meses: Número máximo de meses permitido
 */
export {
    INVALID_START_DATE,
    INVALID_END_DATE,
    DATE_TIME_FORMAT,
    MAX_ANIOS,
    MAX_DIAS,
    MAX_HORAS,
    MAX_MESES,
    DEFAULT_TIME_FRAME_FORMAT_ERROR,
    DEFAULT_DATE_TIME_FORMAT_ERROR_MSG,
    DEFAULT_MAX_ANIOS_ERROR_MSG,
    DEFAULT_MAX_DIAS_ERROR_MSG,
    DEFAULT_MAX_HORAS_ERROR_MSG,
    DEFAULT_MAX_MESES_ERROR_MSG,
} from './dateTime.constants.js';

/**
 * Funciones exportadas:
 * - str2dayjs: Convierte una cadena de texto a objeto dayjs
 * - timeFrame: Genera un marco de tiempo basado en una expresión temporal
 * - computeTimeInterval: Calcula un intervalo de tiempo
 * - timeIntervalDiff: Calcula la diferencia entre dos momentos temporales
 * - truncDateTime: Trunca una fecha y hora
 * - roundDateTime: Redondea una fecha y hora
 */
export {
    str2dayjs,
    timeFrame,
    computeTimeInterval,
    timeIntervalDiff,
    truncDateTime,
    roundDateTime,
} from './dateTime.js';

/**
 * Tipos exportados:
 * - TimeExpression: Expresión de tiempo con signo, número y unidad
 * - TimeInterval: Intervalo de tiempo con inicio y fin
 * - TimeIntervalDiff: Diferencia de tiempo en días, horas y minutos
 */
export type {
    ITimeExpression,
    ITimeInterval,
    ITimeIntervalDiff
} from './dateTime.interfaces.js';
