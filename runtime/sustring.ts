import assert = require("assert")
import util = require("./utility")
import suobject = require("./suobject")

export interface SuString {
    s: string;

    //methods used for external
    alphaq(): boolean;
    alphaNumq(): boolean;
    asc(): number;
    call();                     //haven't implemented
    compile();                  //haven't implemented
    detab(): SuString;
    entab(): SuString;
    eval();                     //haven't implemented
    eval2();                    //haven't implemented
    extract(pattern: string, part?: number): SuString;
    find(str: string, pos?: number): number;
    findLast(str: string, pos?: number): number;
    find1of(set: string, pos?: number): number;
    findLast1of(set: string, pos?: number): number;
    findnot1of(set: string, pos?: number): number;
    findLastnot1of(set: string, pos?: number): number;
    hasq(str: string): boolean;
    iter();                    //haven't implemented, need SuStringIter
    lower(): SuString;
    lowerq(): boolean;
    mapN(n: number, f: (s: string) => string): SuString;
    match(pattern: string, pos?: number|boolean, prev?: boolean): suobject.SuObject;        //haven't implemented, no good way to find index of captured group in javascript
    mbstowcs(): SuString;       //haven't implemented, needed?
    numberq(): boolean;
    numericq(): boolean;
    prefixq(str: string, pos?: number): boolean;
    repeat(count: number): SuString;
    replace(pattern: string, replacement?: string|((m: string) => string), count?: number): SuString;
    serverEval(): any;          //haven't implemented
    size(): number;
    split(separator: string): suobject.SuObject;
    substr(start: number, length?: number): SuString;
    suffixq(str: string): boolean;
    tr(from: string, to?: string): SuString;
    unescape(): SuString;
    upper(): SuString;
    upperq(): boolean;
    wcstombs(): SuString;       //haven't implemented, needed?

    //methods used for internal
    getdata(): SuString;        //haven't implemented, need Range
    integer(): number;
    toString(): string;
}

var sustring = Object.create(null);

function SuString(t: string): void {
    this.s = new String(t);
}

SuString.prototype = sustring;

//constructors ------------------------------------------------------------

export function makeSuString_string(str: string): SuString {
    return new SuString(str);
}

// methods ---------------------------------------------------------------------

sustring.alphaq = function (): boolean {
    var i: number;
    assert(arguments.length === 0, "usage: string.Alpha?()");
    if (this.s.length === 0)
        return false;

    for (i = 0; i < this.s.length; i++)
        if (!util.isAlpha(this.s.charAt(i)))
            return false;
    return true;
};

sustring.alphaNumq = function (): boolean {
    var i: number;
    assert(arguments.length === 0, "usage: string.AlphaNum?()");
    if (this.s.length === 0)
        return false;

    for (i = 0; i < this.s.length; i++)
        if (!util.isAlnum(this.s.charAt(i)))
            return false;
    return true;
};

sustring.asc = function (): boolean {
    assert(arguments.length === 0, "usage: string.Asc()");
    return this.s.charCodeAt(0) || 0;
};

function doWithSplit(str: string, seperator: string, f: (arg: string) => string) {
    var a = str.split(seperator);
    a.forEach(function (value, index) {
        a[index] = f(value);
    });
    return a.join(seperator);
};

sustring.detab = function (): SuString {
    var tabWidth: number = 4,
        spaces: string = "    ",
        replaceTabWithSpace = function (oneLineString: string) {
            var array = oneLineString.split('\t'),
                nSpace,
                i;
            for (i = 0; i < array.length - 1; i++) {
                nSpace = tabWidth - array[i].length % tabWidth;
                array[i] = array[i] + spaces.substr(0, nSpace);
            }
            return array.join('');
        };
    assert(arguments.length === 0, "usage: string.Detab()");
    return new SuString(doWithSplit(this.s, '\r', function (s) {
        return doWithSplit(s, '\n', replaceTabWithSpace);
    }));
};

