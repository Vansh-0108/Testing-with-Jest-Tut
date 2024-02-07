import { StringUtils, getStringInfo, toUpperCase } from "../app/Utils";

describe('Utils test suite', () => {
    
    // GENERAL SYNTAX
    /*
    test('This should return upper case', () => {
        const res = toUpperCase('abc');
        expect(res).toBe('ABC');
    });
    */
   
    // STRUCTURE of UNIT TESTING
    /*
    it('should return upper case', () => {
        // arrange:
        const sut = toUpperCase;
        const expected = 'ABC';

        // act:
        const actual = sut('abc');

        // assert
        expect(actual).toBe(expected);
    });
    */

    // STRUCTURE WAY TO WRITE TESTS IN SUITES
    /*
    describe('getStringInfo TestSuite', () => {
        it('should return lower case', () => {

        })

        it('should return upper case', () => {

        })

        it('should return length', () => {

        })

        it('should return array of chars', () => {

        })
    })
    */

    // ASSERTIONS AND MATCHERS
    /*
    it('should return info of a valid string', () => {
        const actual = getStringInfo('Hello World');

        expect(actual.lowerCase).toBe('hello world');
        expect(actual.other).toEqual({});

        expect(actual.chars.length).toBe(11);
        expect(actual.chars).toHaveLength(11);

        expect(actual.chars).toEqual(['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd']);
        expect(actual.chars).toContain<string>('W');
        
        expect(actual.chars).toEqual(
            expect.arrayContaining(['W', 'o', 'r', 'l', 'd', ' ', 'H', 'e', 'l', 'l', 'o'])
        );

        expect(actual.other).not.toBe(undefined);
        expect(actual.other).not.toBeUndefined();
        expect(actual.other).toBeDefined();
        expect(actual.other).toBeTruthy();
    })
    */

    // PARAMETRIZED TESTS
    /*
    describe.only('ToUpperCaseExamples', () => {
        test.each([
            {input: 'abc', expected: 'ABC'},
            {input: 'Hello', expected: 'HELLO'},
            {input: 'WoRlD', expected: 'WORLD'},
        ])('$input toUpperCase should be $expected', ({input, expected}) => {
            const actual = toUpperCase(input);
            expect(actual).toBe(expected); 
        })
    })
    */

    // JEST HOOKS
    /*
    describe('StringUtils test', () => {
        let sut: StringUtils;
        beforeEach(() => {
            sut = new StringUtils();
            console.log('Setup');
        })

        afterEach(() => {
            console.log('Teardown');
        })

        test('should return correct upperCase', () => {
            const actual = sut.toUpperCase('abc');

            expect(actual).toBe('ABC');
            console.log('Actual test');  
        })
    })
    */

    // TESTING FOR ERRORS
    /*
    describe('StringUtils test', () => {
        let sut: StringUtils;
        beforeEach(() => {
            sut = new StringUtils();
        })

        it('should return correct upperCase', () => {
            const actual = sut.toUpperCase('abc');
            expect(actual).toBe('ABC');
        })

        it('should throw error on invalid argument - funtion', () => {
            function expectError(){
                const actual = sut.toUpperCase('');
            }
            expect(expectError).toThrow('Invalid Argument!');
            expect(expectError).toThrowError('Invalid Argument!');
        })

        it('should throw error on invalid argument - arrow funtion', () => {
            expect(() => {
                sut.toUpperCase('');
            }).toThrow('Invalid Argument!');
        })

        it('should throw error on invalid argument - try catch block', (done) => {
            try {
                sut.toUpperCase('');
                done('GetStringInfo should thrown a new error for invalid argument');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid Argument!');
                done();
            }
        })
    })
    */


});