/**
 * SuNum implements immutable decimal floating point numbers
 * on top of JavaScript binary floating point numbers
 * The representation is a coefficient and an exponent
 * where both are integers.
 * The sign of the number is the sign of the coefficient.
 * Infinite is represented by an infinite coefficient and a large exponent.
 */

import * as assert from "./assert";
import { SuValue } from "./suvalue";

const minExp = -126;
const maxExp = +126;
const expInf = 127;
const MAX_COEF_STR = "" + Number.MAX_SAFE_INTEGER;

export enum RoundingMode { HALF_UP = 0, DOWN = -0.5, UP = 0.5 }

export class SuNum extends SuValue {
    public coef: number;
    public exp: number;

    private constructor(coef: number, exp: number) {
        super();
        this.coef = coef;
        this.exp = exp;
    }

    static fromNumber(n: number): SuNum {
        if (Number.isSafeInteger(n))
            return Object.freeze(new SuNum(n, 0));
        return SuNum.parse(n.toString())!; // is there a better way?
    }

    /**
     * Convert a string to a SuNum.
     * @param s {string}
     * @returns {object|false} a SuNum, or null if not a valid number
     */
    static parse(s: string): SuNum | null {
        if (typeof s !== "string" || s.length === 0)
            return null; // invalid input
        if (s === "0")
            return SuNum.ZERO;
        let i = 0;
        let sign = s[i] === '-' ? -1 : 1;
        if (s[i] === '+' || s[i] === '-')
            i++;
        let before = spanDigits(s, i);
        i += before.length;
        before = trimLeft(before, '0');
        let after = "";
        if (i < s.length && s[i] === '.') {
            i++;
            after = spanDigits(s, i);
            i += after.length;
        }
        after = trimRight(after, '0');

        let exp = 0;
        if (i < s.length && s[i].toLowerCase() === 'e') {
            i++;
            let es = spanSignedDigits(s, i);
            exp = parseInt(es, 10);
            i += es.length;
        }
        if (i < s.length)
            return null; // invalid input
        exp -= after.length;
        let carry = 0;
        let digits = before + after;
        while (cmpNumStr(digits, MAX_COEF_STR) >= 0) {
            exp++;
            carry = digits[digits.length - 1] < '5' ? 0 : 1;
            digits = digits.substring(0, digits.length - 1);
        }
        let coef = carry + parseInt(digits, 10);
        return SuNum.make(sign * coef, exp);
    }

    /**
    * make constructs a SuNum
    * @param {number} coef integer, may be infinite
    * @param {number} [exp=0] integer, outside range of -126 to 126 will become infinite
    * @returns {Object} an immutable SuNum
    */
    static make(coef: number, exp: number = 0): SuNum {
        if (coef === 0)
            return SuNum.ZERO;
        if (coef === Number.NEGATIVE_INFINITY)
            return SuNum.MINUS_INF;
        if (coef === Number.POSITIVE_INFINITY)
            return SuNum.INF;
        if (!Number.isSafeInteger(coef))
            throw "SuNum.make invalid coefficient: " + coef;
        else if (!Number.isSafeInteger(exp))
            throw "SuNum.make invalid exponent: " + exp;
        if (exp < minExp)
            return SuNum.ZERO;
        if (exp > maxExp)
            return coef < 0 ? SuNum.MINUS_INF : SuNum.INF;
        return Object.freeze(new SuNum(coef, exp));
    }

