export {
    DATE_TIME_FORMAT,
    max_anios,
    max_dias,
    max_horas,
    max_meses,
} from './dateTime-constants.js';

export {
    str2dayjs,
    timeFrame,
    computeTimeInterval,
    timeIntervalDiff,
    truncDateTime,
    roundDateTime
} from './dateTime.js';

export type {
    TimeExpression,
    TimeInterval,
    TimeIntervalDiff
} from './dateTime.interfaces.js';
