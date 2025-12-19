import {
    describe,
    it,
    expect
} from 'vitest'

import {
    commandFrom
} from "../src/command.from.js";

describe('commandFrom', () => {
    it('commandFrom, solo con fecha', () => {
        const result = commandFrom('2025-11-19T14:30');
        // “quiero que result sea exactamente ese objeto, comparando recursivamente
        // todas sus propiedades, con el mismo tipo y la misma estructura”.
        expect(result).toStrictEqual({start: '2025-11-19T14:30', end: '-3h'})
    })
    it('commandFrom, solo con fecha errónea', () => {
        expect(() => commandFrom('2025-11-31T14:30')).toThrow()
    })
})