    /**
     * toString converts a SuNum to a string.
     * If the exponent is 0 it will print the number as an integer.
     * Otherwise it will try to avoid scientific notation
     * adding up to 4 zeroes at the end or 3 zeroes at the beginning.
     * @returns {string}
     */
    toString(): string {
        let c = this.coef;
        let e = this.exp;
        if (c === 0)
            return "0";
        while (e < 0 && c % 10 === 0) {
            c /= 10;
            e++;
        }
        let sign = c < 0 ? "-" : "";
        if (this.isInf())
            return sign + "inf";
        let digits = "" + Math.abs(c);
        if (0 <= e && e <= 4)
            return sign + digits + "0".repeat(e);
        let se = "";
        if (-digits.length - 4 < e && e <= -digits.length)
            digits = "." + "0".repeat(-e - digits.length) + digits;
        else if (-digits.length < e && e <= -1) {
            let i = digits.length + e;
            digits = digits.substring(0, i) + "." + digits.substring(i);
        } else {
            e += digits.length - 1;
            digits = digits.substring(0, 1) + "." + digits.substring(1);
            se = "e" + e;
        }
        digits = digits.replace(/0*$/, "");
        digits = digits.replace(/\.$/, "");
        return sign + digits + se;
    }

    /**
     * @returns {boolean} whether or not the SuNum is an integer
     */
    isInt(): boolean {
        let e = this.exp;
        if (e < -16)
            return false;
        let c = this.coef;
        while (e < 0 && c % 10 === 0) {
            c /= 10;
            e++;
        }
        return e >= 0;
    }

    /**
     * @returns {boolean} whether or not the SuNum is zero
     */
    isZero(): boolean {
        return this.coef === 0;
    }

    /**
     * @returns {boolean} whether or not the SuNum is infinite
     */
    isInf(): boolean {
        return !isFinite(this.coef);
    }

    /**
     * @returns {number} 0, +1, or -1
     */
    sign(): number {
        return this.coef === 0 ? 0 : this.coef > 0 ? +1 : -1;
    }

    /**
     * @returns {Object} the negative of a SuNum (but not negative zero)
     */
    neg(): SuNum {
        if (this.coef === 0)
            return SuNum.ZERO; // avoid -0 coefficient
        return SuNum.make(-this.coef, this.exp);
    }

    /**
     * @returns {Object} the absolute value of a SuNum
     */
    abs(): SuNum {
        return SuNum.make(Math.abs(this.coef), this.exp);
    }

    /**
     * @returns {number} the integer part of a SuNum either rounded or truncated
     * zero if the absolute value < .5, infinite if too large
     */
    toInt(trunc = false): number {
        if (this.exp < -16 || this.coef === 0)
            return 0;
        let n = SuNum.mutable(this);

        while (n.exp > 0 && SuNum.shiftLeft(n)) {
        }

        let roundup = false;
        while (n.exp < 0 && n.coef !== 0)
            roundup = SuNum.shiftRight(n);
        if (roundup && !trunc)
            n.coef += (this.coef < 0 ? -1 : +1);

        if (n.exp < 0 || n.coef === 0)
            return 0;
        else if (n.exp > 0)
            return n.coef > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        else
            return n.coef;
    }

    /**
     * @returns {number} this SuNum converted to a JavaScript number
     */
    toNumber(): number {
        return this.coef * Math.pow(10, this.exp);
    }

    /**
     * @param that
     * @returns {boolean} true if that is a number equal to this, else false
     */
    equals(that: any): boolean {
        if (typeof that === 'number')
            return this.toNumber() === that;
        if (that instanceof SuNum)
            return 0 === SuNum.cmp(this, that);
        return false;
    }

    compareTo(that: any): number {
        if (typeof that === 'number')
            that = SuNum.fromNumber(that);
        else if (! (that instanceof SuNum))
            throw new Error("SuNum.compareTo incompatible type");
        return SuNum.cmp(this, that);
    }

    // cmp compares two SuNums, returning 0, -1, or +1
    static cmp(x: SuNum, y: SuNum): number {
        if (x.sign() < y.sign())
            return -1;
        else if (x.sign() > y.sign())
            return +1;
        else if (SuNum.same(x, y))
            return 0;
        else
            return SuNum.sub(x, y).sign();
    }

    type(): string {
        return "Number";
    }

    display(): string {
        return this.toString();
    }

