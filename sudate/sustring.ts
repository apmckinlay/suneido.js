///<reference path="node.d.ts"/>
import assert = require("assert")
import util = require("./utility")
import suobject = require("./suobject")

export interface SuString {
    s: string;

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
    match(pattern: string, pos?: number|boolean, prev?: boolean): suobject.SuObject;

    toString(): string;
}

var sustring = Object.create(null);

function SuString(t: string): void {
    this.s = new String(t);
} 

SuString.prototype = sustring;

export function makeSuString_string(str: string): SuString {
    return new SuString(str);
}

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
}

//TODO: to change after block and call functions are implemented
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
}

sustring.match = function (pattern: string, pos: number | boolean = false, prev: boolean = false): suobject.SuObject {
    var s: string = prev === false ? this.s.slice(pos, -1) : this.s.slice(0, pos),
        arrayMatch = s.match(new RegExp(pattern, 'g')),
        strMatch,
        indexMatch,
        rangeOb: suobject.SuObject = suobject.make(),
        ob: suobject.SuObject = suobject.make(),
        i;
    if (arrayMatch === null)
        return null;
    strMatch = prev === false ? arrayMatch[0] : arrayMatch[-1];
    indexMatch = prev === false ? s.indexOf(strMatch) : s.lastIndexOf(strMatch);
    s = s.slice(indexMatch, strMatch.length);
    arrayMatch = s.match(pattern);
    if (prev === false)
        indexMatch += pos;
    for (i = 0; i < arrayMatch.length; i++)
        ob.add([indexMatch + strMatch.indexOf(), strMatch])
}

sustring.toString = function (): string {
    return this.s.valueOf();
};