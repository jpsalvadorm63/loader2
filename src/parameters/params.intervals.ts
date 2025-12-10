import {
    ALLPARAM,
    NONEPARAM,
    IIntervals
} from "./configs/params.constants.js";

import {
    IInterval
} from "./configs/params.interfaces.js";

import chalk from "chalk";
import Table from "cli-table3";
import {INFO_MESSAGE, TConsoleMessageType} from "./commons.js";
import {fnConsole} from "./commons.js";

export const reviewInterval = (interval: string): boolean => {
    return IIntervals.some((i : IInterval) => i.interval === interval);
}

export const validIntervals = (simple: boolean = true) => {
    return simple
        ? IIntervals.map(i => i.interval).join(', ')
        : IIntervals.map(i => ({nombre: i.nombre, interval: i.interval}));
}

export const validateIntervals = (interval: string): boolean => {
    if (interval === NONEPARAM) {
        throw new Error("No se ha especificado un intervalo");
    }

    if(!reviewInterval(interval)) {
        throw new Error(`El intervalo '${interval}' no es válido. Los intervalos válidas son: ${IIntervals.map(i => i.interval).join(', ')}`);
    }
    return true;
}

const table = new Table({
    head: [
        chalk.bold.black("nombre"),
        chalk.bold.black("interval"),
    ],
    colWidths: [28, 28], // ancho de columnas
    chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
    },
    colAligns: ["left", "center"] // alineación por columna
});

export const intervalTable = () => {
    IIntervals.forEach(i => {
        table.push([i.nombre, chalk.bold.red(i.interval)])
    })
    return table;
}

export const intervalsHelp = (msgType: TConsoleMessageType = INFO_MESSAGE) => {
    const myConsole = fnConsole(msgType);
    myConsole('\n-----')
    myConsole(chalk.rgb(0, 0, 139).bold('Intervalos aceptados en la línea de comandos'))
    myConsole(intervalTable().toString())
    myConsole(chalk.black.bold(' nombre   .- Nombre de la estación'))
    myConsole(chalk.black.bold(' interval .- Código del intervalo en el sistema AirVisio'))
    myConsole(chalk.blue("\n Las magnitudes se especifican con '-I ' o con '--interval='"))
    myConsole(chalk.blue("   seguido de un solo 'código interval'.\n"))
    myConsole(chalk.blue("\nEjemplos:\n\n$ "), chalk.bold("loader2 fromAirVisio --interval=001m"))
    myConsole(chalk.blue("\n$ "), chalk.bold("loader2 fromAirVisio -I 001m\n"))
}