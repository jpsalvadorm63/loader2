import {
    describe,
    it,
    expect
} from 'vitest'

import {
    commandFrom
} from "../src/commands/command.from.js";
import {
    computeTimeInterval,
    THIS_MOMENT
} from "../src/dateTime/index.js";
import {DEFAULT_TIME_FRAME} from "../src/dateTime/index.js";

describe('commandFrom', () => {
    it('commandFrom, sin argumentos', () => {
        const result = commandFrom();
        expect(result).toStrictEqual(computeTimeInterval(THIS_MOMENT(),DEFAULT_TIME_FRAME))
    })
    it('commandFrom, con argumento nulo', () => {
        const result= commandFrom(null)
        expect(result).toStrictEqual(computeTimeInterval(THIS_MOMENT(),DEFAULT_TIME_FRAME))
    })
    it('commandFrom, con argumento vacío', () => {
        const result= commandFrom('')
        expect(result).toStrictEqual(computeTimeInterval(THIS_MOMENT(),DEFAULT_TIME_FRAME))
    })
    it('commandFrom, sin fecha y con intervalo de tiempo', () => {
        const result = commandFrom(';-16h');
        expect(result).toStrictEqual(computeTimeInterval(THIS_MOMENT(),'-16h'))
    })
    it('commandFrom, con fecha y sin intervalo de tiempo', () => {
        const result = commandFrom('2025-11-19T14:30');
        expect(result).toStrictEqual(computeTimeInterval('2025-11-19T14:30',DEFAULT_TIME_FRAME))
    })
    it('commandFrom, solo con fecha', () => {
        const result = commandFrom('2025-11-19T14:30');
        expect(result).toStrictEqual({start: '2025-11-19T11:30', end: '2025-11-19T14:30'})
    })
    it('commandFrom, solo con fecha errónea', () => {
        expect(() => commandFrom('2025-11-31T14:30')).toThrow()
    })
})
