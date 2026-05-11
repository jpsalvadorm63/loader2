import {clearScreen, wait} from "../commons/index.js";
import {paramsHelp} from "../parameters/params.js";
import {dateTimeHelp1, dateTimeHelp2, dateTimeHelp3, dateTimeHelp4, dateTimeHelp5} from "../dateTime/dateTime.js";
import {magnitudesHelp, opointsHelp, intervalsHelp} from "../parameters/index.js";


/**
 * Muestra la ayuda detallada de todos los parámetros válidos para el comando 'loader2 fromAirVisio'.
 *
 * Esta función limpia la pantalla y guía al usuario a través de varias secciones de ayuda,
 * incluyendo ayuda general, formatos de fecha y hora, magnitudes, puntos de observación e intervalos.
 * Utiliza pausas interactivas para que el usuario pueda leer cada sección a su propio ritmo.
 *
 * @returns {Promise<void>} Una promesa que se resuelve cuando el usuario termina de ver la ayuda o sale.
 */
export const validParamsHelp = async () => {
    const clearMyScreen = true;
    clearScreen();
    paramsHelp()
    const waitingMessage = '\n\Presione <Enter> para continuar o <q> para salir ...';

    const extracted = async () => {
        await wait(waitingMessage, clearMyScreen);
    }

    await extracted();
    dateTimeHelp1();
    await extracted();
    dateTimeHelp2();
    await extracted();
    dateTimeHelp3();
    await extracted();
    dateTimeHelp4();
    await extracted();
    dateTimeHelp5();
    await extracted();
    magnitudesHelp();
    await extracted();
    opointsHelp();
    await extracted();
    intervalsHelp();
    process.exit(0)
}