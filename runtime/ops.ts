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

export function isnt(x: any, y: any): boolean {
    return !is(x, y);
}

export function isString(x: any): boolean {
    return x != null && typeof x.valueOf() === 'string';
}

export function isNumber(x: any): boolean {
    return typeof x === 'number' || x instanceof SuNum;
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

export type Num = number | SuNum;
export function toNum(x: any): Num {
    if (typeof x === 'number' || x instanceof SuNum)
        return x;
    if (x === false || x === "")
        return 0;
    if (x === true)
        return 1;
    if (isString(x)) {
        if (!/[.eE]/.test(x) && x.length < 14)
            return parseInt(x);
        let n = SuNum.parse(x);
        if (n)
            return n;
    }
    throw new Error("can't convert " + type(x) + " to number");
}

export function toSuNum(x: number | SuNum): SuNum {
    return (typeof x === 'number') ? SuNum.make(x) : x;
}

export function toBoolean(x: any): boolean {
    if (typeof x === 'boolean')
        return x;
    throw new Error("expected boolean, got " + type(x));
}

export function toObject(x: any): any {
    return x instanceof SuValue ? x.toObject() : null;
}

export function add(x: any, y: any): Num {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x + y;
    else
        return SuNum.add(toSuNum(x), toSuNum(y));
}

export function sub(x: any, y: any): Num {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x - y;
    else
        return SuNum.sub(toSuNum(x), toSuNum(y));
}

export function mul(x: any, y: any): Num {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x * y;
    else
        return SuNum.mul(toSuNum(x), toSuNum(y));
}

export function div(x: any, y: any): SuNum {
    x = toNum(x);
    y = toNum(y);
    return SuNum.div(toSuNum(x), toSuNum(y));
}

export function bitnot(x: any): number {
    return ~toInt(x);
}

export function mod(x: any, y: any): number {
    return toInt(x) % toInt(y);
}

export function lshift(x: any, y: any): number {
    return toInt(x) << toInt(y);
}

export function rshift(x: any, y: any): number {
    return toInt(x) >>> toInt(y);
}

export function bitand(x: any, y: any): number {
    return toInt(x) & toInt(y);
}

export function bitor(x: any, y: any): number {
    return toInt(x) | toInt(y);
}

export function bitxor(x: any, y: any): number {
    return toInt(x) ^ toInt(y);
}
