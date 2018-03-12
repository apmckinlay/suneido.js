import { type } from "./type";

export function isString(x: any): boolean {
    return x != undefined && typeof x.valueOf() === 'string';
}

export function toStr(x: any): string {
    if (isString(x))
        return x.toString();
    throw new Error("can't convert " + type(x) + " to String")
}
