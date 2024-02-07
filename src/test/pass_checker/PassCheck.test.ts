import { PassCheck } from "../../app/pass_checker/PassCheck"

describe('Password Checker Tests Suite', () => {
    
    let sut: PassCheck;

    beforeEach(() => {
        sut = new PassCheck();
    })
    
    it('should do nothing', () => {
        sut.checkPassword();
    })
})