import Cachemap from "./cachemap"

export function isAlpha(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122))) {
            return true;
        }
    }
    return false;
}

export function isDigit(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code >= 48) && (code <= 57)) {
            return true;
        }
    }
    return false;
}

export function isoDigit(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code >= 48) && (code <= 55)) {
            return true;
        }
    }
    return false;
}

export function isxDigit(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if (((code >= 48) && (code <= 57)) ||
            ((code >= 65) && (code <= 70)) ||
            ((code >= 97) && (code <= 102))) {
            return true;
        }
    }
    return false;
}

export function isAlnum(char: string): boolean {
    return isAlpha(char) || isDigit(char);
}

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function isLower(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code > 96) && (code < 123))
            return true;
    }
    return false;
}

export function isUpper(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code > 64) && (code < 91))
            return true;
    }
    return false;
}

export function tr(srcstr: string, from: string, to: string): string {
    var srclen: number = srcstr.length,
        lastto: number,
        allbut: boolean,
        collapse: boolean,
        fromset: string,
        toset,
        si: number,
        p: number,
        dst: string;

    if (srclen === 0 || from.length === 0)
        return srcstr;
    allbut = from.charAt(0) === '^';
    if (allbut)
        from = from.substr(1);
    fromset = makset(from);

    for (si = 0; si < srclen; si++) {
        p = fromset.indexOf(srcstr.charAt(si));
        if (allbut === (p === -1))
            break;
    }
    if (si === srclen)
        return srcstr; // no changes

    toset = makset(to);
    lastto = toset.length;
    collapse = lastto > 0 && (allbut || lastto < fromset.length);
    lastto--;

    dst = srcstr.substring(0, si);
    for (; si < srclen; si++) {
        p = xindex(fromset, srcstr.charAt(si), allbut, lastto);
        if (collapse && p >= lastto) {
            dst += toset[lastto];
            do {
                if (++si >= srclen)
                    return dst;
                p = xindex(fromset, srcstr.charAt(si), allbut, lastto);
            } while (p >= lastto);
        }
        if (p < 0)
            dst += srcstr.charAt(si);
        else if (lastto >= 0)
            dst += toset[p];
    }
    return dst;
}

function makset(s: string): string {
    var dash = s.indexOf('-', 1),
        p: string;

    if (dash === -1 || dash === (s.length - 1))
        return s; // no ranges to expand
    if (p = makset["cache"].get(s))
        return p;
    return makset["cache"].put(s, expendRanges(s));
}

makset["cache"] = new Cachemap<string, string>(10);

function expendRanges(s: string): string {
    var i: number,
        c: number,
        dst: string = '';
    for (i = 0; i < s.length; i++)
        if (s.charAt(i) === '-' && i > 0 && i < s.length - 1)
            for (c = s.charCodeAt(i - 1) + 1; c < s.charCodeAt(i + 1); c++)
                dst += String.fromCharCode(c);
        else
            dst += s.charAt(i);
    return dst;
}

function xindex(fromset: string, c: string, allbut: boolean, lastto: number): number {
    var i: number = fromset.indexOf(c);
    if (allbut)
        return i === -1 ? lastto + 1 : -1;
    else
        return i;
}

// should be called with i pointing at backslash
// may need to move to class scanner
export interface indexOb {
    i: number;
}
export function IndexOb(i: number = 0) {
    this.i = i;
}
export function dosesc(src: string, index: indexOb): string {
    var hexval = function (c: string): number {
            var cCode = c.toLowerCase().charCodeAt(0);
            return cCode <= 57 ? cCode - 48 : cCode - 97 + 10;
        },
        octval = function (c: string): number {
            return c.charCodeAt(0) - 48;
        },
        dstCode: number;
    index.i++;
    switch (src.charAt(index.i)) {
        case 'n':
            return String.fromCharCode(10);
        case 't':
            return String.fromCharCode(9);
        case 'r':
            return String.fromCharCode(13);
        case 'x':
            if (isxDigit(src.charAt(index.i + 1)) && isxDigit(src.charAt(index.i + 2))) {
                index.i += 2;
                dstCode = 16 * hexval(src.charAt(index.i - 1)) + hexval(src.charAt(index.i));
                return String.fromCharCode(dstCode);
            }
        case '\\':
        case '"':
        case '\'':
            return src.charAt(index.i);
        default:
            if (isoDigit(src.charAt(index.i)) && isoDigit(src.charAt(index.i + 1)) &&
                isoDigit(src.charAt(index.i + 2))) {
                index.i += 2;
                dstCode = 64 * octval(src.charAt(index.i - 2)) +
                    8 * octval(src.charAt(index.i - 1)) + octval(src.charAt(index.i));
                return String.fromCharCode(dstCode);
            }
    }
}
