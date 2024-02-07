export class StringUtils {
    public toUpperCase(str: string){
        if(!str)
            throw new Error("Invalid Argument!");
        return toUpperCase(str);
    }
}

export function toUpperCase(str: string){
    return str.toUpperCase();
}

export type StringInfo = {
    lowerCase: string,
    upperCase: string,
    chars: string[],
    len: number,
    other: Object | undefined,
}

export function getStringInfo (str: string) {
    return {
        lowerCase: str.toLowerCase(),
        upperCase: str.toUpperCase(),
        chars: Array.from(str),
        len: str.length,
        other: {},
    }
}