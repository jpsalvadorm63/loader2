#!/usr/bin/env node
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Command } from "commander";
import { str2dayjs } from "./commons.js";
import { DATE_TIME_FORMAT } from "./constants.js";
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
    .option('-F,--from <datetime>', `Fecha en formato "${DATE_TIME_FORMAT}"`, str2dayjs, formatNow())
    .action((options) => {
    console.log('> ', options.from);
});
program.parseAsync();
