jest.mock('../../app/doubles/OtherUtils', () => ({
    ...jest.requireActual('../../app/doubles/OtherUtils'),
    calculateComplexity: () => {return 10}
}))

jest.mock('uuid', () => ({
    v4: () => {return '123'}
}))

import * as OtherUtils from '../../app/doubles/OtherUtils';

describe('Mock tests Suite', () => {

    test("Calculate complexity", () => {
        const res = OtherUtils.calculateComplexity({} as any);
        console.log(res);        
    })

    test('keep other implementation Upper Case', () => {
        const actual = OtherUtils.toUpperCase('abc');
        expect(actual).toBe('ABC');
    })

    test('keep other implementations LowerCase with id', () => {
        const actual = OtherUtils.toLowerCaseWId('ABC');
        expect(actual).toBe('abc123');
    })
});
