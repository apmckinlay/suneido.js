import { type } from "./type";
import { SuValue } from "./suvalue";
import { SuNum } from "./sunum";
import * as util from "./utility";

/**
 * type ordering: boolean, number, string, date, object, other
 */
export function cmp(x: any, y: any): number {
    if (x === y)
        return 0;

    let xType: string = typeof x.valueOf();
    let yType: string = typeof y.valueOf();

    if (xType === yType &&
        (xType === 'boolean' || xType === 'number' || xType === 'string')) {
        return util.cmp(x, y);
    }

    if (xType === 'number')
        x = SuNum.fromNumber(x);
    if (yType === 'number')
        y = SuNum.fromNumber(y);

    xType = type(x);
    yType = type(y);

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

    if (xType === "String" || xType === "Except")
        return -1;
    if (yType === "String" || yType === "Except")
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
