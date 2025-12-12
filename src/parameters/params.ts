import {
    fnConsole,
    INFO_MESSAGE,
    TConsoleMessageType
} from "./configs/commons.js";
import chalk from "chalk";

/**
 * Muestra la ayuda general sobre el comando de extracción de datos desde AirVisio
 * @param {TConsoleMessageType} msgType - Tipo de mensaje de consola a utilizar (por defecto INFO_MESSAGE)
 */
export const paramsHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    myConsole('\n-----')
    myConsole(chalk.rgb(173, 216, 230).bold.underline('Comando para la extracción de datos desde el sistema AirVisio\n'))
    myConsole("Este sistema extrae los datos de calidad del aire y meteorológicos que llegan\ndesde las estaciones de monitoreo de la REMMAQ al sistema AirVisio\n")
    myConsole("Para lograr bajar los datos se utiliza el siguiente comando a ser ejecutado\ndesde la línea de comandos (C:/> es el indicador de línea de comandos):\n")
    myConsole(chalk.bold("C:/> loader2 fromAirVisio <params>\n"))
    myConsole("(En sistemas UNIX o LINUX o MAC/OS el indicador de la línea de comandos puede\nser marcado por el símbolo $.)\n")
    myConsole("Como se puede ver, se requieren definir parámetros (<params>) para la extracción\nde datos. Estos parámetros púeden ser obligatorios o nó y determinan los filtros\npara extraer datos.\n")
    myConsole("A continuación se detallan los parámtros.\n")
}
