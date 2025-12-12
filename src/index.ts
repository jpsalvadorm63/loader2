#!/usr/bin/env node
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Command } from "commander";
import { str2dayjs } from "./dateTime/index.js";
import { DATE_TIME_FORMAT } from "./dateTime/index.js";
import {
    magnitudesHelp,
    opointsHelp
} from "./parameters/index.js";
import {clearScreen, wait} from "./commons/index.js";
import {intervalsHelp} from "./parameters/params.intervals.js";
import {dateTimeHelp} from "./dateTime/dateTime.js";
import {paramsHelp} from "./parameters/params.js";

dayjs.locale('es');

dayjs.extend(customParseFormat);

const formatNow = () => dayjs().format(DATE_TIME_FORMAT);

const program = new Command();

program
    .name('loader2')
    .description('CLI para transferencia de datos desde AirVisio system al sistema Remmaq Visor')
    .version('0.0.3');

program
    .command('fromAirVisio')
    .description('Descarga de datos')
    .option(
        '-F,--from <datetime>',
        `Fecha en formato "${DATE_TIME_FORMAT}"`,
        str2dayjs,
        formatNow()
    )
    // .option(
    //     '-M,--magnitudes <magnitudes>',
    //     `magnitudes válidas, una o mas entre "${validMagnitudes()}"`,
    //     (magnitudes) => reviewMagnitudes(magnitudes)
    // )
    .action((options: { from: string }) => {
        console.log('> ', options.from);
    });

program
    .command('validParams')
    .description('Parámetros válidos para comando "loader2 airVisio"')
    .action(async () => {
        const clearMyScreen = true;

        clearScreen();
        paramsHelp()
        await wait('\n\Presione <Enter> para continuar o <q> para salir ...', clearMyScreen);
        dateTimeHelp();
        await wait('\n\nPresione <Enter> para continuar o <q> para salir ...', clearMyScreen);
        magnitudesHelp();
        await wait('\n\nPresione <Enter> para continuar o <q> para salir ...', clearMyScreen);
        opointsHelp();
        await wait('\n\nPresione <Enter> para continuar o <q> para salir ...', clearMyScreen);
        intervalsHelp();
        process.exit(0)
    })

program.parseAsync();
