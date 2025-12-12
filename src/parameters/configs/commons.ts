/**
 * Constante para mensajes de tipo log (registro)
 */
export const LOG_MESSAGE: string = "log"

/**
 * Constante para mensajes de tipo info (información)
 */
export const INFO_MESSAGE: string = "info"

/**
 * Constante para mensajes de tipo warn (advertencia)
 */
export const WARN_MESSAGE: string = "warn"

/**
 * Constante para mensajes de tipo error
 */
export const ERROR_MESSAGE: string = "error"

/**
 * Define los tipos de mensajes de consola disponibles
 */
export type TConsoleMessageType = typeof INFO_MESSAGE | typeof LOG_MESSAGE | typeof ERROR_MESSAGE | typeof WARN_MESSAGE;

/**
 * Devuelve una función de consola según el tipo de mensaje especificado
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola (por defecto INFO_MESSAGE)
 * @returns {Function} Función de consola correspondiente al tipo de mensaje
 */
export const fnConsole = (msgType: TConsoleMessageType = INFO_MESSAGE) : Function => {
    const myConsole = {
        INFO_MESSAGE: console.info,
        LOG_MESSAGE: console.log,
        ERROR_MESSAGE: console.error,
        WARN_MESSAGE: console.warn
    }[msgType] || console.info

    return myConsole
}
