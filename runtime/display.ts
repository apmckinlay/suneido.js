import { SuValue } from "./suvalue";

export function display(x: any): string {
    if (x instanceof SuValue)
        return x.display();
    if (x != undefined && typeof x.valueOf() === 'string')
        return displayString(x);
    return String(x);
}

export let default_single_quotes = false;

function displayString(s: string): string {
    if (-1 === s.indexOf('`') &&
        -1 !== s.indexOf('\\') &&
        -1 === s.search(/[^ -~]/))
        return '`' + s + '`';
    s = s.replace('\\', '\\\\');
    let single_quotes = default_single_quotes
        ? -1 === s.indexOf("'")
        : (-1 !== s.indexOf('"') && -1 === s.indexOf("'"));
    if (single_quotes)
        return "'" + s + "'";
    else
        return '"' + s.replace('"', '\\"') + '"';
}
