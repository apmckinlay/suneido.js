import * as assert from "./assert";
import { CharMatcher } from "./charmatcher";

export interface ForEach {
    each: (result: Result) => number;
}

export class Result {
    private static readonly MAX_RESULTS = 10;
    public tmp: number[] = new Array(Result.MAX_RESULTS).fill(-1);
    public pos: number[] = new Array(Result.MAX_RESULTS).fill(-1);
    public end: number[] = new Array(Result.MAX_RESULTS).fill(-1);

    public groupCount(): number {
        let n = this.end.indexOf(-1);
        return n === -1 ? 9 : n - 1;
    }
    public group(s: string, i: number): string {
        assert.that(0 <= i && i <= Result.MAX_RESULTS);
        return this.end[i] === -1 ? "" : s.substring(this.pos[i], this.end[i]);
    }
    public toString(): string {
        let str = "";
        for (let i = 0; i < Result.MAX_RESULTS; i++)
            str += `(${this.pos[i]}, ${this.end[i]}) `;
        return str;
    }
}

class Pattern {
    private pat: Element[];

    constructor(pat: Element[]) {
        this.pat = pat;
    }

    /**
    * Find the first match in the string at or after pos.
    * @return Result if a match is found, else null
    */
    public firstMatch(s: string, pos: number): Result | null {
        let result = new Result();
        let sn = s.length;
        assert.that(0 <= pos && pos <= sn);
        let e = this.pat[1];
        for (let si = pos; si <= sn; si = e.nextPossible(s, si, sn))
            if (null !== this.amatch3(s, si, result))
                return result;
        return null;
    }
    /**
    * Find the last match in the string before pos.
    * Does not use the nextPossible optimization so may be slower;
    * @return Result if a match is found, else null
    */
    public lastMatch(s: string, pos: number): Result | null {
        let result = new Result();
        let sn = s.length;
        assert.that(0 <= pos && pos <= sn);
        for (let si = pos; si >= 0; si--)
            if (null !== this.amatch3(s, si, result))
                return result;
        return null;
    }
    /**
    * Calls action for each match in the string.
    */
    public forEachMatch(s: string, action: ForEach): void {
        let result = new Result();
        let sn = s.length;
        let e = this.pat[1];
        for (let si = 0; si <= sn; si = e.nextPossible(s, si, sn))
            if (null !== this.amatch3(s, si, result)) {
                let si2 = action.each(result);
                assert.that(si2 > si);
                si = si2 - 1;
                // -1 since nextPossible will at least increment
            }
    }
    /**
    * Try to match at a specific position.
    * @return Result[] if it matches, else null
    */
    public amatch(s: string, si: number): Result | null {
        return this.amatch3(s, si, new Result());
    }
    private amatch3(s: string, si: number, result: Result): Result | null {
        let alt_si: number[] = [];
        let alt_pi: number[] = [];
        let e: Element;
        for (let pi = 0; pi < this.pat.length; ) {
            e = this.pat[pi];
            if (e instanceof Branch) {
                alt_pi.push(pi + e.alt);
                alt_si.push(si);
                pi += e.main;
            } else if (e instanceof Jump) {
                pi += e.offset;
            } else if (e instanceof Left) {
                if (e.idx < result.tmp.length)
                    result.tmp[e.idx] = si;
                pi++;
            } else if (e instanceof Right) {
                if (e.idx < result.pos.length) {
                    result.pos[e.idx] = result.tmp[e.idx];
                    result.end[e.idx] = si;
                }
                pi++;
            } else {
                si = e.omatch3(s, si, result);
                if (si >= 0)
                    pi++;
                else {
                    if (alt_si.length > 0) {
                        let newSi = alt_si.pop();
                        let newPi = alt_pi.pop();
                        si = newSi === undefined ? Regex.FAIL : newSi;
                        pi = newPi === undefined ? Regex.FAIL : newPi;
                    } else
                        return null;
                }
            }
        }
        return result;
    }
    public toString(): String {
        let sb = "";
        for (let e of this.pat)
            sb += `${e.toString()} `;
        return sb;
    }
}

