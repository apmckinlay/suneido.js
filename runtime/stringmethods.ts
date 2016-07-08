import * as assert from "./assert";
import * as util from "./utility";
import { tr as trImpl } from "./tr";
import * as suobject from "./suobject";

export function alphaq(s: string): boolean {
    assert.that(arguments.length === 1, "usage: string.Alpha?()");
    if (s.length === 0)
        return false;
    for (var c of s)
        if (!util.isAlpha(c))
            return false;
    return true;
}

export function alphaNumq(s: string): boolean {
    assert.that(arguments.length === 1, "usage: string.AlphaNum?()");
    if (s.length === 0)
        return false;
    for (var c of s)
        if (!util.isAlnum(c))
            return false;
    return true;
}

export function asc(s: string): number {
    assert.that(arguments.length === 1, "usage: string.Asc()");
    return s.charCodeAt(0) || 0;
}

function doWithSplit(str: string, sep: string, f: (arg: string) => string) {
    var a = str.split(sep);
    a.forEach(function(value, index) {
        a[index] = f(value);
    });
    return a.join(sep);
}

export function detab(s: string): string {
    var tabWidth: number = 4,
        spaces: string = "    ",
        replaceTabWithSpace = function(oneLineString: string) {
            var array = oneLineString.split('\t');
            for (var i = 0; i < array.length - 1; i++) {
                var nSpace = tabWidth - array[i].length % tabWidth;
                array[i] = array[i] + spaces.substr(0, nSpace);
            }
            return array.join('');
        };
    assert.that(arguments.length === 1, "usage: string.Detab()");
    return doWithSplit(s, '\r', function(s) {
        return doWithSplit(s, '\n', replaceTabWithSpace);
    });
}

export function entab(s: string): string {
    var tabWidth: number = 4,
        isTab = function(col: number): boolean {
            return col > 0 && (col % tabWidth) === 0;
        },
        replaceSpaceWithTab = function(oneLineString: string) {
            var strTrim = oneLineString.trim(),
                strPre = "",
                i = 0,
                col = 0,
                dstcol = 0;
            for (i = 0; i < oneLineString.length; i++) {
                if (oneLineString[i] === ' ')
                    col++;
                else if (oneLineString[i] === '\t')
                    for (col++; !isTab(col); col++)
                        ;
                else
                    break;
            }
            if (i >= oneLineString.length)
                return "";
            for (i = 0; i <= col; i++)
                if (isTab(i)) {
                    strPre += '\t';
                    dstcol = i;
                }
            for (; dstcol < col; dstcol++)
                strPre += ' ';
            return strPre + strTrim;
        };
    assert.that(arguments.length === 1, "usage: string.Entab()");
    return doWithSplit(s, '\r', function(s) {
        return doWithSplit(s, '\n', replaceSpaceWithTab);
    });
}

export function extract(s: string, pattern: string, part: number | boolean = false): string | boolean {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.Extract(pattern, part = 0/1)");
    var re = new RegExp(pattern),
        found = s.match(re),
        part_i;
    if (found === null)
        return false;
    part_i = (part === false)
        ? (found.length === 1) ? 0 : 1
        : part;
    return found[part_i];
}

export function find(s: string, str: string, pos: number = 0): number {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.Find(string, pos = 0)");
    var i = s.indexOf(str, pos);
    return i === -1 ? s.length : i;
}

export function findLast(s: string, str: string, pos: number = s.length)
    : number | boolean {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.FindLast(string, pos = size())");
    var i = s.lastIndexOf(str, pos);
    return i === -1 ? false : i;
}

export function find1of(s: string, set: string, pos: number = 0): number {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.Find1of(string, pos = 0)");
    for (var i = Math.max(0, pos); i < s.length; i++) {
        if (-1 !== set.indexOf(s.charAt(i)))
            return i;
    }
    return s.length
}

export function findLast1of(s: string, set: string, pos: number = s.length - 1)
    : number | boolean {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.FindLast1of(string, pos = size() - 1)");
    for (var i = Math.min(s.length - 1, pos); i >= 0; i--) {
        if (-1 !== set.indexOf(s.charAt(i)))
            return i;
    }
    return false;
}

export function findnot1of(s: string, set: string, pos: number = 0): number {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.Findnot1of(string, pos = 0)");
    for (var i = Math.max(0, pos); i < s.length; i++) {
        if (-1 === set.indexOf(s.charAt(i)))
            return i;
    }
    return s.length
}

