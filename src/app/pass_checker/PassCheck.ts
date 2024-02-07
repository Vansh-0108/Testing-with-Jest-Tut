export enum PassErrors {
    SHORT = 'Password is too short',
    NO_UPPERCASE = 'Password does not contain UpperCase',
    NO_LOWERCASE = 'Password does not contain LowerCase',
    NO_NUMBER = 'Admin pass does not contain a number'
}

export interface CheckResult  {
    valid: boolean,
    reasons: PassErrors[]
}

export class PassCheck {
    // ITERATION-1
    /*
    public checkPassword(pass: string):  boolean{
        if(pass.length<8)
            return false;
        if(pass.toLowerCase() == pass)
            return false;
        if(pass.toUpperCase() == pass)
            return false;
        return true;
    }
    */

    public checkPassword(pass: string):  CheckResult{
        let reasons: PassErrors[] = [];
        
        this.checkForLength(pass, reasons);
        this.checkForLowerCase(pass, reasons);
        this.checkForUpperCase(pass, reasons);
        return {
            valid: reasons.length > 0 ? false : true,
            reasons: reasons
        };
    }

    public checkAdminPassword(pass: string): CheckResult {
        const basicChecks = this.checkPassword(pass);
        this.checkForNumber(pass, basicChecks.reasons);
        return {
            valid: basicChecks.reasons.length > 0 ? false : true,
            reasons: basicChecks.reasons
        }
    }

    private checkForNumber(pass: string, reasons: PassErrors[]): void{
        const hasNumber = /\d/;
        if(!hasNumber.test(pass))
            reasons.push(PassErrors.NO_NUMBER)
    }

    private checkForLength(pass: string, reasons: PassErrors[]): void {
        if(pass.length<8)
            reasons.push(PassErrors.SHORT)
    }

    private checkForUpperCase(pass: string, reasons: PassErrors[]): void {
        if(pass.toLowerCase() == pass)
            reasons.push(PassErrors.NO_UPPERCASE)
    }

    private checkForLowerCase(pass: string, reasons: PassErrors[]): void {
        if(pass.toUpperCase() == pass)
            reasons.push(PassErrors.NO_LOWERCASE)
    }
}