sustring.entab = function (): SuString {
    var tabWidth: number = 4,
        isTab = function (col: number): boolean {
            return col > 0 && (col % tabWidth) === 0;
        },
        replaceSpaceWithTab = function (oneLineString: string) {
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
    assert(arguments.length === 0, "usage: string.Entab()");
    return new SuString(doWithSplit(this.s, '\r', function (s) {
        return doWithSplit(s, '\n', replaceSpaceWithTab);
    }));
};

// return null instead of false when failed to find a result
sustring.extract = function (pattern: string, part: number|boolean = false): SuString {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.Extract(pattern, part = 0/1)");
    var re = new RegExp(pattern),
        found = this.s.match(re),
        part_i;
    if (found === null)
        return null;
    part_i = (part === false)
        ? (found.length === 1) ? 0 : 1
        : part;
    return found[part_i];
};

sustring.find = function (str: string, pos: number = 0): number {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.Find(string, pos = 0)");
    var i = this.s.indexOf(str, pos);
    return i === -1 ? this.s.length : i;
};

sustring.findLast = function (str: string, pos: number = this.s.length): number {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.FindLast(string, pos = size())");
    var i = this.s.lastIndexOf(str, pos);
    return i === -1 ? null : i;
};

sustring.find1of = function (set: string, pos: number = 0): number {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.Find1of(string, pos = 0)");
    var i,
        j;
    for (i = Math.max(0, pos); i < this.s.length; i++) {
        j = set.indexOf(this.s.charAt(i));
        if (j !== -1)
            return i;
    }
    return this.s.length
};

sustring.findLast1of = function (set: string, pos: number = this.s.length - 1): number {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.FindLast1of(string, pos = size() - 1)");
    var i,
        j;
    for (i = Math.min(this.s.length - 1, pos); i >= 0; i--) {
        j = set.indexOf(this.s.charAt(i));
        if (j !== -1)
            return i;
    }
    return null;
};

sustring.findnot1of = function (set: string, pos: number = 0): number {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.Findnot1of(string, pos = 0)");
    var i,
        j;
    for (i = Math.max(0, pos); i < this.s.length; i++) {
        j = set.indexOf(this.s.charAt(i));
        if (j === -1)
            return i;
    }
    return this.s.length
};

sustring.findLastnot1of = function (set: string, pos: number = this.s.length - 1): number {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.FindLastnot1of(string, pos = size() - 1)");
    var i,
        j;
    for (i = Math.min(this.s.length - 1, pos); i >= 0; i--) {
        j = set.indexOf(this.s.charAt(i));
        if (j === -1)
            return i;
    }
    return null;
};

sustring.hasq = function (str: string): boolean {
    assert(arguments.length === 1, "usage: string.Has?(string)");
    return this.s.indexOf(str) === -1 ? false : true;
};

sustring.lower = function (): SuString {
    assert(arguments.length === 0, "usage: string.Lower()");
    var str = this.s.toLowerCase();
    return new SuString(str);
};

sustring.lowerq = function (): boolean {
    assert(arguments.length === 0, "usage: string.Lower?()");
    var i,
        result = false;
    for (i = 0; i < this.s.length; i++) {
        if (util.isUpper(this.s.charAt(i)))
            return false;
        else if (util.isLower(this.s.charAt(i)))
            result = true;
    }
    return result ? true : false;
};

//TODO: to change after classes for block and callable functions are implemented
sustring.mapN = function (n: number, f: (s: string) => string): SuString {
    var s = this.s,
        dst = "",
        slen = this.s.length,
        chunk,
        i;
    for (i = 0; i < slen; i += n) {
        chunk = s.substr(i, n);
        dst += f(chunk);
    }
    return new SuString(dst);
};

//sustring.match = function (pattern: string, pos: number | boolean = false, prev: boolean = false): suobject.SuObject {
//    var s: string = prev === false ? this.s.slice(pos, -1) : this.s.slice(0, pos),
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


sustring.numberq = function (): boolean {
    assert(arguments.length === 0, "usage: string.Number?()");
    var i: number = 0,
        c: string,
        s: string = this.s,
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
};

sustring.numericq = function (): boolean {
    assert(arguments.length === 0, "usage: string.Numeric?()");
    var i: number;
    if (this.s.length === 0)
        return false;
    for (i = 0; i < this.s.length; i++)
        if (!util.isDigit(this.s.charAt(i)))
            return false;
    return true;
};

sustring.prefixq = function (str: string, pos: number = 0): boolean {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.Prefix?(string, pos = 0)");
    return this.s.indexOf(str, pos) === pos;
};

sustring.repeat = function (count: number): SuString {
    assert(arguments.length === 1, "usage: string.Repeat(count)");
    return new SuString(this.s.repeat(Math.max(0, count)));
};

enum RepStatus { E, U, L, u, l };
//TODO: to change after classes for block and callable functions are implemented
sustring.replace = function (pattern: string, replacement: string|((m: string) => string) = '', count: number = Infinity): SuString {
    assert(arguments.length >= 1 && arguments.length <= 3,
        "usage: string.Replace(pattern, replacement = '', count = false) -> string");
    var nGroups = (new RegExp(pattern + '|')).exec('').length - 1,      //Calculate how many capture groups dose the regex pattern have
        repCount = 0,
        repF = function (): string {
            var dst: string = '',
                i: number = 0,
                c: string,
                n: number,
                repStatus: RepStatus = RepStatus.E,
                handleCase = function (s: string): string {
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
    return new SuString(this.s.replace(new RegExp(pattern, 'g'), repF));
};

sustring.size = function (): number {
    assert(arguments.length === 0, "usage: string.Size()");
    return this.s.length;
};

sustring.split = function (separator: string): suobject.SuObject {
    assert(arguments.length === 1, "usage: string.Split(separator)");
    assert(separator !== '', "string.Split separator must not be empty string");
    var arraySplit = this.s.split(separator),
        resOb = suobject.make();
    if (arraySplit[arraySplit.length - 1] === '')
        arraySplit = arraySplit.slice(0, -1);
    arraySplit.forEach(function (value) { resOb.add(value); });
    return resOb;
};

sustring.substr = function (start: number, length: number = this.s.length): SuString {
    assert(arguments.length === 1 || arguments.length === 2, "usage: string(i[,n])");
    if (start < 0)
        start += this.s.length;
    if (start < 0)
        start = 0;
    if (length < 0)
        length += this.s.length - start;
    if (length < 0)
        length = 0;
    return new SuString(this.s.substr(start, length));
};

sustring.suffixq = function (str: string): boolean {
    assert(arguments.length === 1, "usage: string.Suffix?(string)");
    var index = this.s.lastIndexOf(str);
    return index !== -1 && (index + str.length === this.s.length);
};

sustring.tr = function (from: string, to: string = ''): SuString {
    assert(arguments.length === 1 || arguments.length === 2,
        "usage: string.Tr(from [ , to ] )");
    return new SuString(util.tr(this.toString(), from, to));
};

sustring.unescape = function (): SuString {
    assert(arguments.length === 0, "usage: string.Unescape()");
    var dst: string = '',
        s: string = this.toString(),
        index: util.indexOb = new util.IndexOb();
    for (index.i = 0; index.i < s.length; index.i++) {
        if (s.charAt(index.i) === '\\')
            dst += util.dosesc(s, index);
        else
            dst += s.charAt(index.i);
    }
    return new SuString(dst);
};

sustring.upper = function (): SuString {
    assert(arguments.length === 0, "usage: string.Upper()");
    var str = this.s.toUpperCase();
    return new SuString(str);
};

sustring.upperq = function (): boolean {
    assert(arguments.length === 0, "usage: string.Upper?()");
    var i,
        result = false;
    for (i = 0; i < this.s.length; i++) {
        if (util.isLower(this.s.charAt(i)))
            return false;
        else if (util.isUpper(this.s.charAt(i)))
            result = true;
    }
    return result ? true : false;
};

sustring.integer = function (): number {
    return parseInt(this.toString(), 0);
};

sustring.toString = function (): string {
    return this.s.valueOf();
};