class Compiler {
    public src: string;
    public si: number = 0;
    public sn: number;
    public pat: Element[] = [];
    public ignoringCase: boolean = false;
    public leftCount: number = 0;
    public inChars = false;
    public inCharsIgnoringCase = false;

    constructor(src: string) {
        this.src = src;
        this.sn = src.length;
    }
    public compile(): Pattern {
        this.emit(Regex.LEFT0);
        this.regex();
        this.emit(Regex.RIGHT0);
        assert.that(this.si >= this.sn, "regex: closing ) without opening (");
        return new Pattern(this.pat);
    }
    private regex(): void {
        let start = this.pat.length;
        this.sequence();
        if (this.match("|")) {
            let len = this.pat.length - start;
            this.insert(start, new Branch(1, len + 2));
            while (true) {
                start = this.pat.length;
                this.sequence();
                len = this.pat.length - start;
                if (this.match("|")) {
                    this.insert(start, new Branch(1, len + 2));
                    this.insert(start, new Jump(len + 2));
                } else
                    break;
            }
            this.insert(start, new Jump(len + 1));
        }
    }
    private sequence(): void {
        while (this.si < this.sn && ! "|)".includes(this.src[this.si]))
            this.element();
    }
    private element(): void {
        if (this.match("^"))
            this.emit(Regex.startOfLine);
        else if (this.match("$"))
            this.emit(Regex.endOfLine);
        else if (this.match("\\A"))
            this.emit(Regex.startOfString);
        else if (this.match("\\Z"))
            this.emit(Regex.endOfString);
        else if (this.match("\\<"))
            this.emit(Regex.startOfWord);
        else if (this.match("\\>"))
            this.emit(Regex.endOfWord);
        else if (this.match("(?i)"))
            this.ignoringCase = true;
        else if (this.match("(?-i)"))
            this.ignoringCase = false;
        else if (this.match("(?q)"))
            this.quoted();
        else if (this.match("(?-q)")) {
            ;
        }
        else {
            let start = this.pat.length;
            this.simple();
            let len = this.pat.length - start;
            if (this.match("??"))
                this.insert(start, new Branch(len + 1, 1));
            else if (this.match("?"))
                this.insert(start, new Branch(1, len + 1));
            else if (this.match("+?"))
                this.emit(new Branch(1, -len));
            else if (this.match("+"))
                this.emit(new Branch(-len, 1));
            else if (this.match("*?")) {
                this.emit(new Branch(1, -len));
                this.insert(start, new Branch(len + 2, 1));
            } else if (this.match("*")) {
                this.emit(new Branch(-len, 1));
                this.insert(start, new Branch(1, len + 2));
            }
        }
    }
    private quoted(): void {
        let start = this.si;
        this.si = this.src.indexOf("(?-q)", this.si);
        if (this.si === -1)
            this.si = this.sn;
        this.emitChars(this.src.substring(start, this.si));
    }
    private simple(): void {
        if (this.match("."))
            this.emit(Regex.any);
        else if (this.match("\\d"))
            this.emit(new CharClass(Regex.digit));
        else if (this.match("\\D"))
            this.emit(new CharClass(Regex.notDigit));
        else if (this.match("\\w"))
            this.emit(new CharClass(Regex.word));
        else if (this.match("\\W"))
            this.emit(new CharClass(Regex.notWord));
        else if (this.match("\\s"))
            this.emit(new CharClass(Regex.space));
        else if (this.match("\\S"))
            this.emit(new CharClass(Regex.notSpace));
        else if (this.matchBackref()) {
            let i = parseInt(this.src[this.si - 1]);
            this.emit(new Backref(i, this.ignoringCase));
        } else if (this.match("[")) {
            this.charClass();
            this.mustMatch("]");
        } else if (this.match("(")) {
            let i = ++this.leftCount;
            this.emit(new Left(i));
            this.regex();
            this.emit(new Right(i));
            this.mustMatch(")");
        } else {
            if (this.si + 1 < this.sn)
                this.match("\\");
            this.si++;
            this.emitChars(this.src.substring(this.si - 1, this.si));
        }
    }
    private emitChars(s: string): void {
        if (this.inChars && this.inCharsIgnoringCase === this.ignoringCase &&
            ! this.next1of("?*+")) {
            (this.pat[this.pat.length - 1] as Chars).add(s);
        } else {
            this.emit(this.ignoringCase ? new CharsIgnoreCase(s) : new Chars(s));
            this.inChars = true;
            this.inCharsIgnoringCase = this.ignoringCase;
        }
    }
    private charClass(): void {
        let negate = this.match("^");
        let chars = "";
        if (this.match("]"))
            chars += "]";
        let cm = CharMatcher.NONE;
        while (this.si < this.sn && this.src[this.si] !== "]") {
            let elem: CharMatcher;
            if (this.matchRange()) {
                let from = this.src[this.si - 3];
                let to = this.src[this.si - 1];
                elem = (from <= to)
                    ? CharMatcher.inRange(from, to)
                    : CharMatcher.NONE;
            } else if (this.match("\\d"))
                elem = Regex.digit;
            else if (this.match("\\D"))
                elem = Regex.notDigit;
            else if (this.match("\\w"))
                elem = Regex.word;
            else if (this.match("\\W"))
                elem = Regex.notWord;
            else if (this.match("\\s"))
                elem = Regex.space;
            else if (this.match("\\S"))
                elem = Regex.notSpace;
            else if (this.match("[:"))
                elem = this.posixClass();
            else {
                if (this.si + 1 < this.sn)
                    this.match("\\");
                chars += this.src[this.si++];
                continue;
            }
            cm = cm.or(elem);
        }
        if (! negate && cm === CharMatcher.NONE && chars.length === 1) {
            // optimization for class with only one character
            this.emitChars(chars);
            return;
        }
        if (chars.length > 0)
            cm = cm.or(CharMatcher.anyOf(chars));
        if (negate)
            cm = cm.negate();
        //cm = cm.precomputed(); // ???
        this.emit(this.ignoringCase ? new CharClassIgnoreCase(cm) : new CharClass(cm));
    }
    private matchRange(): boolean {
        if (this.src[this.si + 1] === '-' && this.si + 2 < this.sn &&
            this.src[this.si + 2] !== ']') {
            this.si += 3;
            return true;
        } else
            return false;
    }
    private posixClass(): CharMatcher {
        if (this.match("alpha:]"))
            return Regex.alpha;
        else if (this.match("alnum:]"))
            return Regex.alnum;
        else if (this.match("blank:]"))
            return Regex.blank;
        else if (this.match("cntrl:]"))
            return Regex.cntrl;
        else if (this.match("digit:]"))
            return Regex.digit;
        else if (this.match("graph:]"))
            return Regex.graph;
        else if (this.match("lower:]"))
            return Regex.lower;
        else if (this.match("print:]"))
            return Regex.print;
        else if (this.match("punct:]"))
            return Regex.punct;
        else if (this.match("space:]"))
            return Regex.space;
        else if (this.match("upper:]"))
            return Regex.upper;
        else if (this.match("xdigit:]"))
            return Regex.xdigit;
        else
            assert.that(false, "bad posix class");
        return Regex.none;
    }
    private next1of(set: string): boolean {
        return this.si < this.sn && set.includes(this.src[this.si]);
    }
    // helpers
    public match(s: string): boolean {
        if (this.src.startsWith(s, this.si)) {
            this.si += s.length;
            return true;
        } else
            return false;
    }
    public mustMatch(s: string): void {
        assert.that(this.match(s), `regex: missing '${s}'`);
    }
    public matchBackref(): boolean {
        if (this.si + 2 > this.sn || this.src[this.si] !== '\\')
            return false;
        let i = parseInt(this.src[this.si + 1]);
        if (isNaN(i) || i < 1 || i > 9)
            return false;
        this.si += 2;
        return true;
    }
    public emit(e: Element): void {
        this.pat.push(e);
        this.inChars = false;
    }
    public insert(i: number, e: Element): void {
        this.pat.splice(i, 0, e);
        this.inChars = false;
    }
}

