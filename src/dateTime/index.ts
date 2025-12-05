/**
 * Constantes exportadas:
 * - DATE_TIME_FORMAT: Formato estándar de fecha y hora
 * - max_anios: Número máximo de años permitido
 * - max_dias: Número máximo de días permitido
 * - max_horas: Número máximo de horas permitido
 * - max_meses: Número máximo de meses permitido
 */
export {
    DATE_TIME_FORMAT,
    max_anios,
    max_dias,
    max_horas,
    max_meses,
} from './dateTime-constants.js';

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
    roundDateTime
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
