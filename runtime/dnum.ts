/**
 * dnum implements immutable decimal floating point numbers
 * on top of JavaScript binary floating point numbers
 * The representation is a coefficient and an exponent
 * where both are integers.
 * The sign of the number is the sign of the coefficient.
 * Infinite is represented by an infinite coefficient and a large exponent.
 *
 * Created by andrew on 2015-05-17.
 */

const minExp = -126;
const maxExp = +126;
const expInf = 127;
const maxInt = 9007199254740992;
const minInt = -9007199254740992;

export default class Dnum {
    private coef: number;
    private exp: number;

    /*private*/ constructor(coef: number, exp: number) {
        this.coef = coef;
        this.exp = exp;
    }

    static fromNumber(n: number): Dnum {
        return Dnum.parse(n.toExponential(14)); // is there a better way?
    }

    /**
     * Convert a string to a dnum.
     * @param s {string}
     * @returns {object|false} a dnum, or null if not a valid number
     */
    static parse(s: string): Dnum {
        if (typeof s !== "string" || s.length === 0)
            return null; // invalid input
        if (s === "0")
            return Dnum.ZERO;
        var i = 0;
        var before = spanSignedDigits(s, i);
        i += before.length;
        var after = "";
        if (i < s.length && s.charAt(i) === '.') {
            i++;
            after = spanDigits(s, i);
            i += after.length;
        }
        after = trimRight(after, '0');

        var exp = 0;
        if (i < s.length && s.charAt(i).toLowerCase() === 'e') {
            i++;
            var es = spanSignedDigits(s, i);
            exp = parseInt(es);
            i += es.length;
        }
        if (i < s.length)
            return null; // invalid input
        exp -= after.length;
        var coef = parseInt(before + after);
        return Dnum.make(coef, exp);
    }

    /**
    * make constructs a dnum
    * @param {number} coef integer, may be infinite
    * @param {number} [exp=0] integer, outside range of -126 to 126 will become infinite
    * @returns {Object} an immutable dnum
    */
    static make(coef: number, exp = 0): Dnum {
        if (coef === 0)
            return Dnum.ZERO;
        if (coef === Number.NEGATIVE_INFINITY)
            return Dnum.MINUS_INF;
        if (coef === Number.POSITIVE_INFINITY)
            return Dnum.INF;
        if (!isInteger(coef))
            throw "Dnum.make invalid coefficient: " + coef;
        //if (exp === undefined)
        //    exp = 0;
        else if (!isInteger(exp))
            throw "Dnum.make invalid exponent: " + exp;
        if (exp < minExp)
            return Dnum.ZERO;
        if (exp > maxExp)
            return coef < 0 ? Dnum.MINUS_INF : Dnum.INF;
        return Object.freeze(new Dnum(coef, exp));
    }

