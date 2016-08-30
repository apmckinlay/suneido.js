import * as assert from "../assert";
import * as util from "../utility";
import { tr } from "../tr";
import { SuObject } from "../suobject";

export class StringMethods {

    ['Alpha?'](this: string): boolean {
        assert.that(arguments.length === 0, "usage: string.Alpha?()");
        if (this.length === 0)
            return false;
        for (let c of this)
            if (!util.isAlpha(c))
                return false;
        return true;
    }

    ['AlphaNum?'](this: string): boolean {
        assert.that(arguments.length === 0, "usage: string.AlphaNum?()");
        if (this.length === 0)
            return false;
        for (let c of this)
            if (!util.isAlphaNum(c))
                return false;
        return true;
    }

    Asc(this: string): number {
        assert.that(arguments.length === 0, "usage: string.Asc()");
        return this.charCodeAt(0) || 0;
    }

    Detab(this: string): string {
        let tabWidth: number = 4;
        let spaces: string = "    ";
        function replaceTabWithSpace(oneLineString: string) {
            let array = oneLineString.split('\t');
            for (let i = 0; i < array.length - 1; i++) {
                let nSpace = tabWidth - array[i].length % tabWidth;
                array[i] = array[i] + spaces.substr(0, nSpace);
            }
            return array.join('');
        }
        assert.that(arguments.length === 0, "usage: string.Detab()");
        return doWithSplit(this, '\r',
            (s) => doWithSplit(s, '\n', replaceTabWithSpace));
    }

    Entab(this: string): string {
        let tabWidth: number = 4;
        function isTab(col: number): boolean {
            return col > 0 && (col % tabWidth) === 0;
        }
        function replaceSpaceWithTab(oneLineString: string) {
            let strTrim = oneLineString.trim();
            let strPre = "";
            let i = 0;
            let col = 0;
            let dstcol = 0;
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
        }
        assert.that(arguments.length === 0, "usage: string.Entab()");
        return doWithSplit(this, '\r',
            (s) => doWithSplit(s, '\n', replaceSpaceWithTab));
    }

    Extract(this: string, pattern: string, part?: number): string | boolean {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.Extract(pattern, part = 0/1)");
        let re = new RegExp(pattern);
        let found = this.match(re);
        if (found === null)
            return false;
        let part_i = (part === undefined)
            ? (found.length === 1) ? 0 : 1
            : part;
        return found[part_i];
    }

    Find(this: string, str: string, pos: number = 0): number {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.Find(string, pos = 0)");
        let i = this.indexOf(str, pos);
        return i === -1 ? this.length : i;
    }

    FindLast(this: string, str: string, pos: number = this.length):
        number | boolean {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.FindLast(string, pos = size())");
        let i = this.lastIndexOf(str, pos);
        return i === -1 ? false : i;
    }

    Find1of(this: string, chars: string, pos: number = 0): number {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.Find1of(string, pos = 0)");
        for (let i = Math.max(0, pos); i < this.length; i++) {
            if (-1 !== chars.indexOf(this[i]))
                return i;
        }
        return this.length;
    }

    FindLast1of(this: string, chars: string, pos: number = this.length - 1):
        number | boolean {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.FindLast1of(string, pos = size() - 1)");
        for (let i = Math.min(this.length - 1, pos); i >= 0; i--) {
            if (-1 !== chars.indexOf(this[i]))
                return i;
        }
        return false;
    }

    Findnot1of(this: string, chars: string, pos: number = 0): number {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.Findnot1of(string, pos = 0)");
        for (let i = Math.max(0, pos); i < this.length; i++) {
            if (-1 === chars.indexOf(this[i]))
                return i;
        }
        return this.length;
    }

    FindLastnot1of(this: string, chars: string, pos: number = this.length - 1):
        number | boolean {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.FindLastnot1of(string, pos = size() - 1)");
        for (let i = Math.min(this.length - 1, pos); i >= 0; i--) {
            if (-1 === chars.indexOf(this[i]))
                return i;
        }
        return false;
    }

    ['Has?'](this: string, str: string): boolean {
        assert.that(arguments.length === 1, "usage: string.Has?(string)");
        return this.indexOf(str) !== -1;
    }

    Lower(this: string): string {
        assert.that(arguments.length === 0, "usage: string.Lower()");
        return this.toLowerCase();
    }

    ['Lower?'](this: string): boolean {
        assert.that(arguments.length === 0, "usage: string.Lower?()");
        let result = false;
        for (let c of this) {
            if (util.isUpper(c))
                return false;
            else if (util.isLower(c))
                result = true;
        }
        return result;
    }

