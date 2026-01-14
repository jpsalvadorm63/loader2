#!/usr/bin/env node
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Command, Option } from "commander";
import {DATE_TIME_FORMAT, DEFAULT_TIME_FRAME} from "./dateTime/index.js";
import {
    THIS_MOMENT
} from "./dateTime/dateTime.js";
import {packageJson} from "./commons/index.js";
import {commandFrom} from "./commands/index.js";
import {validParamsHelp} from "./commands/index.js";
import {validateMagnitudes, validMagnitudes} from "./parameters/index.js";

dayjs.locale('es');

dayjs.extend(customParseFormat);

const program = new Command();

// Mostrar ayuda si no se pasa ningún argumento
if (process.argv.length <= 2) {
    program.outputHelp();
    process.exit(0);
}

program
    .name('loader2')
    .description('CLI para transferencia de datos desde AirVisio system al sistema Remmaq Visor')
    .version(packageJson.version);

program
    .command('fromAirVisio')
    .description('Descarga de datos')
    .addOption(
        new Option(
            '-F,--from <fecha;franjaDeTiempo>',
            `Fecha en formato "${DATE_TIME_FORMAT}" y franja de tiempo por ejemplo -24h unidos por punto y coma, --from="${THIS_MOMENT()};-24h" `
        )
            .argParser(commandFrom)
            .default(
                commandFrom(`${THIS_MOMENT()};${DEFAULT_TIME_FRAME}`),
                `"fecha:hora actual;${DEFAULT_TIME_FRAME}"`
            )
    )
    .addOption(
        new Option(
            '-M,--magnitudes <lista de Magnitudes>',
            `Lista de magnitudes separadas por comas Por lo general es una sublista de: ${validMagnitudes()} `
        )
            .argParser(validateMagnitudes)
            .makeOptionMandatory(true)
            .default(undefined, `lista de magnitudes no puede quedar vacía. Debe ser una sublista de: ${validMagnitudes()}`)
    )
    .action(props => {
        console.log('>> ', props);
    });

program
    .command('validParams')
    .description('Parámetros válidos para comando "loader2 airVisio"')
    .action(validParamsHelp)

program.parseAsync().then(null);