// elements of compiled regex ----------------------------------------------
abstract class Element {
    public omatch(s: string, si: number): number {
        assert.that(false, "must be overridden");
        return Regex.FAIL;
    };
    public nextPossible(s: string, si: number, sn: number): number {
        return si + 1;
    };
    public omatch3(s: string, si: number, res: Result): number {
        return this.omatch(s, si);
    }
}
class StartOfLine extends Element {
    public omatch(s: string, si: number): number {
        return (si === 0 || s[si - 1] === '\r' ||
            s[si - 1] === '\n') ? si : Regex.FAIL;
    }
    public nextPossible(s: string, si: number, sn: number): number {
        if (si === sn)
            return si + 1;
        let j = s.indexOf('\n', si);
        return j === -1 ? sn : j + 1;
    }
    public toString(): string {
        return '^';
    }
}
class EndOfLine extends Element {
    public omatch(s: string, si: number): number {
        return (si >= s.length || s[si] === '\r' ||
            s[si] === '\n') ? si : Regex.FAIL;
    }
    public toString(): string {
        return '$';
    }
}
class StartOfString extends Element {
    public omatch(s: string, si: number): number {
        return (si === 0) ? si : Regex.FAIL;
    }
    public nextPossible(s: string, si: number, sn: number): number {
        return sn + 1; // only the initial position is possible
    }
    public toString(): string {
        return '\\A';
    }
}
class EndOfString extends Element {
    public omatch(s: string, si: number): number {
        return (si >= s.length) ? si : Regex.FAIL;
    }
    public toString(): string {
        return '\\Z';
    }
}
class StartOfWord extends Element {
    public omatch(s: string, si: number): number {
        return (si === 0 || ! Regex.word.matches(s[si - 1])) ? si : Regex.FAIL;
    }
    public toString(): string {
        return '\\<';
    }
}
class EndOfWord extends Element {
    public omatch(s: string, si: number): number {
        return (si >= s.length || ! Regex.word.matches(s[si])) ? si : Regex.FAIL;
    }
    public toString(): string {
        return '\\>';
    }
}
class Backref extends Element {
    private idx: number;
    private ignoringCase: boolean;
    constructor(idx: number, ignoringCase: boolean) {
        super();
        this.idx = idx;
        this.ignoringCase = ignoringCase;
        assert.that(1 <= this.idx && this.idx <= 9);
    }
    public omatch3(s: string, si: number, res: Result): number {
        if (res.end[this.idx] === -1)
            return Regex.FAIL;
        let b = s.substring(res.pos[this.idx], res.end[this.idx]);
        if (this.ignoringCase) {
            let len = b.length;
            if (si + len > s.length)
                return Regex.FAIL;
            if (s.substr(si, len).toLowerCase() !== b.toLowerCase())
                return Regex.FAIL;
        } else if (! s.startsWith(b, si))
            return Regex.FAIL;
        return si + b.length;
    }
    public toString(): string {
        return `${this.ignoringCase ? "i" : ""}\\${this.idx}`;
    }
}
class Chars extends Element {
    protected chars: string;
    constructor(chars: string) {
        super();
        this.chars = chars;
    }
    public add(s: string): void {
        this.chars += s;
    }
    public omatch(s: string, si: number): number {
        if (! s.startsWith(this.chars, si))
            return Regex.FAIL;
        return si + this.chars.length;
    }
    public nextPossible(s: string, si: number, sn: number): number {
        let j = s.indexOf(this.chars, si + 1);
        return j === -1 ? sn + 1 : j;
    }
    public toString(): string {
        return `'${this.chars}'`;
    }
}
class CharsIgnoreCase extends Chars {
    constructor(chars: string) {
        super(chars.toLowerCase());
    }
    public add(s: string): void {
        this.chars += s.toLowerCase();
    }
    public omatch(s: string, si: number): number {
        if (! s.toLowerCase().startsWith(this.chars, si))
            return Regex.FAIL;
        return si + this.chars.length;
    }
    public nextPossible(s: string, si: number, sn: number): number {
        let sLowerCase = s.toLowerCase();
        let j = sLowerCase.indexOf(this.chars, si + 1);
        return j === -1 ? sn + 1 : j;
    }
    public toString(): string {
        return `i'${this.chars}'`;
    }
}
class CharClass extends Element {
    private cm: CharMatcher;
    constructor(cm: CharMatcher) {
        super();
        this.cm = cm;
    }
    public omatch(s: string, si: number): number {
        if (si >= s.length)
            return Regex.FAIL;
        return this.cm.matches(s[si]) ? si + 1 : Regex.FAIL;
    }
    public nextPossible(s: string, si: number, sn: number): number {
        if (si >= sn)
            return sn + 1;
        let j = this.cm.indexIn(s, si + 1);
        return j === -1 ? sn + 1 : j;
    }
    public toString(): string {
        return this.cm.toString();
    }
}
class CharClassIgnoreCase extends Element {
    private cm: CharMatcher;
    constructor(cm: CharMatcher) {
        super();
        this.cm = cm;
    }
    public omatch(s: string, si: number): number {
        if (si >= s.length)
            return Regex.FAIL;
        let c = s[si];
        return this.cm.matches(c.toLowerCase()) || this.cm.matches(c.toUpperCase()) ?
            si + 1 :
            Regex.FAIL;
    }
    public nextPossible(s: string, si: number, sn: number): number {
        if (si >= sn)
            return sn + 1;
        let sLowerCase = s.toLowerCase();
        let sUpperCase = s.toUpperCase();
        for (si++; si < sn; si++)
            if (this.cm.matches(sLowerCase[si]) || this.cm.matches(sUpperCase[si]))
                return si;
        return sn + 1;
    }
    public toString(): string {
        return `i${this.cm.toString()}`;
    }
}
class Branch extends Element {
    public main: number;
    public alt: number;
    constructor(main: number, alt: number) {
        super();
        this.main = main;
        this.alt = alt;
    }
    public toString(): string {
        return `Branch(${this.main}, ${this.alt})`;
    }
}
class Jump extends Element {
    public offset: number;
    constructor(offset: number) {
        super();
        this.offset = offset;
    }
    public toString(): string {
        return `Jump(${this.offset})`;
    }
}
class Left extends Element {
    public idx: number;
    constructor(idx: number) {
        super();
        this.idx = idx;
    }
    public toString(): string {
        return this.idx === 0 ? "" : `Left${this.idx}`;
    }
}
class Right extends Element {
    public idx: number;
    constructor(idx: number) {
        super();
        this.idx = idx;
    }
    public toString(): string {
        return this.idx === 0 ? "" : `Right${this.idx}`;
    }
}

