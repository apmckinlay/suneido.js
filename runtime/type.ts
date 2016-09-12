import { SuValue } from "./suvalue";
import { capitalize } from "./utility";

export const CLASSY = Symbol("classy");

export function type(x: any): string {
    if (x === undefined)
        throw new Error("uninitialized");
    return x === null ? "null"
        : x instanceof SuValue ? x.type()
        : x[CLASSY] ? "Class"
        : capitalize(typeof x);
}
