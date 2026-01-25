/**
 * Módulo de parámetros que centraliza las configuraciones de magnitudes y puntos de observación.
 * Proporciona acceso a constantes, interfaces y funciones de validación.
 */

export {
    NONE,
    ALL,
    MAGNITUDES,
    OPOINTS,
} from "./configs/params.constants.js"

export type {
    IMagnitude,
    IOpoint,
} from "./configs/params.interfaces.js"

/**
 * Exportaciones relacionadas con las magnitudes (ej. PM10, PM2.5, NO2).
 */
export {
    reviewMagnitude,
    getSimpleMagnitudes,
    getDetailedMagnitudes,
    magnitudes2array,
    validateMagnitudes,
    magnitudesHelp,
} from "./params.magnitudes.js"

/**
 * Exportaciones relacionadas con los puntos de observación (estaciones de monitoreo).
 */
export {
    reviewOpoint,
    getSimpleOpoints,
    getDetailedOpoints,
    opoints2array,
    validateOpoints,
    opointsHelp
} from "./params.opoints.js"

/**
 * Exportaciones relacionadas con los intervalos de tiempo.
 */
export {
    reviewInterval,
    validIntervals,
    validateIntervals,
    intervalsHelp
} from "./params.intervals.js"