export class Regex {
    public static readonly none = CharMatcher.anyOf("");
    public static readonly blank = CharMatcher.anyOf(" \t");
    public static readonly digit = CharMatcher.anyOf("0123456789");
    public static readonly notDigit = Regex.digit.negate();
    public static readonly lower = CharMatcher.inRange('a', 'z');
    public static readonly upper = CharMatcher.inRange('A', 'Z');
    public static readonly alpha = Regex.lower.or(Regex.upper);
    public static readonly alnum = Regex.digit.or(Regex.alpha);
    public static readonly punct = CharMatcher.anyOf("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");
    public static readonly graph = Regex.alnum.or(Regex.punct);
    public static readonly print = Regex.graph.or(CharMatcher.is(' '));
    public static readonly xdigit = CharMatcher.anyOf("0123456789abcdefABCDEF");
    public static readonly space = CharMatcher.anyOf(" \t\r\n");
    public static readonly notSpace = Regex.space.negate();
    public static readonly cntrl = CharMatcher.inRange('\u0000', '\u001f')
                                       .or(CharMatcher.inRange('\u007f', '\u009f'));
    public static readonly word = Regex.alnum.or(CharMatcher.is('_'));
    public static readonly notWord = Regex.word.negate();

    public static readonly startOfLine = new StartOfLine();
    public static readonly endOfLine = new EndOfLine();
    public static readonly startOfString = new StartOfString();
    public static readonly endOfString = new EndOfString();
    public static readonly startOfWord = new StartOfWord();
    public static readonly endOfWord = new EndOfWord();
    public static readonly any = (function(){
        let obj = new CharClass(CharMatcher.noneOf("\r\n"));
        obj.toString = () => { return "."; };
        return obj;
    })();
    public static readonly LEFT0 = new Left(0);
    public static readonly RIGHT0 = new Right(0);

    public static readonly FAIL = Number.MIN_SAFE_INTEGER;

    public static compile(rx: string): Pattern {
        return new Compiler(rx).compile();
    }
}
