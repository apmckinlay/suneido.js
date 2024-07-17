import * as assert from "../assert";
import * as util from "../utility";
import { tr } from "../tr";
import { global } from "../global";
import { SuObject } from "../suobject";
import { mandatory, maxargs } from "../args";
import { Result, ForEach, Regex } from "../regex";
import { RegexReplace} from "../regexreplace";
import { SuIterable, SuCallable, SuValue } from "../suvalue";
import { toInt, toStr, toBoolean, isString } from "../ops";
import { Pack } from "../pack";

export function su_stringq(x: any): boolean {
    maxargs(1, arguments.length);
    return isString(x);
}
//BUILTIN String?(value)
//GENERATED start
(su_stringq as any).$call = su_stringq;
(su_stringq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_stringq(value);
};
(su_stringq as any).$callAt = function (args: SuObject) {
    return (su_stringq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_stringq as any).$callableType = "BUILTIN";
(su_stringq as any).$callableName = "String?";
(su_stringq as any).$params = 'value';
//GENERATED end

export function su_global(x: any): any {
    maxargs(1, arguments.length);
    let s = toStr(x);
    let splits = s.split('.');
    let val = global(splits[0]) as SuValue;
    if (splits.length > 1) {
        val = val.get(splits[1]);
        if (val == null) {
            throw new Error("Global: " + splits[1] + " not found");
        }
    }
    return val;
}

//BUILTIN Global(name)
//GENERATED start
(su_global as any).$call = su_global;
(su_global as any).$callNamed = function ($named: any, name: any) {
    maxargs(2, arguments.length);
    ({ name = name } = $named);
    return su_global(name);
};
(su_global as any).$callAt = function (args: SuObject) {
    return (su_global as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_global as any).$callableType = "BUILTIN";
(su_global as any).$callableName = "Global";
(su_global as any).$params = 'name';
//GENERATED end

export class Strings {

    ['Alpha?'](this: string): boolean {
        maxargs(0, arguments.length);
        if (this.length === 0)
            return false;
        for (let c of this)
            if (!util.isAlpha(c))
                return false;
        return true;
    }

    ['AlphaNum?'](this: string): boolean {
        maxargs(0, arguments.length);
        if (this.length === 0)
            return false;
        for (let c of this)
            if (!util.isAlphaNum(c))
                return false;
        return true;
    }

    Asc(this: string): number {
        maxargs(0, arguments.length);
        return this.charCodeAt(0) || 0;
    }

    Detab(this: string): string {
        maxargs(0, arguments.length);
        const tabWidth: number = 4;
        const spaces: string = "    ";
        function replaceTabWithSpace(oneLineString: string) {
            let array = oneLineString.split('\t');
            for (let i = 0; i < array.length - 1; i++) {
                let nSpace = tabWidth - array[i].length % tabWidth;
                array[i] = array[i] + spaces.substr(0, nSpace);
            }
            return array.join('');
        }
        return doWithSplit(this, '\r',
            (s) => doWithSplit(s, '\n', replaceTabWithSpace));
    }

    Entab(this: string): string {
        maxargs(0, arguments.length);
        const tabWidth: number = 4;
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
        return doWithSplit(this, '\r',
            (s) => doWithSplit(s, '\n', replaceSpaceWithTab));
    }

    Eval(this: any): any {
        maxargs(0, arguments.length);
        let s = toStr(this);
        return seval(s);
    }

    ServerEval(this: any): any {
        maxargs(0, arguments.length);
        let s = toStr(this);
        let req = new XMLHttpRequest();
        req.open("POST", "/eval", false); // synchronous
        req.overrideMimeType('text/plain; charset=Windows-1252');
        req.send(s);
        if (req.status !== 200)
            throw new Error("connection error: " + req.status);
        return Pack.unpack(Pack.convertStringToBuffer(req.responseText, true));
    }

    Extract(this: string, patternArg: any = mandatory(), partArg?: any): string | boolean {
        maxargs(2, arguments.length);
        let pattern = toStr(patternArg);
        let re = Regex.compile(pattern);
        let res = re.firstMatch(this, 0);
        if (res === null)
            return false;
        else {
            let part_i = (partArg === undefined)
                ? (res.groupCount() === 0) ? 0 : 1
                : toInt(partArg);
            return res.group(this, part_i);
        }
    }

    Find(this: string, strArg: any = mandatory(), posArg: any = 0): number {
        maxargs(2, arguments.length);
        let str = toStr(strArg);
        let pos = toInt(posArg);
        let i = this.indexOf(str, pos);
        return i === -1 ? this.length : i;
    }

    FindLast(this: string, strArg: any = mandatory(), posArg: any = this.length): number | boolean {
        maxargs(2, arguments.length);
        let str = toStr(strArg);
        let pos = toInt(posArg);
        let i = this.lastIndexOf(str, pos);
        return i === -1 ? false : i;
    }

    Find1of(this: string, charsArg: any = mandatory(), posArg: any = 0): number {
        maxargs(2, arguments.length);
        let chars = toStr(charsArg);
        let pos = toInt(posArg);
        for (let i = Math.max(0, pos); i < this.length; i++) {
            if (-1 !== chars.indexOf(this[i]))
                return i;
        }
        return this.length;
    }

    FindLast1of(this: string, charsArg: any = mandatory(), posArg: any = this.length - 1): number | boolean {
        maxargs(2, arguments.length);
        let chars = toStr(charsArg);
        let pos = toInt(posArg);
        for (let i = Math.min(this.length - 1, pos); i >= 0; i--) {
            if (-1 !== chars.indexOf(this[i]))
                return i;
        }
        return false;
    }

    Findnot1of(this: string, charsArg: any = mandatory(), posArg: any = 0): number {
        maxargs(2, arguments.length);
        let chars = toStr(charsArg);
        let pos = toInt(posArg);
        for (let i = Math.max(0, pos); i < this.length; i++) {
            if (-1 === chars.indexOf(this[i]))
                return i;
        }
        return this.length;
    }

    FindLastnot1of(this: string, charsArg: any = mandatory(), posArg: any = this.length - 1): number | boolean {
        maxargs(2, arguments.length);
        let chars = toStr(charsArg);
        let pos = toInt(posArg);
        for (let i = Math.min(this.length - 1, pos); i >= 0; i--) {
            if (-1 === chars.indexOf(this[i]))
                return i;
        }
        return false;
    }

    CountChar(this: string, charArg: any = mandatory()): number {
        maxargs(1, arguments.length);
        let char = toStr(charArg);
        let s = this;
        if (char.length !== 1)
            throw new Error("usage: string.CountChar(c)");
        let n = 0;
        for (let i = 0; (i = s.indexOf(char, i)) !== -1; ++i)
            ++n;
        return n;
    }

    ['Has?'](this: string, strArg: any = mandatory()): boolean {
        maxargs(1, arguments.length);
        let str = toStr(strArg);
        return this.indexOf(str) !== -1;
    }

    Lower(this: string): string {
        maxargs(0, arguments.length);
        return this.toLowerCase();
    }

    ['Lower?'](this: string): boolean {
        maxargs(0, arguments.length);
        let result = false;
        for (let c of this) {
            if (util.isUpper(c))
                return false;
            else if (util.isLower(c))
                result = true;
        }
        return result;
    }

    MapN(this: string, nArg: any = mandatory(), f: any = mandatory()): string {
        maxargs(2, arguments.length);
        let n = toInt(nArg);
        let dst = "";
        for (let i = 0; i < this.length; i += n) {
            dst += f.$call.call(f, this.substr(i, n));
        }
        return dst;
    }

    Match(this: string, patternArg: any = mandatory(), posArg: any = false,
        prevArg: any = false): SuObject | false {
        maxargs(3, arguments.length);
        let prev = toBoolean(prevArg);
        let pat = Regex.compile(toStr(patternArg));
        let position = typeof posArg === 'boolean' ? (prev ? this.length : 0) : toInt(posArg);
        let result = prev ? pat.lastMatch(this, position) : pat.firstMatch(this, position);
        if (result === null)
            return false;
        let ob = new SuObject();
        for (let i = 0; i <= result.groupCount(); i++) {
            let start = result.pos[i];
            ob.add(new SuObject([start, result.end[i] - start]));
        }
        return ob;
    }

    NthLine(this: string, nArg: any = mandatory()): string {
        maxargs(1, arguments.length);
        let s = this;
        let n = toInt(nArg);
        let sn = this.length;
        let i = 0;
        for (; i < sn && n > 0; ++i)
            if (s.charAt(i) === '\n')
                --n;
        let end = i;
        while (end < sn && s.charAt(end) !== '\n')
            ++end;
        while (end > i && s.charAt(end - 1) === '\r')
            --end;
        return s.substring(i, end);
    }

    ['Number?'](this: string): boolean {
        maxargs(0, arguments.length);
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
            let j = i;
            while (util.isDigit(c))
                c = this[++i];
            if (j === i)
                return false; // no digits after 'e'
        }
        return i === this.length;
    }

    ['Numeric?'](this: string): boolean {
        maxargs(0, arguments.length);
        if (this.length === 0)
            return false;
        for (let c of this)
            if (!util.isDigit(c))
                return false;
        return true;
    }

    ['Prefix?'](this: string, strArg: any = mandatory(), posArg: any = 0): boolean {
        maxargs(2, arguments.length);
        let str = toStr(strArg);
        let pos = toInt(posArg);
        if (pos < 0)
            pos += this.length;
        return this.startsWith(str, pos);
    }

    Repeat(this: string, countArg: any = mandatory()): string {
        maxargs(1, arguments.length);
        return this.repeat(Math.max(0, toInt(countArg)));
    }

    //TODO: to change after classes for block and callable functions are implemented
    Replace(this: string, patternArg: any = mandatory(),
        replacement: any = '', countArg: any = Infinity): string {
        maxargs(3, arguments.length);
        let pat = Regex.compile(toStr(patternArg));
        let rep: string | null = null;
        if (typeof replacement === 'string')
            rep = replacement;
        let foreach = new ClassForEach(this, rep, toInt(countArg), replacement);
        pat.forEachMatch(this, foreach);
        return foreach.result();
    }

    Size(this: string): number {
        assert.that(arguments.length === 0, "usage: string.Size()");
        return this.length;
    }

    Split(this: string, separatorArg: any = mandatory()): SuObject {
        maxargs(1, arguments.length);
        let separator = toStr(separatorArg);
        assert.that(separator !== '', "string.Split separator must not be empty string");
        let arraySplit = this.split(separator);
        if (arraySplit[arraySplit.length - 1] === '')
            arraySplit = arraySplit.slice(0, -1);
        return new SuObject(arraySplit);
    }

    Substr(this: string, startArg: any = mandatory(), lengthArg: any = this.length): string {
        maxargs(2, arguments.length);
        let start = toInt(startArg);
        let length = toInt(lengthArg);
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

    ['Suffix?'](this: string, strArg: any = mandatory()): boolean {
        maxargs(1, arguments.length);
        return this.endsWith(toStr(strArg));
    }

    Tr(this: string, fromArg: any = mandatory(), toArg: any = ''): string {
        maxargs(2, arguments.length);
        return tr(this, toStr(fromArg), toStr(toArg));
    }

    Unescape(this: string): string {
        maxargs(0, arguments.length);
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
        maxargs(0, arguments.length);
        return this.toUpperCase();
    }

    ['Upper?'](this: string): boolean {
        maxargs(0, arguments.length);
        let result = false;
        for (let c of this) {
            if (util.isLower(c))
                return false;
            else if (util.isUpper(c))
                result = true;
        }
        return result;
    }

    Iter(this: string): StringIter {
        maxargs(0, arguments.length);
        return new StringIter(this);
    }
}

export class StringIter extends SuIterable {
    private iter: IterableIterator<string>;
    constructor(private s: string) {
        super();
        this.iter = s[Symbol.iterator]();
    }
    type(): string {
        return 'StringIter';
    }
    toString(): string {
        return 'aStringtIter';
    }
    Next(): string | StringIter {
        maxargs(0, arguments.length);
        let next = this.iter.next();
        if (next.done)
            return this;
        return next.value;
    }
    Dup(): StringIter {
        maxargs(0, arguments.length);
        return new StringIter(this.s);
    }
    ['Infinite?'](): boolean {
        maxargs(0, arguments.length);
        return false;
    }
}

function doWithSplit(str: string, sep: string, f: (arg: string) => string) {
    let a = str.split(sep);
    a.forEach(function(value, index) {
        a[index] = f(value);
    });
    return a.join(sep);
}

let globalRx = /^[A-Z][_a-zA-Z0-9]*[!?]?$/;
function seval(s: string) {
    if (globalRx.test(s))
        return global(s);
    let src = "function () { " + s + "\n}";
    let req = new XMLHttpRequest();
    req.open("POST", "/compile", false); // synchronous
    req.send(src);
    if (req.status !== 200)
        throw new Error("can't find " + name);
    let fn: SuCallable;
    try {
        fn = eval(req.responseText);
    } catch (e) {
        throw new Error("error compiling " + name);
    }
    return fn.$call.apply(null);
}

class ClassForEach implements ForEach {
    private append: number = 0;
    private strObj: {str: string} = {str: ""};
    constructor(private s: string, private rep: string | null, private n: number,
        private block: (s: string) => string) {
    }
    each(res: Result): number {
        if (this.n <= 0)
            return this.s.length + 1;
        this.strObj.str += this.s.substring(this.append, res.pos[0]);
        if (this.rep === null) {
            let matched = res.group(this.s, 0);
            let t = this.block(matched);
            this.strObj.str += t === null ? matched : t;
        } else
            RegexReplace.append(this.s, res, this.rep, this.strObj);
        this.append = res.end[0];
        return --this.n > 0
            ? Math.max(res.end[0], res.pos[0] + 1)
            : this.s.length + 1;
    }
    result(): string {
        this.strObj.str += this.s.substring(this.append);
        return this.strObj.str;
    }
}

//BUILTIN Strings.Alpha?()
//GENERATED start
(Strings.prototype['Alpha?'] as any).$call = Strings.prototype['Alpha?'];
(Strings.prototype['Alpha?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Alpha?'].call(this);
};
(Strings.prototype['Alpha?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Alpha?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Alpha?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Alpha?'] as any).$callableName = "Strings#Alpha?";
(Strings.prototype['Alpha?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.AlphaNum?()
//GENERATED start
(Strings.prototype['AlphaNum?'] as any).$call = Strings.prototype['AlphaNum?'];
(Strings.prototype['AlphaNum?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['AlphaNum?'].call(this);
};
(Strings.prototype['AlphaNum?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['AlphaNum?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['AlphaNum?'] as any).$callableType = "BUILTIN";
(Strings.prototype['AlphaNum?'] as any).$callableName = "Strings#AlphaNum?";
(Strings.prototype['AlphaNum?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Asc()
//GENERATED start
(Strings.prototype['Asc'] as any).$call = Strings.prototype['Asc'];
(Strings.prototype['Asc'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Asc'].call(this);
};
(Strings.prototype['Asc'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Asc'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Asc'] as any).$callableType = "BUILTIN";
(Strings.prototype['Asc'] as any).$callableName = "Strings#Asc";
(Strings.prototype['Asc'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Detab()
//GENERATED start
(Strings.prototype['Detab'] as any).$call = Strings.prototype['Detab'];
(Strings.prototype['Detab'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Detab'].call(this);
};
(Strings.prototype['Detab'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Detab'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Detab'] as any).$callableType = "BUILTIN";
(Strings.prototype['Detab'] as any).$callableName = "Strings#Detab";
(Strings.prototype['Detab'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Entab()
//GENERATED start
(Strings.prototype['Entab'] as any).$call = Strings.prototype['Entab'];
(Strings.prototype['Entab'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Entab'].call(this);
};
(Strings.prototype['Entab'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Entab'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Entab'] as any).$callableType = "BUILTIN";
(Strings.prototype['Entab'] as any).$callableName = "Strings#Entab";
(Strings.prototype['Entab'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Eval()
//GENERATED start
(Strings.prototype['Eval'] as any).$call = Strings.prototype['Eval'];
(Strings.prototype['Eval'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Eval'].call(this);
};
(Strings.prototype['Eval'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Eval'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Eval'] as any).$callableType = "BUILTIN";
(Strings.prototype['Eval'] as any).$callableName = "Strings#Eval";
(Strings.prototype['Eval'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.ServerEval()
//GENERATED start
(Strings.prototype['ServerEval'] as any).$call = Strings.prototype['ServerEval'];
(Strings.prototype['ServerEval'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['ServerEval'].call(this);
};
(Strings.prototype['ServerEval'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['ServerEval'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['ServerEval'] as any).$callableType = "BUILTIN";
(Strings.prototype['ServerEval'] as any).$callableName = "Strings#ServerEval";
(Strings.prototype['ServerEval'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Extract(pattern, part=false)
//GENERATED start
(Strings.prototype['Extract'] as any).$call = Strings.prototype['Extract'];
(Strings.prototype['Extract'] as any).$callNamed = function ($named: any, pattern: any, part: any) {
    maxargs(3, arguments.length);
    ({ pattern = pattern, part = part } = $named);
    return Strings.prototype['Extract'].call(this, pattern, part);
};
(Strings.prototype['Extract'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Extract'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Extract'] as any).$callableType = "BUILTIN";
(Strings.prototype['Extract'] as any).$callableName = "Strings#Extract";
(Strings.prototype['Extract'] as any).$params = 'pattern, part=false';
//GENERATED end

//BUILTIN Strings.Find(s, pos=0)
//GENERATED start
(Strings.prototype['Find'] as any).$call = Strings.prototype['Find'];
(Strings.prototype['Find'] as any).$callNamed = function ($named: any, s: any, pos: any) {
    maxargs(3, arguments.length);
    ({ s = s, pos = pos } = $named);
    return Strings.prototype['Find'].call(this, s, pos);
};
(Strings.prototype['Find'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Find'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Find'] as any).$callableType = "BUILTIN";
(Strings.prototype['Find'] as any).$callableName = "Strings#Find";
(Strings.prototype['Find'] as any).$params = 's, pos=0';
//GENERATED end

//BUILTIN Strings.FindLast(s, pos=99999)
//GENERATED start
(Strings.prototype['FindLast'] as any).$call = Strings.prototype['FindLast'];
(Strings.prototype['FindLast'] as any).$callNamed = function ($named: any, s: any, pos: any) {
    maxargs(3, arguments.length);
    ({ s = s, pos = pos } = $named);
    return Strings.prototype['FindLast'].call(this, s, pos);
};
(Strings.prototype['FindLast'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['FindLast'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['FindLast'] as any).$callableType = "BUILTIN";
(Strings.prototype['FindLast'] as any).$callableName = "Strings#FindLast";
(Strings.prototype['FindLast'] as any).$params = 's, pos=99999';
//GENERATED end

//BUILTIN Strings.Find1of(chars, pos=0)
//GENERATED start
(Strings.prototype['Find1of'] as any).$call = Strings.prototype['Find1of'];
(Strings.prototype['Find1of'] as any).$callNamed = function ($named: any, chars: any, pos: any) {
    maxargs(3, arguments.length);
    ({ chars = chars, pos = pos } = $named);
    return Strings.prototype['Find1of'].call(this, chars, pos);
};
(Strings.prototype['Find1of'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Find1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Find1of'] as any).$callableType = "BUILTIN";
(Strings.prototype['Find1of'] as any).$callableName = "Strings#Find1of";
(Strings.prototype['Find1of'] as any).$params = 'chars, pos=0';
//GENERATED end

//BUILTIN Strings.FindLast1of(chars, pos=99999)
//GENERATED start
(Strings.prototype['FindLast1of'] as any).$call = Strings.prototype['FindLast1of'];
(Strings.prototype['FindLast1of'] as any).$callNamed = function ($named: any, chars: any, pos: any) {
    maxargs(3, arguments.length);
    ({ chars = chars, pos = pos } = $named);
    return Strings.prototype['FindLast1of'].call(this, chars, pos);
};
(Strings.prototype['FindLast1of'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['FindLast1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['FindLast1of'] as any).$callableType = "BUILTIN";
(Strings.prototype['FindLast1of'] as any).$callableName = "Strings#FindLast1of";
(Strings.prototype['FindLast1of'] as any).$params = 'chars, pos=99999';
//GENERATED end

//BUILTIN Strings.Findnot1of(chars, pos=0)
//GENERATED start
(Strings.prototype['Findnot1of'] as any).$call = Strings.prototype['Findnot1of'];
(Strings.prototype['Findnot1of'] as any).$callNamed = function ($named: any, chars: any, pos: any) {
    maxargs(3, arguments.length);
    ({ chars = chars, pos = pos } = $named);
    return Strings.prototype['Findnot1of'].call(this, chars, pos);
};
(Strings.prototype['Findnot1of'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Findnot1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Findnot1of'] as any).$callableType = "BUILTIN";
(Strings.prototype['Findnot1of'] as any).$callableName = "Strings#Findnot1of";
(Strings.prototype['Findnot1of'] as any).$params = 'chars, pos=0';
//GENERATED end

//BUILTIN Strings.FindLastnot1of(chars, pos=99999)
//GENERATED start
(Strings.prototype['FindLastnot1of'] as any).$call = Strings.prototype['FindLastnot1of'];
(Strings.prototype['FindLastnot1of'] as any).$callNamed = function ($named: any, chars: any, pos: any) {
    maxargs(3, arguments.length);
    ({ chars = chars, pos = pos } = $named);
    return Strings.prototype['FindLastnot1of'].call(this, chars, pos);
};
(Strings.prototype['FindLastnot1of'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['FindLastnot1of'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['FindLastnot1of'] as any).$callableType = "BUILTIN";
(Strings.prototype['FindLastnot1of'] as any).$callableName = "Strings#FindLastnot1of";
(Strings.prototype['FindLastnot1of'] as any).$params = 'chars, pos=99999';
//GENERATED end

//BUILTIN Strings.Has?(s)
//GENERATED start
(Strings.prototype['Has?'] as any).$call = Strings.prototype['Has?'];
(Strings.prototype['Has?'] as any).$callNamed = function ($named: any, s: any) {
    maxargs(2, arguments.length);
    ({ s = s } = $named);
    return Strings.prototype['Has?'].call(this, s);
};
(Strings.prototype['Has?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Has?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Has?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Has?'] as any).$callableName = "Strings#Has?";
(Strings.prototype['Has?'] as any).$params = 's';
//GENERATED end

//BUILTIN Strings.Lower()
//GENERATED start
(Strings.prototype['Lower'] as any).$call = Strings.prototype['Lower'];
(Strings.prototype['Lower'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Lower'].call(this);
};
(Strings.prototype['Lower'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Lower'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Lower'] as any).$callableType = "BUILTIN";
(Strings.prototype['Lower'] as any).$callableName = "Strings#Lower";
(Strings.prototype['Lower'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Lower?()
//GENERATED start
(Strings.prototype['Lower?'] as any).$call = Strings.prototype['Lower?'];
(Strings.prototype['Lower?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Lower?'].call(this);
};
(Strings.prototype['Lower?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Lower?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Lower?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Lower?'] as any).$callableName = "Strings#Lower?";
(Strings.prototype['Lower?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.MapN()
//GENERATED start
(Strings.prototype['MapN'] as any).$call = Strings.prototype['MapN'];
(Strings.prototype['MapN'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['MapN'].call(this);
};
(Strings.prototype['MapN'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['MapN'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['MapN'] as any).$callableType = "BUILTIN";
(Strings.prototype['MapN'] as any).$callableName = "Strings#MapN";
(Strings.prototype['MapN'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Match(pattern, pos=false, prev=false)
//GENERATED start
(Strings.prototype['Match'] as any).$call = Strings.prototype['Match'];
(Strings.prototype['Match'] as any).$callNamed = function ($named: any, pattern: any, pos: any, prev: any) {
    maxargs(4, arguments.length);
    ({ pattern = pattern, pos = pos, prev = prev } = $named);
    return Strings.prototype['Match'].call(this, pattern, pos, prev);
};
(Strings.prototype['Match'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Match'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Match'] as any).$callableType = "BUILTIN";
(Strings.prototype['Match'] as any).$callableName = "Strings#Match";
(Strings.prototype['Match'] as any).$params = 'pattern, pos=false, prev=false';
//GENERATED end

//BUILTIN Strings.NthLine(n)
//GENERATED start
(Strings.prototype['NthLine'] as any).$call = Strings.prototype['NthLine'];
(Strings.prototype['NthLine'] as any).$callNamed = function ($named: any, n: any) {
    maxargs(2, arguments.length);
    ({ n = n } = $named);
    return Strings.prototype['NthLine'].call(this, n);
};
(Strings.prototype['NthLine'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['NthLine'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['NthLine'] as any).$callableType = "BUILTIN";
(Strings.prototype['NthLine'] as any).$callableName = "Strings#NthLine";
(Strings.prototype['NthLine'] as any).$params = 'n';
//GENERATED end

//BUILTIN Strings.CountChar(c)
//GENERATED start
(Strings.prototype['CountChar'] as any).$call = Strings.prototype['CountChar'];
(Strings.prototype['CountChar'] as any).$callNamed = function ($named: any, c: any) {
    maxargs(2, arguments.length);
    ({ c = c } = $named);
    return Strings.prototype['CountChar'].call(this, c);
};
(Strings.prototype['CountChar'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['CountChar'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['CountChar'] as any).$callableType = "BUILTIN";
(Strings.prototype['CountChar'] as any).$callableName = "Strings#CountChar";
(Strings.prototype['CountChar'] as any).$params = 'c';
//GENERATED end

//BUILTIN Strings.Number?()
//GENERATED start
(Strings.prototype['Number?'] as any).$call = Strings.prototype['Number?'];
(Strings.prototype['Number?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Number?'].call(this);
};
(Strings.prototype['Number?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Number?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Number?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Number?'] as any).$callableName = "Strings#Number?";
(Strings.prototype['Number?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Numeric?()
//GENERATED start
(Strings.prototype['Numeric?'] as any).$call = Strings.prototype['Numeric?'];
(Strings.prototype['Numeric?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Numeric?'].call(this);
};
(Strings.prototype['Numeric?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Numeric?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Numeric?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Numeric?'] as any).$callableName = "Strings#Numeric?";
(Strings.prototype['Numeric?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Prefix?(s, pos=0)
//GENERATED start
(Strings.prototype['Prefix?'] as any).$call = Strings.prototype['Prefix?'];
(Strings.prototype['Prefix?'] as any).$callNamed = function ($named: any, s: any, pos: any) {
    maxargs(3, arguments.length);
    ({ s = s, pos = pos } = $named);
    return Strings.prototype['Prefix?'].call(this, s, pos);
};
(Strings.prototype['Prefix?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Prefix?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Prefix?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Prefix?'] as any).$callableName = "Strings#Prefix?";
(Strings.prototype['Prefix?'] as any).$params = 's, pos=0';
//GENERATED end

//BUILTIN Strings.Repeat(n)
//GENERATED start
(Strings.prototype['Repeat'] as any).$call = Strings.prototype['Repeat'];
(Strings.prototype['Repeat'] as any).$callNamed = function ($named: any, n: any) {
    maxargs(2, arguments.length);
    ({ n = n } = $named);
    return Strings.prototype['Repeat'].call(this, n);
};
(Strings.prototype['Repeat'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Repeat'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Repeat'] as any).$callableType = "BUILTIN";
(Strings.prototype['Repeat'] as any).$callableName = "Strings#Repeat";
(Strings.prototype['Repeat'] as any).$params = 'n';
//GENERATED end

//BUILTIN Strings.Replace(pat, rep="", count=99999)
//GENERATED start
(Strings.prototype['Replace'] as any).$call = Strings.prototype['Replace'];
(Strings.prototype['Replace'] as any).$callNamed = function ($named: any, pat: any, rep: any, count: any) {
    maxargs(4, arguments.length);
    ({ pat = pat, rep = rep, count = count } = $named);
    return Strings.prototype['Replace'].call(this, pat, rep, count);
};
(Strings.prototype['Replace'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Replace'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Replace'] as any).$callableType = "BUILTIN";
(Strings.prototype['Replace'] as any).$callableName = "Strings#Replace";
(Strings.prototype['Replace'] as any).$params = 'pat, rep="", count=99999';
//GENERATED end

//BUILTIN Strings.Size()
//GENERATED start
(Strings.prototype['Size'] as any).$call = Strings.prototype['Size'];
(Strings.prototype['Size'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Size'].call(this);
};
(Strings.prototype['Size'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Size'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Size'] as any).$callableType = "BUILTIN";
(Strings.prototype['Size'] as any).$callableName = "Strings#Size";
(Strings.prototype['Size'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Split(sep)
//GENERATED start
(Strings.prototype['Split'] as any).$call = Strings.prototype['Split'];
(Strings.prototype['Split'] as any).$callNamed = function ($named: any, sep: any) {
    maxargs(2, arguments.length);
    ({ sep = sep } = $named);
    return Strings.prototype['Split'].call(this, sep);
};
(Strings.prototype['Split'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Split'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Split'] as any).$callableType = "BUILTIN";
(Strings.prototype['Split'] as any).$callableName = "Strings#Split";
(Strings.prototype['Split'] as any).$params = 'sep';
//GENERATED end

//BUILTIN Strings.Substr(i, n=99999)
//GENERATED start
(Strings.prototype['Substr'] as any).$call = Strings.prototype['Substr'];
(Strings.prototype['Substr'] as any).$callNamed = function ($named: any, i: any, n: any) {
    maxargs(3, arguments.length);
    ({ i = i, n = n } = $named);
    return Strings.prototype['Substr'].call(this, i, n);
};
(Strings.prototype['Substr'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Substr'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Substr'] as any).$callableType = "BUILTIN";
(Strings.prototype['Substr'] as any).$callableName = "Strings#Substr";
(Strings.prototype['Substr'] as any).$params = 'i, n=99999';
//GENERATED end

//BUILTIN Strings.Suffix?()
//GENERATED start
(Strings.prototype['Suffix?'] as any).$call = Strings.prototype['Suffix?'];
(Strings.prototype['Suffix?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Suffix?'].call(this);
};
(Strings.prototype['Suffix?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Suffix?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Suffix?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Suffix?'] as any).$callableName = "Strings#Suffix?";
(Strings.prototype['Suffix?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Tr(from, to="")
//GENERATED start
(Strings.prototype['Tr'] as any).$call = Strings.prototype['Tr'];
(Strings.prototype['Tr'] as any).$callNamed = function ($named: any, from: any, to: any) {
    maxargs(3, arguments.length);
    ({ from = from, to = to } = $named);
    return Strings.prototype['Tr'].call(this, from, to);
};
(Strings.prototype['Tr'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Tr'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Tr'] as any).$callableType = "BUILTIN";
(Strings.prototype['Tr'] as any).$callableName = "Strings#Tr";
(Strings.prototype['Tr'] as any).$params = 'from, to=""';
//GENERATED end

//BUILTIN Strings.Unescape()
//GENERATED start
(Strings.prototype['Unescape'] as any).$call = Strings.prototype['Unescape'];
(Strings.prototype['Unescape'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Unescape'].call(this);
};
(Strings.prototype['Unescape'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Unescape'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Unescape'] as any).$callableType = "BUILTIN";
(Strings.prototype['Unescape'] as any).$callableName = "Strings#Unescape";
(Strings.prototype['Unescape'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Upper()
//GENERATED start
(Strings.prototype['Upper'] as any).$call = Strings.prototype['Upper'];
(Strings.prototype['Upper'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Upper'].call(this);
};
(Strings.prototype['Upper'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Upper'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Upper'] as any).$callableType = "BUILTIN";
(Strings.prototype['Upper'] as any).$callableName = "Strings#Upper";
(Strings.prototype['Upper'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Upper?()
//GENERATED start
(Strings.prototype['Upper?'] as any).$call = Strings.prototype['Upper?'];
(Strings.prototype['Upper?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Upper?'].call(this);
};
(Strings.prototype['Upper?'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Upper?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Upper?'] as any).$callableType = "BUILTIN";
(Strings.prototype['Upper?'] as any).$callableName = "Strings#Upper?";
(Strings.prototype['Upper?'] as any).$params = '';
//GENERATED end

//BUILTIN Strings.Iter()
//GENERATED start
(Strings.prototype['Iter'] as any).$call = Strings.prototype['Iter'];
(Strings.prototype['Iter'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Strings.prototype['Iter'].call(this);
};
(Strings.prototype['Iter'] as any).$callAt = function (args: SuObject) {
    return (Strings.prototype['Iter'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Strings.prototype['Iter'] as any).$callableType = "BUILTIN";
(Strings.prototype['Iter'] as any).$callableName = "Strings#Iter";
(Strings.prototype['Iter'] as any).$params = '';
//GENERATED end

//BUILTIN StringIter.Next()
//GENERATED start
(StringIter.prototype['Next'] as any).$call = StringIter.prototype['Next'];
(StringIter.prototype['Next'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return StringIter.prototype['Next'].call(this);
};
(StringIter.prototype['Next'] as any).$callAt = function (args: SuObject) {
    return (StringIter.prototype['Next'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringIter.prototype['Next'] as any).$callableType = "BUILTIN";
(StringIter.prototype['Next'] as any).$callableName = "StringIter#Next";
(StringIter.prototype['Next'] as any).$params = '';
//GENERATED end

//BUILTIN StringIter.Dup()
//GENERATED start
(StringIter.prototype['Dup'] as any).$call = StringIter.prototype['Dup'];
(StringIter.prototype['Dup'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return StringIter.prototype['Dup'].call(this);
};
(StringIter.prototype['Dup'] as any).$callAt = function (args: SuObject) {
    return (StringIter.prototype['Dup'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringIter.prototype['Dup'] as any).$callableType = "BUILTIN";
(StringIter.prototype['Dup'] as any).$callableName = "StringIter#Dup";
(StringIter.prototype['Dup'] as any).$params = '';
//GENERATED end

//BUILTIN StringIter.Infinite?()
//GENERATED start
(StringIter.prototype['Infinite?'] as any).$call = StringIter.prototype['Infinite?'];
(StringIter.prototype['Infinite?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return StringIter.prototype['Infinite?'].call(this);
};
(StringIter.prototype['Infinite?'] as any).$callAt = function (args: SuObject) {
    return (StringIter.prototype['Infinite?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(StringIter.prototype['Infinite?'] as any).$callableType = "BUILTIN";
(StringIter.prototype['Infinite?'] as any).$callableName = "StringIter#Infinite?";
(StringIter.prototype['Infinite?'] as any).$params = '';
//GENERATED end
