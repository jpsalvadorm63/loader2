import {str2dayjs} from "./dateTime/index.js";

export const commandFrom = (from:string) => {
    const myVars = from.split(';')
    const myStart = str2dayjs(myVars[0])
    return {start:str2dayjs(myVars[0]), end: (myVars.length === 1) ? '-3h' : myVars[1]}
}