    //TODO: to change after classes for block and callable functions are implemented
    MapN(this: string, n: number, f: (s: string) => string): string {
        let dst = "";
        for (let i = 0; i < this.length; i += n) {
            dst += f(this.substr(i, n));
        }
        return dst;
    }

    //match(pattern: string, pos: number | boolean = false, prev: boolean = false): suobject.SuObject {
    //    let s: string = prev === false ? s.slice(pos, -1) : s.slice(0, pos),
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


    ['Number?'](this: string): boolean {
        assert.that(arguments.length === 0, "usage: string.Number?()");
        let i: number = 0;
        let c: string;
        let intdigits: boolean;
        let fracdigits: boolean;
        c = this[i];
        if (c === '+' || c === '-')
            c = this[++i];
        intdigits = util.isDigit(c);
        while (util.isDigit(c))
            c = this[++i];
        if (c === '.')
            c = this[++i];
        fracdigits = util.isDigit(c);
        while (util.isDigit(c))
            c = this[++i];
        if (!intdigits && !fracdigits)
            return false;
        if (c === 'e' || c === 'E') {
            c = this[++i];
            if (c === '-' || c === '+')
                c = this[++i];
            while (util.isDigit(c))
                c = this[++i];
        }
        return i === this.length;
    }

    ['Numeric?'](this: string): boolean {
        assert.that(arguments.length === 0, "usage: string.Numeric?()");
        if (this.length === 0)
            return false;
        for (let c of this)
            if (!util.isDigit(c))
                return false;
        return true;
    }

    ['Prefix?'](this: string, str: string, pos: number = 0): boolean {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.Prefix?(string, pos = 0)");
        return this.startsWith(str, pos);
    }

    Repeat(this: string, count: number): string {
        assert.that(arguments.length === 1, "usage: string.Repeat(count)");
        return this.repeat(Math.max(0, count));
    }

    //TODO: to change after classes for block and callable functions are implemented
    Replace(this: string, pattern: string,
        replacement: string | ((m: string) => string) = '', count: number = Infinity): string {
        enum RepStatus { E, U, L, u, l };
        assert.that(1 <= arguments.length && arguments.length <= 3,
            "usage: string.Replace(pattern, replacement = '', count = false) -> string");
        let nGroups = (new RegExp(pattern + '|')).exec('') !.length - 1;      //Calculate how many capture groups dose the regex pattern have
        let repCount = 0;
        function repF(): string {
            let dst: string = '';
            let i: number = 0;
            let c: string;
            let n: number;
            let repStatus: RepStatus = RepStatus.E;
            function handleCase(s: string): string {
                let res: string;
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
                        res = s[0].toUpperCase() + s.substr(1);
                        repStatus = RepStatus.E;
                        break;
                    case RepStatus.l:
                        res = s[0].toLowerCase() + s.substr(1);
                        repStatus = RepStatus.E;
                        break;
                    default:
                        throw new Error("unreachable");
                }
                return res;
            }
            if (repCount++ >= count)
                return arguments[0];
            if (typeof replacement === "string") {
                if (replacement.indexOf("\\=") === 0)
                    return replacement.substr(2);
                while (i < replacement.length) {
                    switch (replacement[i]) {
                        case '&':
                            dst += handleCase(arguments[0]);
                            break;
                        case '\\':
                            if (i + 1 < replacement.length) {
                                c = replacement[++i];
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
                            dst += handleCase(replacement[i]);
                    }
                    i++;
                }
            } else
                dst = replacement(arguments[0]);
            return dst;
        };
        return this.replace(new RegExp(pattern, 'g'), repF);
    }

    Size(this: string): number {
        assert.that(arguments.length === 0, "usage: string.Size()");
        return this.length;
    }

    Split(this: string, separator: string): SuObject {
        assert.that(arguments.length === 1, "usage: string.Split(separator)");
        assert.that(separator !== '', "string.Split separator must not be empty string");
        let arraySplit = this.split(separator);
        if (arraySplit[arraySplit.length - 1] === '')
            arraySplit = arraySplit.slice(0, -1);
        let resOb = new SuObject();
        arraySplit.forEach((x: any) => resOb.add(x));
        return resOb;
    }

    Substr(this: string, start: number, length: number = this.length): string {
        assert.that(arguments.length === 1 || arguments.length === 2, "usage: string(i[,n])");
        if (start < 0)
            start += this.length;
        if (start < 0)
            start = 0;
        if (length < 0)
            length += this.length - start;
        if (length < 0)
            length = 0;
        return this.substr(start, length);
    }

