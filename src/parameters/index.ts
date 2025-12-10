

export {
    NONEPARAM,
    ALLPARAM,
    MAGNITUDES,
    OPOINTS,
} from "./params.constants.js"

export type {
    IMagnitude,
    IOpoint,
} from "./params.interfaces.js"

export type {
    TConsoleMessageType,
    fnConsole,
    INFO_MESSAGE,
    WARN_MESSAGE,
    LOG_MESSAGE,
    ERROR_MESSAGE
} from "./commons.js"

export {
    reviewMagnitude,
    validMagnitudes,
    validateMagnitudes,
    magnitudesHelp,
} from "./params.magnitudes.js"

export {
    validOpoints,
    validateOpoints,
    reviewOpoint,
    opointsHelp
} from "./params.opoints.js"
