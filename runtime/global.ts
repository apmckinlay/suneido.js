import { libload } from "./libload";

const suglobals: any = {};

export function defGlobal(name: string, value: any) {
    suglobals[name] = value;
}

export function global(name: string) {
    let x = suglobals[name];
    if (x !== undefined)
        return x;
    x = libload(name);
    suglobals[name] = x;
    return x;
}

export function globalLookup(name: string, method: string) {
    let cl = global(name);
    if (cl.hasOwnProperty(method))
        return cl[method];
    return null;
}

export function tryGlobal(name: string) {
    try {
        return global(name);
    } catch (e) {
        return null;
    }
}