    ['Suffix?'](this: string, str: string): boolean {
        assert.that(arguments.length === 1, "usage: string.Suffix?(string)");
        return this.endsWith(str);
    }

    Tr(this: string, from: string, to: string = ''): string {
        assert.that(arguments.length === 1 || arguments.length === 2,
            "usage: string.Tr(from [ , to ] )");
        return tr(this, from, to);
    }

    Unescape(this: string): string {
        assert.that(arguments.length === 0, "usage: string.Unescape()");
        let dst = '';
        for (let index = { i: 0 }; index.i < this.length; index.i++) {
            if (this[index.i] === '\\')
                dst += util.doesc(this, index);
            else
                dst += this[index.i];
        }
        return dst;
    }

    Upper(this: string): string {
        assert.that(arguments.length === 0, "usage: string.Upper()");
        return this.toUpperCase();
    }

    ['Upper?'](this: string): boolean {
        assert.that(arguments.length === 0, "usage: string.Upper?()");
        let result = false;
        for (let c of this) {
            if (util.isLower(c))
                return false;
            else if (util.isUpper(c))
                result = true;
        }
        return result;
    }

}

function doWithSplit(str: string, sep: string, f: (arg: string) => string) {
    let a = str.split(sep);
    a.forEach(function(value, index) {
        a[index] = f(value);
    });
    return a.join(sep);
}

