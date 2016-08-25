export default function display(x: any): string {
    if (typeof x.display === 'function')
        return x.display();
    if (typeof x === 'string')
        return displayString(x);
    return x.toString();
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
        return "\"" + s.replace("\"", "\\\"") + "\"";
}