export function findLastnot1of(s: string, set: string, pos: number = s.length - 1): number | boolean {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.FindLastnot1of(string, pos = size() - 1)");
    for (var i = Math.min(s.length - 1, pos); i >= 0; i--) {
        if (-1 === set.indexOf(s.charAt(i)))
            return i;
    }
    return false;
}

export function hasq(s: string, str: string): boolean {
    assert.that(arguments.length === 2, "usage: string.Has?(string)");
    return s.indexOf(str) !== -1;
}

export function lower(s: string): string {
    assert.that(arguments.length === 1, "usage: string.Lower()");
    return s.toLowerCase();
}

export function lowerq(s: string): boolean {
    assert.that(arguments.length === 1, "usage: string.Lower?()");
    var result = false;
    for (var c of s) {
        if (util.isUpper(c))
            return false;
        else if (util.isLower(c))
            result = true;
    }
    return result;
}

//TODO: to change after classes for block and callable functions are implemented
export function mapN(s: string, n: number, f: (s: string) => string): string {
    var dst = "";
    for (var i = 0; i < s.length; i += n) {
        dst += f(s.substr(i, n));
    }
    return dst;
}

//export function match(s: string, pattern: string, pos: number | boolean = false, prev: boolean = false): suobject.SuObject {
//    var s: string = prev === false ? s.slice(pos, -1) : s.slice(0, pos),
//        arrayMatch = s.match(new RegExp(pattern, 'g')),
//        strMatch,
//        indexMatch,
//        rangeOb: suobject.SuObject = suobject.make(),
//        ob: suobject.SuObject = suobject.make(),
//        i;
//    if (arrayMatch === null)
//        return null;
//    strMatch = prev === false ? arrayMatch[0] : arrayMatch[-1];
//    indexMatch = prev === false ? s.indexOf(strMatch) : s.lastIndexOf(strMatch);
//    s = s.slice(indexMatch, strMatch.length);
//    arrayMatch = s.match(pattern);
//    if (prev === false)
//        indexMatch += pos;
//    for (i = 0; i < arrayMatch.length; i++)
//        ob.add([indexMatch + strMatch.indexOf(), strMatch])
//}


export function numberq(s: string): boolean {
    assert.that(arguments.length === 1, "usage: string.Number?()");
    var i: number = 0,
        c: string,
        s: string = s,
        intdigits: boolean,
        fracdigits: boolean;
    c = s.charAt(i);
    if (c === '+' || c === '-')
        c = s.charAt(++i);
    intdigits = util.isDigit(c);
    while (util.isDigit(c))
        c = s.charAt(++i);
    if (c === '.')
        c = s.charAt(++i);
    fracdigits = util.isDigit(c);
    while (util.isDigit(c))
        c = s.charAt(++i);
    if (!intdigits && !fracdigits)
        return false;
    if (c === 'e' || c === 'E') {
        c = s.charAt(++i);
        if (c === '-' || c === '+')
            c = s.charAt(++i);
        while (util.isDigit(c))
            c = s.charAt(++i);
    }
    return i === s.length;
}

export function numericq(s: string): boolean {
    assert.that(arguments.length === 1, "usage: string.Numeric?()");
    if (s.length === 0)
        return false;
    for (var c of s)
        if (!util.isDigit(c))
            return false;
    return true;
}

export function prefixq(s: string, str: string, pos: number = 0): boolean {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.Prefix?(string, pos = 0)");
    return s.startsWith(str, pos);
}

export function repeat(s: string, count: number): string {
    assert.that(arguments.length === 2, "usage: string.Repeat(count)");
    return s.repeat(Math.max(0, count));
}

