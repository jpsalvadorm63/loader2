import {str2dayjs} from "./dateTime/index.js";

export const commandFrom = (from:string) => {
    const myVars = from.split(';');

    const rawStart = (myVars[0] ?? '').trim();
    const start = str2dayjs(rawStart,'-F --from=...');

    const end = (myVars.length === 1)
        ? '-3h'
        : (myVars[1] ?? '').trim();

    return { start, end };
}