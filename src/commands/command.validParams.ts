import {clearScreen, wait} from "../commons/index.js";
import {paramsHelp} from "../parameters/params.js";
import {dateTimeHelp1, dateTimeHelp2, dateTimeHelp3, dateTimeHelp4, dateTimeHelp5} from "../dateTime/dateTime.js";
import {magnitudesHelp, opointsHelp} from "../parameters/index.js";
import {intervalsHelp} from "../parameters/params.intervals.js";


 export const validParamsHelp = async () => {
    const clearMyScreen = true;
    clearScreen();
    paramsHelp()
    await wait('\n\Presione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    dateTimeHelp1();
    await wait('\n\Presione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    dateTimeHelp2();
    await wait('\n\Presione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    dateTimeHelp3();
    await wait('\n\Presione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    dateTimeHelp4();
    await wait('\n\Presione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    dateTimeHelp5();
    await wait('\n\nPresione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    magnitudesHelp();
    await wait('\n\nPresione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    opointsHelp();
    await wait('\n\nPresione <Enter> para continuar o <q> para salir ...', clearMyScreen);
    intervalsHelp();
    process.exit(0)
}