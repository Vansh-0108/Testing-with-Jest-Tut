import { PassCheck, PassErrors } from "../../app/pass_checker/PassCheck"

describe('Password Checker Tests Suite', () => {
    
    let sut: PassCheck;

    beforeEach(() => {
        sut = new PassCheck();
    })
    
    // ITERATION-1
    /*
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
    */

    //ITERATION-2
    it('should mark the pass with less than 8 chars as invalid', () => {
        const actual = sut.checkPassword('abcdEFG');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PassErrors.SHORT);
    })

    it('should mark the pass with 8 or more chars as valid', () => {
        const actual = sut.checkPassword('abcdEFGH');
        expect(actual.reasons).not.toContain(PassErrors.SHORT);
    })

    it('should mark the pass with no lowercase char as invalid', () => {
        const actual = sut.checkPassword('ABCDEFGH');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PassErrors.NO_LOWERCASE);
    })

    it('should mark the pass with lowercase char as valid', () => {
        const actual = sut.checkPassword('abcdEFGH');
        expect(actual.reasons).not.toContain(PassErrors.NO_LOWERCASE);
    })

    it('should mark the pass with no uppercase char as invalid', () => {
        const actual = sut.checkPassword('abcdefgh');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PassErrors.NO_UPPERCASE);
    })

    it('should mark the pass with uppercase char as valid', () => {
        const actual = sut.checkPassword('abcdEFGH');
        expect(actual.reasons).not.toContain(PassErrors.NO_UPPERCASE);
    })

    it('Complex Valid Password', () => {
        const actual = sut.checkPassword('abcdEFGH1234');
        expect(actual.valid).toBe(true);
        expect(actual.reasons).toHaveLength(0);
    })

    // ITERATION-3

    it('should flag the admin pass without number as invalid', () => {
        const actual = sut.checkAdminPassword('abcdEFGH');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PassErrors.NO_NUMBER);
    })

    it('should flag the admin pass with number as valid', () => {
        const actual = sut.checkAdminPassword('abcdEFGH12');
        expect(actual.reasons).not.toContain(PassErrors.NO_NUMBER);
    })

})