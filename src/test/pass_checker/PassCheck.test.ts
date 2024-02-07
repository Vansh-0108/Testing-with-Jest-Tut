import { PassCheck } from "../../app/pass_checker/PassCheck"

describe('Password Checker Tests Suite', () => {
    
    let sut: PassCheck;

    beforeEach(() => {
        sut = new PassCheck();
    })
    
    it('should mark the pass with less than 8 chars as invalid', () => {
        const actual = sut.checkPassword('abcdEFG');
        expect(actual).toBe(false);
    })

    it('should mark the pass with 8 or more chars as valid', () => {
        const actual = sut.checkPassword('abcdEFGH');
        expect(actual).toBe(true);
    })

    it('should mark the pass with no lowercase char as invalid', () => {
        const actual = sut.checkPassword('ABCDEFGH');
        expect(actual).toBe(false);
    })

    it('should mark the pass with lowercase char as valid', () => {
        const actual = sut.checkPassword('abcdEFGH');
        expect(actual).toBe(true);
    })

    it('should mark the pass with no uppercase char as invalid', () => {
        const actual = sut.checkPassword('abcdefgh');
        expect(actual).toBe(false);
    })

    it('should mark the pass with uppercase char as valid', () => {
        const actual = sut.checkPassword('abcdEFGH');
        expect(actual).toBe(true);
    })
})