enum RepStatus { E, U, L, u, l };
//TODO: to change after classes for block and callable functions are implemented
export function replace(s: string, pattern: string, replacement: string | ((m: string) => string) = '', count: number = Infinity): string {
    assert.that(2 <= arguments.length && arguments.length <= 4,
        "usage: string.Replace(pattern, replacement = '', count = false) -> string");
    var nGroups = (new RegExp(pattern + '|')).exec('').length - 1,      //Calculate how many capture groups dose the regex pattern have
        repCount = 0,
        repF = function(): string {
            var dst: string = '',
                i: number = 0,
                c: string,
                n: number,
                repStatus: RepStatus = RepStatus.E,
                handleCase = function(s: string): string {
                    var res: string;
                    if (s && s.length === 0)
                        return '';
                    switch (repStatus) {
                        case RepStatus.E:
                            res = s;
                            break;
                        case RepStatus.U:
                            res = s.toUpperCase();
                            break;
                        case RepStatus.L:
                            res = s.toLowerCase();
                            break;
                        case RepStatus.u:
                            res = s.charAt(0).toUpperCase() + s.substr(1);
                            repStatus = RepStatus.E;
                            break;
                        case RepStatus.l:
                            res = s.charAt(0).toLowerCase() + s.substr(1);
                            repStatus = RepStatus.E;
                            break;
                        default:
                            throw new Error("unreachable");
                    }
                    return res;
                };
            if (repCount++ >= count)
                return arguments[0];
            if (typeof replacement === "string") {
                if (replacement.indexOf("\\=") === 0)
                    return replacement.substr(2);
                while (i < replacement.length) {
                    switch (replacement.charAt(i)) {
                        case '&':
                            dst += handleCase(arguments[0]);
                            break;
                        case '\\':
                            if (i + 1 < replacement.length) {
                                c = replacement.charAt(++i);
                                if (util.isDigit(c)) {
                                    n = parseInt(c);
                                    if (n <= nGroups)
                                        dst += handleCase(arguments[n]);
                                } else if (c === 'u')
                                    repStatus = RepStatus.u;
                                else if (c === 'U')
                                    repStatus = RepStatus.U;
                                else if (c === 'l')
                                    repStatus = RepStatus.l;
                                else if (c === 'L')
                                    repStatus = RepStatus.L;
                                else if (c === 'E')
                                    repStatus = RepStatus.E;
                                else if (c === '\\')
                                    dst += '\\';
                                else
                                    dst += c;
                            } else
                                dst += '\\';
                            break;
                        default:
                            dst += handleCase(replacement.charAt(i));
                    }
                    i++;
                }
            } else
                dst = replacement(arguments[0]);
            return dst;
        };
    return s.replace(new RegExp(pattern, 'g'), repF);
}

export function size(s: string): number {
    assert.that(arguments.length === 1, "usage: string.Size()");
    return s.length;
}

export function split(s: string, separator: string): suobject.SuObject {
    assert.that(arguments.length === 2, "usage: string.Split(separator)");
    assert.that(separator !== '', "string.Split separator must not be empty string");
    var arraySplit = s.split(separator);
    if (arraySplit[arraySplit.length - 1] === '')
        arraySplit = arraySplit.slice(0, -1);
    var resOb = suobject.make();
    arraySplit.forEach(function(value) { resOb.add(value); });
    return resOb;
}

export function substr(s: string, start: number, length: number = s.length): string {
    assert.that(arguments.length === 2 || arguments.length === 3, "usage: string(i[,n])");
    if (start < 0)
        start += s.length;
    if (start < 0)
        start = 0;
    if (length < 0)
        length += s.length - start;
    if (length < 0)
        length = 0;
    return s.substr(start, length);
}

export function suffixq(s: string, str: string): boolean {
    assert.that(arguments.length === 2, "usage: string.Suffix?(string)");
    return s.endsWith(str);
}

export function tr(s: string, from: string, to: string = ''): string {
    assert.that(arguments.length === 2 || arguments.length === 3,
        "usage: string.Tr(from [ , to ] )");
    return trImpl(s, from, to);
}

export function unescape(s: string): string {
    assert.that(arguments.length === 1, "usage: string.Unescape()");
    var dst = '',
        index: util.indexOb = new util.IndexOb();
    for (index.i = 0; index.i < s.length; index.i++) {
        if (s.charAt(index.i) === '\\')
            dst += util.doesc(s, index);
        else
            dst += s.charAt(index.i);
    }
    return dst;
}

export function upper(s: string): string {
    assert.that(arguments.length === 1, "usage: string.Upper()");
    return s.toUpperCase();
}

export function upperq(s: string): boolean {
    assert.that(arguments.length === 1, "usage: string.Upper?()");
    var result = false;
    for (var c of s) {
        if (util.isLower(c))
            return false;
        else if (util.isUpper(c))
            result = true;
    }
    return result;
}

export function integer(s: string): number {
    return parseInt(s, 0);
}
