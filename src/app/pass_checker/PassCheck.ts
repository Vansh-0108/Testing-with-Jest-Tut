export class PassCheck {
    public checkPassword(pass: string):  boolean{
        if(pass.length<8)
            return false;
        if(pass.toLowerCase() == pass)
            return false;
        if(pass.toUpperCase() == pass)
            return false;
        return true;
    }
}