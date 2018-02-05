import { SuValue } from "./suvalue";
import { capitalize } from "./utility";
import { isBlock } from "./suBoundMethod";

export function type(x: any): string {
    if (x === undefined)
        throw new Error("uninitialized");
    return x === null
        ? "null"
        : x instanceof SuValue
            ? x.type()
            : isBlock(x)
                ? "Block"
                : capitalize(typeof x);
}
