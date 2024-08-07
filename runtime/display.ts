import { SuCallable, SuValue } from "./suvalue";
import { isString } from "./ops";
import { isFunction } from "./suBoundMethod";

export function display(x: any): string {
    if (x instanceof SuValue)
        return x.display();
    if (isFunction(x)) {
        return (x as SuCallable).$callableName || '';
    }
    if (isString(x))
        return displayString(x);
    return String(x);
}

export let default_single_quotes = false;

function displayString(s: string): string {
    if (-1 === s.indexOf('`') &&
        -1 !== s.indexOf('\\') &&
        -1 === s.search(/[^ -~]/))
        return '`' + s + '`';
    s = s.replace(/\\/g, '\\\\');
    let single_quotes = default_single_quotes
        ? -1 === s.indexOf("'")
        : (-1 !== s.indexOf('"') && -1 === s.indexOf("'"));
    if (single_quotes)
        return "'" + s + "'";
    else
        return '"' + s.replace(/"/g, '\\"') + '"';
}

export function name(x: any): string {
    if (x instanceof SuValue) {
        return x.getName();
    }
    if (isFunction(x)) {
        return (x as SuCallable).$callableName || '';
    }
    return '';
}