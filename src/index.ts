#!/usr/bin/env node
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Command } from "commander";
import { str2dayjs } from "./dateTime/index.js";
import { DATE_TIME_FORMAT } from "./dateTime/index.js";
import {
    magnitudesHelp
} from "./parameters/index.js";
import {wait} from "./commons/index.js";

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
    .description('Parámetros válidos para comando "airVisio"')
    .action(async () => {
        magnitudesHelp()
        await wait('Presione Enter para continuar, q Q ESC para salir...')



    })

program.parseAsync();
