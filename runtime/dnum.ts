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
"use strict";

export interface Dnum {
    coef: number;
    exp: number;

    sign(): number;
    abs(): Dnum;
    neg(): Dnum;
    toNumber(): number;
    isInt(): boolean;
    isZero(): boolean;
    isInf(): boolean;
    toInt(): number;
    typeName(): string;
}

var dnum = Object.create(null);

// construct a mutable number (for internal use only)
function raw(c: number, e: number): Dnum {
    var dn = Object.create(dnum);
    dn.coef = c;
    dn.exp = e;
    return dn;
}

export function isDnum(x: any): boolean {
    return typeof x === 'object' && Object.getPrototypeOf(x) === dnum;
}

// return a mutable version of a number (for internal use only)
function mutable(n: Dnum): Dnum {
    return Object.isFrozen(n) ? raw(n.coef, n.exp) : n;
}

var minExp = -126;
var maxExp = +126;
var expInf = 127;
var maxInt = 9007199254740992;
var minInt = -9007199254740992;
export var ZERO = Object.freeze(raw(0, 0));
export var INF = Object.freeze(raw(Number.POSITIVE_INFINITY, expInf));
export var MINUS_INF = Object.freeze(raw(Number.NEGATIVE_INFINITY, expInf));

/**
 * make constructs a dnum
 * @param {number} coef integer, may be infinite
 * @param {number} [exp=0] integer, outside range of -126 to 126 will become infinite
 * @returns {Object} an immutable dnum
 */
export function make(coef: number, exp = 0): Dnum {
    if (coef === 0)
        return ZERO;
    if (coef === Number.NEGATIVE_INFINITY)
        return MINUS_INF;
    if (coef === Number.POSITIVE_INFINITY)
        return INF;
    if (!isInteger(coef))
        throw "dnum.make invalid coefficient: " + coef;
    //if (exp === undefined)
    //    exp = 0;
    else if (!isInteger(exp))
        throw "dnum.make invalid exponent: " + exp;
    if (exp < minExp)
        return ZERO;
    if (exp > maxExp)
        return coef < 0 ? MINUS_INF : INF;
    return Object.freeze(raw(coef, exp));
}

// methods ---------------------------------------------------------------------

/**
 * String converts a Dnum to a string.
 * If the exponent is 0 it will print the number as an integer.
 * Otherwise it will try to avoid scientific notation
 * adding up to 4 zeroes at the end or 3 zeroes at the beginning.
 * @returns {string}
 */
dnum.toString = function (): string {
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
        return sign + digits + repeat("0", e);
    var se = "";
    if (-digits.length - 4 < e && e <= -digits.length)
        digits = "." + repeat("0", -e - digits.length) + digits;
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
};

/**
 * @returns {boolean} whether or not the dnum is an integer
 */
dnum.isInt = function (): boolean {
    var e = this.exp;
    if (e < -16)
        return false;
    var c = this.coef;
    while (e < 0 && c % 10 === 0) {
        c /= 10;
        e++;
    }
    return e >= 0;
};

/**
 * @returns {boolean} whether or not the dnum is zero
 */
dnum.isZero = function (): boolean {
    return this.coef === 0;
};

/**
 * @returns {boolean} whether or not the dnum is infinite
 */
dnum.isInf = function (): boolean {
    return ! isFinite(this.coef);
};

/**
 * @returns {number} 0, +1, or -1
 */
dnum.sign = function (): number {
    return this.coef === 0 ? 0 : this.coef > 0 ? +1 : -1;
};

/**
 * @returns {Object} the negative of a dnum (but not negative zero)
 */
dnum.neg = function (): Dnum {
    if (this.coef === 0)
        return ZERO; // avoid -0 coefficient
    return make(-this.coef, this.exp);
};

/**
 * @returns {Object} the absolute value of a dnum
 */
dnum.abs = function (): Dnum {
    return make(Math.abs(this.coef), this.exp);
};

/**
 * @returns {number} the integer value of a dnum,
 * zero if the absolute value < 1, infinite if too large
 */
dnum.toInt = function (): number {
    if (this.exp < -16)
        return 0;
    var n = mutable(this);
    var roundup = false;
    while (n.exp < 0 && n.coef != 0)
        roundup = shiftRight(n);
    if (roundup)
        n.coef++;
    if (n.exp > 0)
        return n.coef > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    else if (n.exp < 0)
        return 0;
    else
        return n.coef;
};

/**
 * @returns {number} this dnum converted to a JavaScript number
 */
dnum.toNumber = function (): number {
    return this.coef * Math.pow(10, this.exp);
};

/**
 * @param that
 * @returns {boolean} true if that is a number equal to this, else false
 */
