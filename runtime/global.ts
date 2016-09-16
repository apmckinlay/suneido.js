import { suglobals } from "./globals";
import { libload } from "./libload";

export function global(name: string) {
    let x = suglobals[name];
    if (x !== undefined)
        return x;
    x = libload(name);
    suglobals[name] = x;
    return x;
}