    round(d: number, roundingMode: RoundingMode): SuNum {
        if (this.isZero())
            return SuNum.ZERO;
        let c = Math.abs(this.coef);
        let e = this.exp;
        let sign = this.sign();
        let newCoef = sign * Math.round(Number(c + 'e' + (e + d)) + roundingMode);
        return SuNum.make(newCoef, -d);
    }

    frac(): SuNum {
        if (this.isInt())
            return SuNum.ZERO;

        let sign = this.sign();
        let numStr = Math.abs(this.coef).toString();
        let pos = Math.max(numStr.length + this.exp, 0);
        let fracNumberStr = numStr.slice(pos);
        return SuNum.make(sign * Number(fracNumberStr), this.exp);
    }

    // sub returns the difference of two SuNums
    static sub(x: SuNum, y: SuNum): SuNum {
        // could avoid copy by duplicating add code
        y = SuNum.mutable(y);
        y.coef *= -1;
        return SuNum.add(x, y);
    }

    // add returns the sum of two SuNums
    static add(x: SuNum, y: SuNum): SuNum {
        if (x.exp !== y.exp) {
            x = SuNum.mutable(x);
            y = SuNum.mutable(y);
            SuNum.align(x, y);
        }
        let c = x.coef + y.coef;
        if (isNaN(c)) // NaN from adding +inf and -inf
            return SuNum.ZERO;
        if (c < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < c) { // overflow
            x = SuNum.mutable(x);
            y = SuNum.mutable(y);
            if (SuNum.shiftRight(x))
                x.coef++;
            if (SuNum.shiftRight(y))
                y.coef++;
            c = x.coef + y.coef;
        }
        return SuNum.make(c, x.exp);
    }

    private static align(x: SuNum, y: SuNum): void {
        if (x.exp > y.exp) {
            // swap
            let tmp = x.coef; x.coef = y.coef; y.coef = tmp;
            tmp = x.exp; x.exp = y.exp; y.exp = tmp;
        }
        while (y.exp > x.exp && SuNum.shiftLeft(y)) {
        }

        let roundup = false;
        while (y.exp > x.exp && x.coef !== 0)
            roundup = SuNum.shiftRight(x);
        if (x.exp !== y.exp) {
            assert.equal(x.coef, 0);
            x.exp = y.exp;
        } else if (roundup)
            x.coef += x.coef < 0 ? -1 : +1;
    }

    private static shiftLeft(n: SuNum): boolean {
        let c = n.coef * 10;
        if (!Number.isSafeInteger(c))
            return false;
        n.coef = c;
        if (n.exp > minExp)
            n.exp--;
        return true;
    }

    private static shiftRight(n: SuNum): boolean {
        if (n.coef === 0)
            return false;
        let roundup = Math.abs(n.coef % 10) >= 5;
        n.coef = Math.trunc(n.coef / 10);
        if (n.exp < expInf)
            n.exp++;
        return roundup;
    }

    // mul returns the product of two SuNums
    static mul(x: SuNum, y: SuNum): SuNum {
        return convert(x.coef * y.coef, x.exp + y.exp);
    }

    // div returns the quotient of two SuNums
    static div(x: SuNum, y: SuNum): SuNum {
        if (x.isZero())
            return SuNum.ZERO;
        else if (y.isZero())
            return SuNum.inf(x.sign());
        else if (x.isInf()) {
            let sign = x.sign() * y.sign();
            return y.isInf() ? SuNum.make(sign) : SuNum.inf(sign);
        } else if (y.isInf())
            return SuNum.ZERO;
        return convert(x.coef / y.coef, x.exp - y.exp);
    }

    // helpers ---------------------------------------------------------------------

    static inf(sign: number): SuNum {
        return sign < 1 ? SuNum.MINUS_INF : SuNum.INF;
    }

    // return a mutable version of a number
    private static mutable(n: SuNum): SuNum {
        return Object.isFrozen(n) ? new SuNum(n.coef, n.exp) : n;
    }

    static ZERO = Object.freeze(new SuNum(0, 0));
    static INF = Object.freeze(new SuNum(Number.POSITIVE_INFINITY, expInf));
    static MINUS_INF = Object.freeze(new SuNum(Number.NEGATIVE_INFINITY, expInf));

