import { SuValue } from "./suvalue";
import { capitalize } from "./utility";

export function type(x: any): string {
    if (x === undefined)
        throw new Error("uninitialized");
    return x === null ? "null"
        : x instanceof SuValue ? x.type()
        : capitalize(typeof x);
}
