import { type } from "./type";
import { SuNum } from "./sunum";
import { SuValue } from "./suvalue";

export function is(x: any, y: any): boolean {
    if (x.valueOf() === y.valueOf())
        return true;
    if (x instanceof SuValue)
        return x.equals(y);
    if (y instanceof SuValue)
        return y.equals(x);
    return false;
}

export function isString(x: any): boolean {
    return x != null && typeof x.valueOf() === 'string';
}

export function toStr(x: any): string {
    if (isString(x))
        return x.toString();
    throw new Error("can't convert " + type(x) + " to String");
}

export function coerceStr(x: any): string {
    if (isString(x))
        return x;
    else if (x === true)
        return "true";
    else if (x === false)
        return "false";
    else if (typeof x === 'number' || x instanceof SuNum)
        return x.toString();
    else
        throw new Error("can't convert " + type(x) + " to String");
}

export function toInt(x: any): number {
    let value;
    if (typeof x === 'number')
        value = Math.floor(x);
    else if (x instanceof SuNum)
        value = x.toInt(true);
    else if (x === false)
        value = 0;
    else if (isString(x) && (x as string).length === 0)
        value = 0;
    else
        throw new Error(x === true
            ? "can't convert true to number"
            : "can't convert " + type(x) + " to number");
    if (!Number.isSafeInteger(value))
        new Error("not safe integer: " + value);
    return value;
}

export function toBoolean(x: any): boolean {
    if (typeof x === 'boolean')
        return x;
    throw new Error("expected boolean, got " + type(x));
}
