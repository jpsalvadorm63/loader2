#!/usr/bin/env node
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Command } from "commander";
import { str2dayjs } from "./dateTime/index.js";
import { DATE_TIME_FORMAT } from "./dateTime/index.js";
import {
    formatNow
} from "./dateTime/dateTime.js";
import {paramsHelp} from "./parameters/params.js";
import {validParamsHelp} from "./command.validParams.js";
import {commandFrom} from "./command.from.js";

dayjs.locale('es');

dayjs.extend(customParseFormat);

const program = new Command();

program
    .name('loader2')
    .description('CLI para transferencia de datos desde AirVisio system al sistema Remmaq Visor')
    .version('0.0.3');

program
    .command('fromAirVisio')
    .description('Descarga de datos')
    .option(
        '-F,--from <datetime;frameTime>',
        `Fecha en formato "${DATE_TIME_FORMAT}" y frama de tiempo por ejemplo -24h unidos por punto y com, ${formatNow()};-24h`,
        commandFrom,
        commandFrom(`${formatNow()};-3h'`)
    )
    // .option(
    //     '-M,--magnitudes <magnitudes>',
    //     `magnitudes válidas, una o mas entre "${validMagnitudes()}"`,
    //     (magnitudes) => reviewMagnitudes(magnitudes)
    // )
    .action(props => {
        console.log('>> ', props);
    });

program
    .command('validParams')
    .description('Parámetros válidos para comando "loader2 airVisio"')
    .action(validParamsHelp)

program.parseAsync();
