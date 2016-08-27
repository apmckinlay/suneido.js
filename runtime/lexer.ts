/**
 * Lexical scanner for the Suneido language.
 * Used by portable tests (porttests.ts)
 */

import { isWhite, isAlpha, isDigit, isHexDigit, isAlphaNum } from "./utility";
import { Token, keywords } from "./tokens";

export class Lexer {
    private src: string;
    private si: number;
    private _prev: number | undefined;
    private _value: string | undefined;
    private _keyword: Token | undefined;

    constructor(src: string) {
        this.src = src;
        this.si = 0;
    }

    prev(): number | undefined {
        return this._prev;
    }

    value(): string | undefined {
        return this._value;
    }

    keyword(): Token | undefined {
        return this._keyword;
    }

    next(): Token {
        this._prev = this.si;
        this._value = undefined;
        this._keyword = undefined;
        if (this.si >= this.src.length)
            return Token.EOF;
        let c = this.src[this.si];
        if (isWhite(c))
            return this.whitespace();
        this.si++;
        switch (c) {
            case '#':
                return Token.HASH;
            case '(':
                return Token.L_PAREN;
            case ')':
                return Token.R_PAREN;
            case ',':
                return Token.COMMA;
            case ';':
                return Token.SEMICOLON;
            case '?':
                return Token.Q_MARK;
            case '@':
                return Token.AT;
            case '[':
                return Token.L_BRACKET;
            case ']':
                return Token.R_BRACKET;
            case '{':
                return Token.L_CURLY;
            case '}':
                return Token.R_CURLY;
            case '~':
                return Token.BITNOT;
            case ':':
                return this.matchChar(':') ? Token.RANGELEN : Token.COLON;
            case '=':
                return this.matchChar('=') ? Token.IS
                    : this.matchChar('~') ? Token.MATCH : Token.EQ;
            case '!':
                return this.matchChar('=') ? Token.ISNT
                    : this.matchChar('~') ? Token.MATCHNOT : Token.NOT;
            case '<':
                return this.matchChar('<') ? (this.matchChar('=') ? Token.LSHIFTEQ : Token.LSHIFT)
                    : this.matchChar('>') ? Token.ISNT : this.matchChar('=') ? Token.LTE : Token.LT;
            case '>':
                return this.matchChar('>') ? (this.matchChar('=') ? Token.RSHIFTEQ : Token.RSHIFT)
                    : this.matchChar('=') ? Token.GTE : Token.GT;
            case '|':
                return this.matchChar('|') ? Token.OR
                    : this.matchChar('=') ? Token.BITOREQ : Token.BITOR;
            case '&':
                return this.matchChar('&') ? Token.AND
                    : this.matchChar('=') ? Token.BITANDEQ : Token.BITAND;
            case '^':
                return this.matchChar('=') ? Token.BITXOREQ : Token.BITXOR;
            case '-':
                return this.matchChar('-') ? Token.DEC
                    : this.matchChar('=') ? Token.SUBEQ : Token.SUB;
            case '+':
                return this.matchChar('+') ? Token.INC
                    : this.matchChar('=') ? Token.ADDEQ : Token.ADD;
            case '/':
                return this.matchChar('/') ? this.lineComment()
                    : this.matchChar('*') ? this.spanComment()
                        : this.matchChar('=') ? Token.DIVEQ : Token.DIV;
            case '*':
                return this.matchChar('=') ? Token.MULEQ : Token.MUL;
            case '%':
                return this.matchChar('=') ? Token.MODEQ : Token.MOD;
            case '$':
                return this.matchChar('=') ? Token.CATEQ : Token.CAT;
            case '`':
                return this.rawString();
            case '"':
            case '\'':
                return this.quotedString(c);
            case '.':
                return this.matchChar('.') ? Token.RANGETO
                    : isDigit(this.src[this.si]) ? this.number()
                        : Token.DOT;
            default:
                return isDigit(c) ? this.number()
                    : (c === '_' || isAlpha(c)) ? this.identifier()
                        : Token.ERROR;
        }
    }

    private whitespace(): Token {
        let eol = false;
        for (; isWhite(this.src[this.si]); ++this.si)
            if (this.src[this.si] === '\n' || this.src[this.si] === '\r')
                eol = true;
        return eol ? Token.NEWLINE : Token.WHITESPACE;
    }