dnum.equals = function(that): boolean {
    if (typeof that === 'number')
        return this.toNumber() === that;
    if (isDnum(that))
        return 0 == cmp(this, that);
    return false;
}

dnum.typeName = function (): string {
    return "Number";
}

dnum.display = function (): string {
    return this.toString();
}

// static functions ------------------------------------------------------------

/**
 * Convert a string to a dnum.
 * @param s {string}
 * @returns {object|false} a dnum, or null if not a valid number
 */
export function parse(s: string): Dnum {
    if (typeof s !== "string" || s.length === 0)
        return null; // invalid input
    if (s === "0")
        return ZERO;
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
    return make(coef, exp);
}

export function fromNumber(n: number): Dnum {
    return parse(n.toExponential(14)); // is there a better way?
}

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

function same(x: Dnum, y: Dnum): boolean {
    // warning: 1e2 will not be the "same" as 100
    return x.coef === y.coef && x.exp === y.exp;
}

// cmp compares two dnums, returning 0, -1, or +1
export function cmp(x: Dnum, y: Dnum): number {
    if (x.sign() < y.sign())
        return -1;
    else if (x.sign() > y.sign())
        return +1;
    else if (same(x, y))
        return 0;
    else
        return sub(x, y).sign();
}

// add/sub ---------------------------------------------------------------------

// add returns the sum of two dnums
export function add(x: Dnum, y: Dnum): Dnum {
    if (x.exp !== y.exp) {
        x = mutable(x);
        y = mutable(y);
        align(x, y);
    }
    var c = x.coef + y.coef;
    if (c !== c) // NaN from adding +inf and -inf
        return ZERO;
    if (c < minInt || maxInt < c) { // overflow
        x = mutable(x);
        y = mutable(y);
        if (shiftRight(x))
            x.coef++;
        if (shiftRight(y))
            y.coef++;
        c = x.coef + y.coef;
    }
    return make(c, x.exp);
}

// sub returns the difference of two dnums
export function sub(x: Dnum, y: Dnum): Dnum {
    // could avoid copy by duplicating add code
    y = mutable(y);
    y.coef *= -1;
    return add(x, y);
}

export function align(x: Dnum, y: Dnum): void {
    if (x.exp > y.exp) {
        // swap
        var tmp = x.coef; x.coef = y.coef; y.coef = tmp;
        tmp = x.exp; x.exp = y.exp; y.exp = tmp;
    }
    while (y.exp > x.exp && shiftLeft(y)) {
    }

    var roundup = false;
    while (y.exp > x.exp && x.coef !== 0)
        roundup = shiftRight(x);
    if (x.exp != y.exp)
        x.exp = y.exp;
    else if (roundup)
        x.coef++;
}

function shiftLeft(n: Dnum): boolean {
    var c = n.coef * 10;
    if (! isInteger(c))
        return false;
    n.coef = c;
    if (n.exp > minExp)
        n.exp--;
    return true;
}

function shiftRight(n: Dnum): boolean {
    if (n.coef === 0)
        return false;
    var roundup = (n.coef % 10) >= 5;
    n.coef = Math.floor(n.coef / 10);
    if (n.exp < expInf)
        n.exp++;
    return roundup;
}

// mul -------------------------------------------------------------------------

// mul returns the product of two dnums
export function mul(x: Dnum, y: Dnum): Dnum {
    return convert(x.coef * y.coef, x.exp + y.exp);
}

// div -------------------------------------------------------------------------

// div returns the quotient of two dnums
export function div(x: Dnum, y: Dnum): Dnum {
    return convert(x.coef / y.coef, x.exp - y.exp);
}

// helpers ---------------------------------------------------------------------

function inf(sign: number): Dnum {
    return sign < 1 ? MINUS_INF : INF;
}

function convert(c: number, e: number): Dnum {
    if (c === Number.NEGATIVE_INFINITY)
        return MINUS_INF;
    if (c === Number.POSITIVE_INFINITY)
        return INF;
    if (isInteger(c))
        return make(c, e); // fast path
    c *= Math.pow(10, e);
    return fromNumber(c);
}

// utility functions -----------------------------------------------------------

export function isInteger(n: any): boolean {
    return typeof n === "number" && isFinite(n) &&
        minInt <= n && n <= maxInt &&
        Math.floor(n) === n;
}

function repeat(s: string, n: number): string { // in ES6
    s = '' + s;
    n = Math.floor(n);
    if (s.length === 0 || n === 0)
        return '';
    if (s.length * n >= 1 << 20)
        throw "repeat too large";
    var rpt = '';
    for (;;) {
        if ((n & 1) === 1)
            rpt += s;
        n >>>= 1;
        if (n === 0)
            break;
        s += s;
    }    return rpt;
}
