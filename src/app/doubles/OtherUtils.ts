import { v4 } from "uuid";

export type StringInfo = {
    lowerCase: string,
    upperCase: string,
    chars: string[],
    len: number,
    other: Object | undefined,
}

type LoggerServiceCallBack = (arg: string) => void;

export function toUpperCase(str: string){
    return str.toUpperCase(); 
}

export function toLowerCaseWId(str: string){
    return str.toLowerCase() + v4(); 
}

export function calculateComplexity (arg: StringInfo): number {
    return Object.keys(arg.other).length * arg.len;
}

export function toUpperCaseWtCb (arg: string, callback: LoggerServiceCallBack) {
    if(!arg){
        callback('Invalid Argument');
        return;
    }
    callback(`called function with ${arg}`);
    return arg.toUpperCase();
}

export class OtherStringUtils {

    private callExternalService(){
        console.log('Calling External Service');
    }

    public toUpperCase(arg: string){
        return arg.toUpperCase();
    }

    public logString(arg: string){
        console.log(arg);
    }
}