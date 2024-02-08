import { OtherStringUtils, calculateComplexity, toUpperCaseWtCb } from "../../app/doubles/OtherUtils"

describe.skip('OtherUtils test suite', () => {
    
    it('should calculate complexity', () => {
        const obj = {
            len: 5,
            other: {
                field1: 'someInfo',
                field2: 'someMoreInfo',
            },
        }

        // USING THE obj AS A STUB (incomplete object)
        const actual = calculateComplexity(obj as any)
        expect(actual).toBe(10);
    })

    it('should return upperCase and calls callback for invalid arg', () => {
        // ()=> {} IS A FAKE DOUBLE TO SUBSTITUE THE IMPLEMENTATION
        const actual = toUpperCaseWtCb('', ()=>{})
        expect(actual).toBeUndefined();
    })

    it('should return upperCase and calls callback for valid arg', () => {
        // ()=> {} IS A FAKE DOUBLE TO SUBSTITUE THE IMPLEMENTATION
        const actual = toUpperCaseWtCb('abc', ()=>{})
        expect(actual).toBe('ABC');
    })

    describe('Tracking Callbacks', () => {

        let cbArgs = [];
        let timesCalled = 0;

        // THIS IS A SELF CREATED MOCK DOUBLE TO TRACK THE CALLBACK
        function callBackMock (arg: string) {
            cbArgs.push(arg);
            timesCalled++;
        }

        // Teardown to maintain independence
        afterEach(() => {
            cbArgs = [];
            timesCalled = 0;
        })

        it('should call callbacks for invalid arguments', () => {
            const actual = toUpperCaseWtCb('', callBackMock)
            expect(actual).toBeUndefined();
            expect(cbArgs).toContain('Invalid Argument');
            expect(timesCalled).toBe(1);
        })

        it('should call callbacks for valid arguments', () => {
            const actual = toUpperCaseWtCb('abc', callBackMock)
            expect(actual).toBe('ABC');
            expect(cbArgs).toContain('called function with abc');
            expect(timesCalled).toBe(1);
        })
    })

    describe('Tracking Callbacks with Jest function', () => {

        // THIS IS A MOCK DOUBLE PROVIDED BY JEST
        const callBackMock = jest.fn();

        // Teardown to maintain independence
        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should call callbacks for invalid arguments', () => {
            const actual = toUpperCaseWtCb('', callBackMock)
            expect(actual).toBeUndefined();
            expect(callBackMock).toBeCalledWith('Invalid Argument');
            expect(callBackMock).toBeCalledTimes(1);
        })

        it('should call callbacks for valid arguments', () => {
            const actual = toUpperCaseWtCb('abc', callBackMock)
            expect(actual).toBe('ABC');
            expect(callBackMock).toBeCalledWith('called function with abc');
            expect(callBackMock).toBeCalledTimes(1);
        })
    })

    describe('OtherStringUtils test with spies', () => {
        let sut: OtherStringUtils;

        beforeEach(() => {
            sut = new OtherStringUtils();
        })

        // Spies can not be directly injected in the sut
        test('Use spy to track calls', () => {
            const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase');
            sut.toUpperCase('abc');
            expect(toUpperCaseSpy).toBeCalledWith('abc');
            expect(toUpperCaseSpy).toBeCalledTimes(1);
        })

        // Spies are used to spy on external modules
        test('Use spy to track other modules', () => {
            const consoleLogSpy = jest.spyOn(console, 'log');
            sut.logString('abc');
            expect(consoleLogSpy).toBeCalledWith('abc');
        })

        // Spies can be used to replace the implementation of some private external functions
        test('Use spy to replace implementation of a method', () => {
            jest.spyOn(sut as any, 'callExternalService').mockImplementation(() => {
                console.log('Calling mock Implementation');
            });
            (sut as any).callExternalService();
        })
    })
})