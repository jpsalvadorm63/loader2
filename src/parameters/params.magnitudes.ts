import {
    ALLPARAM,
    MAGNITUDES,
    NONEPARAM,
    // OPOINT
} from "./params.constants.js";

import {
    IMagnitude,
    // IOpoint
} from "./params.interfaces.js";

// export const reviewOpoint = (opoint: string): boolean => {
//     return OPOINT.some((o : IOpoint) => o.airVisio === opoint);
// }

import chalk from "chalk";

export const reviewMagnitude = (magnitude: string): boolean => {
    return MAGNITUDES.some((m : IMagnitude) => m.airVisio === magnitude);
}

export const validMagnitudes = (simple: boolean = true) => {
    return simple
        ? MAGNITUDES.map(m => m.airVisio).join(', ')
        : MAGNITUDES.map(m => ({nombre: m.nombre, airVisio: m.airVisio}));
}

export const magnitudesHelp = () => {
    console.info('\n-----')
    console.log(chalk.rgb(0, 0, 139).bold('Magnitudes aceptadas en la línea de comandos'))
    console.table(validMagnitudes(false))
    console.log(chalk.blue("\nEjemplos:\n\n$   "),chalk.bold("loader2 fromAirVisio -magnitudes=PM2.5_ug,TEMP_AMB,DIR_VEC"))
    console.log(chalk.blue("\n$   "), chalk.bold("loader2 fromAirVisio -M PM2.5_ug,TEMP_AMB,DIR_VEC\n"))
}

export const reviewMagnitudes = (magnitudes: string): boolean => {
    if (magnitudes === NONEPARAM) {
        throw new Error("No se ha especificado uno o más magnitudes");
    }
    if (magnitudes === ALLPARAM) {
        return true
    }
    magnitudes.split(',').forEach((magnitude : string) => {
        if(!reviewMagnitude(magnitude)) {
            throw new Error(`La magnitud '${magnitude}' no es válida. Las magnitudes válidas son: ${MAGNITUDES.map(m => m.airVisio).join(', ')}`);
        }
    })
    return true;
}