    private static same(x: SuNum, y: SuNum): boolean {
        // warning: 1e2 will not be the "same" as 100
        return x.coef === y.coef && x.exp === y.exp;
    }

    /**
     * format converts a SuNum to a formatted string .
     *  If the mask is not long enough to handle the number (i.e. not enough digits),
     *  then "#" will be returned.
     * @param mask
     * @returns {string}
     */
    format(mask: string): string {
        let x = SuNum.mutable(this.abs());
        let maskSize = mask.length;
        let num = "";
        let i = mask.indexOf('.');

        if (this.isZero()) {
            if (i !== -1) {
                let zeros = 0;
                for (++i; i < maskSize && mask[i] === '#'; ++i)
                    zeros++;
                num = '0'.repeat(zeros);
            }
        } else {
            if (i !== -1) {
                let overflow = false;
                let origExp = x.exp;
                for (++i; i < maskSize && mask[i] === '#' && !overflow; ++i)
                    overflow = overflow || !SuNum.shiftLeft(x);
                x.exp = origExp;
                if (overflow)
                    return '#';
            }
            let tmp = x.toInt();
            num = tmp.toString();
        }
        let sign = this.sign();
        let signOk = sign >= 0;
        let p;
        let q;
        let dst = "";
        let dstArray = [];
        for (p = num.length - 1, q = maskSize - 1; q >= 0; --q) {
            let c = mask[q];
            switch (c) {
            case '#':
                dstArray.push(p >= 0 ? num[p--] : '0');
                break;
            case ',':
                if (p >= 0)
                    dstArray.push(c);
                break;
            case '-':
            case '(':
                signOk = true;
                if (sign < 0)
                    dstArray.push(c);
                break;
            case ')':
                dstArray.push(sign < 0 ? c : ' ');
                break;
            case '.':
            default:
                dstArray.push(c);
                break;
            }
        }
        if (p >= 0)
            return '#';
        if (!signOk)
            return '-';

        dst = dstArray.reverse().join('');
        let start = 0;
        while (dst[start] === '-' || dst[start] === '(')
            ++start;
        let end = start;
        while (dst[end] === '0' && end < dst.length - 1)
            ++end;
        if (end > start && dst[end] === '.' &&
            (end >= dst.length - 1 || !isDigit(dst[end + 1])))
            --end;
        if (start < end)
            dst = dst.substring(0, start) + dst.substring(end);
        return dst;
    }
} // end of class

function spanSignedDigits(s: string, start: number): string {
    let i = start;
    let c = s[start];
    if (c === '+' || c === '-')
        ++i;
    return s.substring(start, skipDigits(s, i));
}

function spanDigits(s: string, start: number): string {
    return s.substring(start, skipDigits(s, start));
}

function skipDigits(s: string, i: number): number {
    let n = s.length;
    while (i < n && isDigit(s[i]))
        ++i;
    return i;
}

function isDigit(c: string): boolean {
    return '0' <= c && c <= '9';
}

function trimRight(s: string, c: string): string {
    let i = s.length - 1;
    while (s[i] === c)
        i--;
    return s.substring(0, i + 1);
}

function trimLeft(s: string, c: string): string {
    let i = 0;
    while (s[i] === c)
        i++;
    return s.substring(i);
}

function cmpNumStr(x: string, y: string): number {
    if (x.length !== y.length)
        return x.length - y.length;
    return x > y ? +1 : x < y ? -1 : 0;
}

export function convert(c: number, e: number): SuNum {
    if (c === Number.NEGATIVE_INFINITY)
        return SuNum.MINUS_INF;
    if (c === Number.POSITIVE_INFINITY)
        return SuNum.INF;
    if (Number.isSafeInteger(c))
        return SuNum.make(c, e); // fast path
    c *= Math.pow(10, e);
    return SuNum.fromNumber(c);
}
