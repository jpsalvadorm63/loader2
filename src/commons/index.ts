/**
 * Módulo de utilidades comunes que agrupa funcionalidades de consola, teclado y metadatos del proyecto.
 */

/**
 * Acceso a los metadatos del archivo package.json.
 */
export {
    packageJson
} from './packageJson.js'

/**
 * Funciones de interacción con el teclado y control de pantalla.
 */
export {
    wait,
    clearScreen
} from './keyb.js'

/**
 * Tipos y constantes para el registro de mensajes en la consola con diferentes niveles de severidad.
 */
export type {
    TConsoleMessageType,
} from "./console.js"

export {
    fnConsole,
    INFO_MESSAGE,
    WARN_MESSAGE,
    LOG_MESSAGE,
    ERROR_MESSAGE
} from "./console.js"