    private lineComment(): Token {
        this.matchWhile(c => c !== '\r' && c !== '\n');
        return Token.COMMENT;
    }

    private spanComment(): Token {
        while (this.si < this.src.length &&
            (this.src[this.si] !== '*' || this.src[this.si + 1] !== '/'))
            ++this.si;
        if (this.si < this.src.length)
            this.si += 2;
        return Token.COMMENT;
    }

    private rawString(): Token {
        this.matchWhile(c => c !== '`');
        this.matchChar('`');
        this._value = this.src.slice(this._prev + 1, this.si - 1);
        return Token.STRING;
    }

    private quotedString(quote: string): Token {
        let str = "";
        while (this.si < this.src.length && this.src[this.si] !== quote)
            str += this.escape();
        this.matchChar(quote);
        this._value = str;
        return Token.STRING;
    }
    private escape(): string {
        if (!this.matchChar('\\'))
            return this.src[this.si++];
        let save = this.si;
        let d1: number | null;
        let d2: number | null;
        let d3: number | null;
        if (this.matchChar('n'))
            return '\n';
        else if (this.matchChar('r'))
            return '\r';
        else if (this.matchChar('t'))
            return '\t';
        else if (this.matchChar('\\'))
            return '\\';
        else if (this.matchChar('"'))
            return '"';
        else if (this.matchChar('\''))
            return '\'';
        else if (this.matchChar('x') &&
            null !== (d1 = this.digit(16)) && null !== (d2 = this.digit(16)))
            return String.fromCharCode(16 * d1 + d2);
        else if (null !== (d1 = this.digit(8)) && null !== (d2 = this.digit(8)) &&
            null !== (d3 = this.digit(8)))
            return String.fromCharCode(64 * d1 + 8 * d2 + d3);
        else {
            this.si = save;
            return '\\';
        }
    }
    private digit(radix: number): number | null {
        const ASCII_ZERO = '0'.charCodeAt(0);
        const ASCII_A = 'a'.charCodeAt(0);

        let c = this.src[this.si++];
        let dig = isDigit(c) ? c.charCodeAt(0) - ASCII_ZERO
            : isHexDigit(c) ? 10 + c.toLowerCase().charCodeAt(0) - ASCII_A
                : 99;
        return (dig < radix) ? dig : null;
    }

    private number(): Token {
        --this.si;
        if (this.hexNumber())
            return Token.NUMBER;
        this.matchWhile(isDigit);
        if (this.matchChar('.'))
            this.matchWhile(isDigit);
        this.exponent();
        if (this.src[this.si - 1] === '.')
            --this.si; // don't absorb trailing period
        this.setValue();
        return Token.NUMBER;
    }
    private hexNumber(): boolean {
        let save = this.si;
        if (this.matchChar('0') && (this.matchChar('x') || this.matchChar('X')) &&
            this.matchWhile(isHexDigit)) {
            this.setValue();
            return true;
        }
        this.si = save;
        return false;
    }
    private exponent(): void {
        let save = this.si;
        if (this.matchChar('e') || this.matchChar('E')) {
            this.matchIf(c => c === '+' || c === '-');
            if (this.matchWhile(isDigit))
                return;
        }
        this.si = save;
    }

    private identifier(): Token {
        this.matchWhile(c => isAlphaNum(c) || c === '_');
        this.matchIf(c => c === '!' || c === '?');
        this.setValue();

        this._keyword = keywords[this._value!];
        let isop = isOperatorKeyword(this._keyword);
        if (isop && this.src[this.si] === ':')
            this._keyword = undefined;
        return this._keyword && isop ? this._keyword : Token.IDENTIFIER;

        function isOperatorKeyword(t: Token): boolean {
            return t === Token.IS || t === Token.ISNT || t === Token.AND ||
                t === Token.OR || t === Token.NOT;
        }
    }

    private matchChar(c: string): boolean {
        if (this.src[this.si] !== c)
            return false;
        ++this.si;
        return true;
    }

    private matchIf(pred: (s: string) => boolean): boolean {
        if (this.si >= this.src.length || !pred(this.src[this.si]))
            return false;
        ++this.si;
        return true;
    }

    private matchWhile(pred: (s: string) => boolean): boolean {
        let start = this.si;
        while (this.si < this.src.length && pred(this.src[this.si]))
            ++this.si;
        return this.si > start;
    }

    private setValue(): void {
        this._value = this.src.substring(this._prev!, this.si);
    }

}
