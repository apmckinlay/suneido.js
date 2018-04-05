import { type } from "./type";
import { SuValue } from "./suvalue";
import { SuNum } from "./sunum";
import { isString } from "./ops";
import * as util from "./utility";

/**
 * type ordering: boolean, number, string, date, object, other
 */
export function cmp(x: any, y: any): util.Cmp {
    if (x === y)
        return 0;

    let xTypeof: string = isString(x) ? 'string' : typeof x;
    let yTypeof: string = isString(y) ? 'string' : typeof y;

    if (xTypeof === yTypeof &&
        (xTypeof === 'boolean' || xTypeof === 'number' || xTypeof === 'string'))
        return util.cmp(x, y);

    if (xTypeof === 'number')
        x = SuNum.fromNumber(x);
    if (yTypeof === 'number')
        y = SuNum.fromNumber(y);

    let xType = type(x);
    let yType = type(y);

    if (xType === 'Record')
        xType = 'Object';
    if (yType === 'Record')
        yType = 'Object';

    if (xType === yType)
        return (x instanceof SuValue) ? x.compareTo(y) : util.cmp(x, y);

    if (xType === "Boolean")
        return -1;
    if (yType === "Boolean")
        return +1;

    if (xType === "Number")
        return -1;
    if (yType === "Number")
        return +1;

    if (xTypeof === "string")
        return -1;
    if (yTypeof === "string")
        return +1;

    if (xType === "Date")
        return -1;
    if (yType === "Date")
        return +1;

    if (xType === "Object")
        return -1;
    if (yType === "Object")
        return +1;

    return util.cmp(x, y);
}