    /**
     * toString converts a Dnum to a string.
     * If the exponent is 0 it will print the number as an integer.
     * Otherwise it will try to avoid scientific notation
     * adding up to 4 zeroes at the end or 3 zeroes at the beginning.
     * @returns {string}
     */
    toString(): string {
        var c = this.coef;
        var e = this.exp;
        if (c === 0)
            return "0";
        while (e < 0 && c % 10 === 0) {
            c /= 10;
            e++;
        }
        var sign = c < 0 ? "-" : "";
        if (this.isInf())
            return sign + "inf";
        var digits = "" + Math.abs(c);
        if (0 <= e && e <= 4)
            return sign + digits + "0".repeat(e);
        var se = "";
        if (-digits.length - 4 < e && e <= -digits.length)
            digits = "." + "0".repeat(-e - digits.length) + digits;
        else if (-digits.length < e && e <= -1) {
            var i = digits.length + e;
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
     * @returns {boolean} whether or not the dnum is an integer
     */
    isInt(): boolean {
        var e = this.exp;
        if (e < -16)
            return false;
        var c = this.coef;
        while (e < 0 && c % 10 === 0) {
            c /= 10;
            e++;
        }
        return e >= 0;
    }

    /**
     * @returns {boolean} whether or not the dnum is zero
     */
    isZero(): boolean {
        return this.coef === 0;
    }

    /**
     * @returns {boolean} whether or not the dnum is infinite
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
     * @returns {Object} the negative of a dnum (but not negative zero)
     */
    neg(): Dnum {
        if (this.coef === 0)
            return Dnum.ZERO; // avoid -0 coefficient
        return Dnum.make(-this.coef, this.exp);
    }

    /**
     * @returns {Object} the absolute value of a dnum
     */
    abs(): Dnum {
        return Dnum.make(Math.abs(this.coef), this.exp);
    }

    /**
     * @returns {number} the integer value of a dnum,
     * zero if the absolute value < 1, infinite if too large
     */
    toInt(): number {
        if (this.exp < -16)
            return 0;
        var n = Dnum.mutable(this);
        var roundup = false;
        while (n.exp < 0 && n.coef != 0)
            roundup = Dnum.shiftRight(n);
        if (roundup)
            n.coef++;
        if (n.exp > 0)
            return n.coef > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        else if (n.exp < 0)
            return 0;
        else
            return n.coef;
    }

    /**
     * @returns {number} this dnum converted to a JavaScript number
     */
    toNumber(): number {
        return this.coef * Math.pow(10, this.exp);
    }

    /**
     * @param that
     * @returns {boolean} true if that is a number equal to this, else false
     */
    equals(that): boolean {
        if (typeof that === 'number')
            return this.toNumber() === that;
        if (that instanceof Dnum)
            return 0 == Dnum.cmp(this, that);
        return false;
    }

    typeName(): string {
        return "Number";
    }

    display(): string {
        return this.toString();
    }

    // cmp compares two dnums, returning 0, -1, or +1
    static cmp(x: Dnum, y: Dnum): number {
        if (x.sign() < y.sign())
            return -1;
        else if (x.sign() > y.sign())
            return +1;
        else if (Dnum.same(x, y))
            return 0;
        else
            return Dnum.sub(x, y).sign();
    }

    // sub returns the difference of two dnums
    static sub(x: Dnum, y: Dnum): Dnum {
        // could avoid copy by duplicating add code
        y = Dnum.mutable(y);
        y.coef *= -1;
        return Dnum.add(x, y);
    }

    // add returns the sum of two dnums
    static add(x: Dnum, y: Dnum): Dnum {
        if (x.exp !== y.exp) {
            x = Dnum.mutable(x);
            y = Dnum.mutable(y);
            Dnum.align(x, y);
        }
        var c = x.coef + y.coef;
        if (c !== c) // NaN from adding +inf and -inf
            return Dnum.ZERO;
        if (c < minInt || maxInt < c) { // overflow
            x = Dnum.mutable(x);
            y = Dnum.mutable(y);
            if (Dnum.shiftRight(x))
                x.coef++;
            if (Dnum.shiftRight(y))
                y.coef++;
            c = x.coef + y.coef;
        }
        return Dnum.make(c, x.exp);
    }

    private static align(x: Dnum, y: Dnum): void {
        if (x.exp > y.exp) {
            // swap
            var tmp = x.coef; x.coef = y.coef; y.coef = tmp;
            tmp = x.exp; x.exp = y.exp; y.exp = tmp;
        }
        while (y.exp > x.exp && Dnum.shiftLeft(y)) {
        }

        var roundup = false;
        while (y.exp > x.exp && x.coef !== 0)
            roundup = Dnum.shiftRight(x);
        if (x.exp != y.exp)
            x.exp = y.exp;
        else if (roundup)
            x.coef++;
    }

    private static shiftLeft(n: Dnum): boolean {
        var c = n.coef * 10;
        if (!isInteger(c))
            return false;
        n.coef = c;
        if (n.exp > minExp)
            n.exp--;
        return true;
    }

    private static shiftRight(n: Dnum): boolean {
        if (n.coef === 0)
            return false;
        var roundup = (n.coef % 10) >= 5;
        n.coef = Math.floor(n.coef / 10);
        if (n.exp < expInf)
            n.exp++;
        return roundup;
    }

    // mul returns the product of two dnums
    static mul(x: Dnum, y: Dnum): Dnum {
        return convert(x.coef * y.coef, x.exp + y.exp);
    }

    // div returns the quotient of two dnums
    static div(x: Dnum, y: Dnum): Dnum {
        return convert(x.coef / y.coef, x.exp - y.exp);
    }

    // helpers ---------------------------------------------------------------------

    static inf(sign: number): Dnum {
        return sign < 1 ? Dnum.MINUS_INF : Dnum.INF;
    }

    // return a mutable version of a number
    private static mutable(n: Dnum): Dnum {
        return Object.isFrozen(n) ? new Dnum(n.coef, n.exp) : n;
    }

    static ZERO = Object.freeze(new Dnum(0, 0));
    static INF = Object.freeze(new Dnum(Number.POSITIVE_INFINITY, expInf));
    static MINUS_INF = Object.freeze(new Dnum(Number.NEGATIVE_INFINITY, expInf));

    private static same(x: Dnum, y: Dnum): boolean {
        // warning: 1e2 will not be the "same" as 100
        return x.coef === y.coef && x.exp === y.exp;
    }

} // end of class

function spanSignedDigits(s: string, start: number): string {
    var i = start;
    var c = s.charAt(start);
    if (c === '+' || c === '-')
        ++i;
    return s.substring(start, skipDigits(s, i));
}

function spanDigits(s: string, start: number): string {
    return s.substring(start, skipDigits(s, start));
}

function skipDigits(s: string, i: number): number {
    var n = s.length;
    while (i < n && isDigit(s.charAt(i)))
        ++i;
    return i;
}

function isDigit(c: string): boolean {
    return '0' <= c && c <= '9';
}

function trimRight(s: string, c: string): string {
    var i = s.length - 1;
    while (s.charAt(i) === c)
        i--;
    return s.substring(0, i + 1)
}

function convert(c: number, e: number): Dnum {
    if (c === Number.NEGATIVE_INFINITY)
        return Dnum.MINUS_INF;
    if (c === Number.POSITIVE_INFINITY)
        return Dnum.INF;
    if (isInteger(c))
        return Dnum.make(c, e); // fast path
    c *= Math.pow(10, e);
    return Dnum.fromNumber(c);
}

export function isInteger(n: any): boolean {
    return typeof n === "number" && isFinite(n) &&
        minInt <= n && n <= maxInt &&
        Math.floor(n) === n;
}