//BUILTIN StringMethods.Alpha?()
//GENERATED start
(StringMethods.prototype['Alpha?'] as any).$call = StringMethods.prototype['Alpha?'];
(StringMethods.prototype['Alpha?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Alpha?'].call(this);
};
(StringMethods.prototype['Alpha?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Alpha?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Alpha?'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.AlphaNum?()
//GENERATED start
(StringMethods.prototype['AlphaNum?'] as any).$call = StringMethods.prototype['AlphaNum?'];
(StringMethods.prototype['AlphaNum?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['AlphaNum?'].call(this);
};
(StringMethods.prototype['AlphaNum?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['AlphaNum?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['AlphaNum?'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Asc()
//GENERATED start
(StringMethods.prototype['Asc'] as any).$call = StringMethods.prototype['Asc'];
(StringMethods.prototype['Asc'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Asc'].call(this);
};
(StringMethods.prototype['Asc'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Asc'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Asc'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Detab()
//GENERATED start
(StringMethods.prototype['Detab'] as any).$call = StringMethods.prototype['Detab'];
(StringMethods.prototype['Detab'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Detab'].call(this);
};
(StringMethods.prototype['Detab'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Detab'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Detab'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Entab()
//GENERATED start
(StringMethods.prototype['Entab'] as any).$call = StringMethods.prototype['Entab'];
(StringMethods.prototype['Entab'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Entab'].call(this);
};
(StringMethods.prototype['Entab'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Entab'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Entab'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Extract(pattern, part=false)
//GENERATED start
(StringMethods.prototype['Extract'] as any).$call = StringMethods.prototype['Extract'];
(StringMethods.prototype['Extract'] as any).$callNamed = function ($named: any, pattern: any, part: any) {
    ({ pattern = pattern, part = part } = $named);
    return StringMethods.prototype['Extract'].call(this, pattern, part);
};
(StringMethods.prototype['Extract'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Extract'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Extract'] as any).$params = 'pattern, part=false';
//GENERATED end

//BUILTIN StringMethods.Find(s, pos=0)
//GENERATED start
(StringMethods.prototype['Find'] as any).$call = StringMethods.prototype['Find'];
(StringMethods.prototype['Find'] as any).$callNamed = function ($named: any, s: any, pos: any) {
    ({ s = s, pos = pos } = $named);
    return StringMethods.prototype['Find'].call(this, s, pos);
};
(StringMethods.prototype['Find'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Find'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Find'] as any).$params = 's, pos=0';
//GENERATED end

//BUILTIN StringMethods.FindLast(s, pos=99999)
//GENERATED start
(StringMethods.prototype['FindLast'] as any).$call = StringMethods.prototype['FindLast'];
(StringMethods.prototype['FindLast'] as any).$callNamed = function ($named: any, s: any, pos: any) {
    ({ s = s, pos = pos } = $named);
    return StringMethods.prototype['FindLast'].call(this, s, pos);
};
(StringMethods.prototype['FindLast'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['FindLast'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['FindLast'] as any).$params = 's, pos=99999';
//GENERATED end

//BUILTIN StringMethods.Find1of(s, chars, pos=0)
//GENERATED start
(StringMethods.prototype['Find1of'] as any).$call = StringMethods.prototype['Find1of'];
(StringMethods.prototype['Find1of'] as any).$callNamed = function ($named: any, s: any, chars: any, pos: any) {
    ({ s = s, chars = chars, pos = pos } = $named);
    return StringMethods.prototype['Find1of'].call(this, s, chars, pos);
};
(StringMethods.prototype['Find1of'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Find1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Find1of'] as any).$params = 's, chars, pos=0';
//GENERATED end

//BUILTIN StringMethods.FindLast1of(s, chars, pos=99999)
//GENERATED start
(StringMethods.prototype['FindLast1of'] as any).$call = StringMethods.prototype['FindLast1of'];
(StringMethods.prototype['FindLast1of'] as any).$callNamed = function ($named: any, s: any, chars: any, pos: any) {
    ({ s = s, chars = chars, pos = pos } = $named);
    return StringMethods.prototype['FindLast1of'].call(this, s, chars, pos);
};
(StringMethods.prototype['FindLast1of'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['FindLast1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['FindLast1of'] as any).$params = 's, chars, pos=99999';
//GENERATED end

//BUILTIN StringMethods.Findnot1of(s, chars, pos=0)
//GENERATED start
(StringMethods.prototype['Findnot1of'] as any).$call = StringMethods.prototype['Findnot1of'];
(StringMethods.prototype['Findnot1of'] as any).$callNamed = function ($named: any, s: any, chars: any, pos: any) {
    ({ s = s, chars = chars, pos = pos } = $named);
    return StringMethods.prototype['Findnot1of'].call(this, s, chars, pos);
};
(StringMethods.prototype['Findnot1of'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Findnot1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Findnot1of'] as any).$params = 's, chars, pos=0';
//GENERATED end

//BUILTIN StringMethods.FindLastnot1of(s, chars, pos=99999)
//GENERATED start
(StringMethods.prototype['FindLastnot1of'] as any).$call = StringMethods.prototype['FindLastnot1of'];
(StringMethods.prototype['FindLastnot1of'] as any).$callNamed = function ($named: any, s: any, chars: any, pos: any) {
    ({ s = s, chars = chars, pos = pos } = $named);
    return StringMethods.prototype['FindLastnot1of'].call(this, s, chars, pos);
};
(StringMethods.prototype['FindLastnot1of'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['FindLastnot1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['FindLastnot1of'] as any).$params = 's, chars, pos=99999';
//GENERATED end

//BUILTIN StringMethods.Has?(s)
//GENERATED start
(StringMethods.prototype['Has?'] as any).$call = StringMethods.prototype['Has?'];
(StringMethods.prototype['Has?'] as any).$callNamed = function ($named: any, s: any) {
    ({ s = s } = $named);
    return StringMethods.prototype['Has?'].call(this, s);
};
(StringMethods.prototype['Has?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Has?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Has?'] as any).$params = 's';
//GENERATED end

//BUILTIN StringMethods.Lower()
//GENERATED start
(StringMethods.prototype['Lower'] as any).$call = StringMethods.prototype['Lower'];
(StringMethods.prototype['Lower'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Lower'].call(this);
};
(StringMethods.prototype['Lower'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Lower'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Lower'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Lower?()
//GENERATED start
(StringMethods.prototype['Lower?'] as any).$call = StringMethods.prototype['Lower?'];
(StringMethods.prototype['Lower?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Lower?'].call(this);
};
(StringMethods.prototype['Lower?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Lower?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Lower?'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.MapN()
//GENERATED start
(StringMethods.prototype['MapN'] as any).$call = StringMethods.prototype['MapN'];
(StringMethods.prototype['MapN'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['MapN'].call(this);
};
(StringMethods.prototype['MapN'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['MapN'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['MapN'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Number?()
//GENERATED start
(StringMethods.prototype['Number?'] as any).$call = StringMethods.prototype['Number?'];
(StringMethods.prototype['Number?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Number?'].call(this);
};
(StringMethods.prototype['Number?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Number?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Number?'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Numeric?()
//GENERATED start
(StringMethods.prototype['Numeric?'] as any).$call = StringMethods.prototype['Numeric?'];
(StringMethods.prototype['Numeric?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Numeric?'].call(this);
};
(StringMethods.prototype['Numeric?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Numeric?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Numeric?'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Prefix?(s, pos=0)
//GENERATED start
(StringMethods.prototype['Prefix?'] as any).$call = StringMethods.prototype['Prefix?'];
(StringMethods.prototype['Prefix?'] as any).$callNamed = function ($named: any, s: any, pos: any) {
    ({ s = s, pos = pos } = $named);
    return StringMethods.prototype['Prefix?'].call(this, s, pos);
};
(StringMethods.prototype['Prefix?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Prefix?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Prefix?'] as any).$params = 's, pos=0';
//GENERATED end

//BUILTIN StringMethods.Repeat(n)
//GENERATED start
(StringMethods.prototype['Repeat'] as any).$call = StringMethods.prototype['Repeat'];
(StringMethods.prototype['Repeat'] as any).$callNamed = function ($named: any, n: any) {
    ({ n = n } = $named);
    return StringMethods.prototype['Repeat'].call(this, n);
};
(StringMethods.prototype['Repeat'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Repeat'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Repeat'] as any).$params = 'n';
//GENERATED end

//BUILTIN StringMethods.Replace(pat, rep="", count=99999)
//GENERATED start
(StringMethods.prototype['Replace'] as any).$call = StringMethods.prototype['Replace'];
(StringMethods.prototype['Replace'] as any).$callNamed = function ($named: any, pat: any, rep: any, count: any) {
    ({ pat = pat, rep = rep, count = count } = $named);
    return StringMethods.prototype['Replace'].call(this, pat, rep, count);
};
(StringMethods.prototype['Replace'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Replace'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Replace'] as any).$params = 'pat, rep="", count=99999';
//GENERATED end

//BUILTIN StringMethods.Size()
//GENERATED start
(StringMethods.prototype['Size'] as any).$call = StringMethods.prototype['Size'];
(StringMethods.prototype['Size'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Size'].call(this);
};
(StringMethods.prototype['Size'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Size'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Size'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Split(sep)
//GENERATED start
(StringMethods.prototype['Split'] as any).$call = StringMethods.prototype['Split'];
(StringMethods.prototype['Split'] as any).$callNamed = function ($named: any, sep: any) {
    ({ sep = sep } = $named);
    return StringMethods.prototype['Split'].call(this, sep);
};
(StringMethods.prototype['Split'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Split'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Split'] as any).$params = 'sep';
//GENERATED end

//BUILTIN StringMethods.Substr(i, n=99999)
//GENERATED start
(StringMethods.prototype['Substr'] as any).$call = StringMethods.prototype['Substr'];
(StringMethods.prototype['Substr'] as any).$callNamed = function ($named: any, i: any, n: any) {
    ({ i = i, n = n } = $named);
    return StringMethods.prototype['Substr'].call(this, i, n);
};
(StringMethods.prototype['Substr'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Substr'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Substr'] as any).$params = 'i, n=99999';
//GENERATED end

//BUILTIN StringMethods.Suffix?()
//GENERATED start
(StringMethods.prototype['Suffix?'] as any).$call = StringMethods.prototype['Suffix?'];
(StringMethods.prototype['Suffix?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Suffix?'].call(this);
};
(StringMethods.prototype['Suffix?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Suffix?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Suffix?'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Tr(from, to="")
//GENERATED start
(StringMethods.prototype['Tr'] as any).$call = StringMethods.prototype['Tr'];
(StringMethods.prototype['Tr'] as any).$callNamed = function ($named: any, from: any, to: any) {
    ({ from = from, to = to } = $named);
    return StringMethods.prototype['Tr'].call(this, from, to);
};
(StringMethods.prototype['Tr'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Tr'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Tr'] as any).$params = 'from, to=""';
//GENERATED end

//BUILTIN StringMethods.Unescape()
//GENERATED start
(StringMethods.prototype['Unescape'] as any).$call = StringMethods.prototype['Unescape'];
(StringMethods.prototype['Unescape'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Unescape'].call(this);
};
(StringMethods.prototype['Unescape'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Unescape'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Unescape'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Upper()
//GENERATED start
(StringMethods.prototype['Upper'] as any).$call = StringMethods.prototype['Upper'];
(StringMethods.prototype['Upper'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Upper'].call(this);
};
(StringMethods.prototype['Upper'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Upper'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Upper'] as any).$params = '';
//GENERATED end

//BUILTIN StringMethods.Upper?()
//GENERATED start
(StringMethods.prototype['Upper?'] as any).$call = StringMethods.prototype['Upper?'];
(StringMethods.prototype['Upper?'] as any).$callNamed = function (_named: any) {
    return StringMethods.prototype['Upper?'].call(this);
};
(StringMethods.prototype['Upper?'] as any).$callAt = function (args: SuObject) {
    return (StringMethods.prototype['Upper?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringMethods.prototype['Upper?'] as any).$params = '';
//GENERATED end
