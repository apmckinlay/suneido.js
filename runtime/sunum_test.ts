import { SuNum, RoundingMode } from "./sunum";
import * as assert from "./assert";

const n = SuNum.make;

function eq(x: SuNum | null, y?: string | number | null): void {
    if (x === null || y === null)
        assert.equal(x, y);
    else if (typeof y === "string")
        assert.equal(x.toString(), y);
    else if (typeof y === "number")
        assert.equal(x.toNumber(), y);
    else
        assert.equal(x, y);
}

// make/toString ---------------------------------------------------------------

eq(SuNum.ZERO, "0");
eq(SuNum.INF, "inf");
eq(SuNum.MINUS_INF, "-inf");
eq(n(123), "123");
eq(n(-123), "-123");
eq(n(1, -3), ".001");
eq(n(1, 3), "1000");
eq(n(1234, -4), ".1234");
eq(n(1234, -2), "12.34");
eq(n(123000, -3), "123");
eq(n(1000000, -3), "1000");

// toNumber --------------------------------------------------------------------

function toNum(s: string, expected: number) {
    let n = SuNum.parse(s) !.toNumber();
    assert.equal(n, expected);
    // let dif = Math.abs(n - expected);
    // assert.that(dif < Math.abs(n) / 1e12, "expected " + expected + " got " + n);
}
toNum('1234', 1234);
toNum('-1234', -1234);
toNum('12.34', 12.34);
toNum('-12.34', -12.34);
toNum('12.34e56', 12.34e56);
toNum('-12.34e56', -12.34e56);
toNum('12.34e-56', 12.34e-56);

// parse -----------------------------------------------------------------------

function parse(s: string, expected: number | string | null): void {
    let result = SuNum.parse(s);
    eq(result, expected);
}
parse("0", 0);
parse("123", 123);
parse("-123", -123);
parse("12.34", 12.34);
parse(".001", .001);
parse("1e3", 1000);
parse("1e-2", .01);
parse("123x", null);
parse("x123", null);
parse("12x34", null);
parse("1e3x", null);
parse(".333333333333333333333", ".3333333333333333");
parse(".33333333333333333333", ".3333333333333333");
parse(".3333333333333333333", ".3333333333333333");
parse(".333333333333333333", ".3333333333333333");
parse(".33333333333333333", ".3333333333333333");
parse(".3333333333333333", ".3333333333333333");
parse(".6666666666666666666", ".6666666666666667");

// abs/neg ---------------------------------------------------------------------

eq(n(0).abs(), 0);
eq(n(0).neg(), 0);
eq(n(1).abs(), 1);
eq(n(1).neg(), -1);
eq(n(-1).neg(), 1);
eq(n(-1).abs(), 1);
eq(SuNum.INF.neg(), '-inf');
eq(SuNum.INF.abs(), 'inf');
eq(SuNum.MINUS_INF.neg(), 'inf');
eq(SuNum.MINUS_INF.abs(), 'inf');

// add/sub ---------------------------------------------------------------------

function add_sub(x: SuNum, y: SuNum, sum: string | number, dif: string | number) {
    function op(fn: (x: SuNum, y: SuNum) => SuNum, x: SuNum, y: SuNum, expected: string | number) {
        let result = fn(x, y);
        eq(result, expected);
    }
    op(SuNum.add, x, y, sum);
    op(SuNum.sub, x, y, dif);
    op(SuNum.add, y, x, sum);
    if (dif !== 0)
        op(SuNum.sub, y, x, '-' + dif);
    if (sum !== 0) {
        op(SuNum.add, x.neg(), y.neg(), '-' + sum);
        op(SuNum.add, y.neg(), x.neg(), '-' + sum);
    }
}

add_sub(n(1), n(1), 2, 0);
add_sub(n(1), n(-1), 0, 2);
add_sub(n(1, 3), n(1), 1001, 999);
add_sub(n(123), n(0), 123, 123);
add_sub(SuNum.INF, SuNum.MINUS_INF, 0, 'inf');
add_sub(SuNum.INF, SuNum.INF, 'inf', 0);
add_sub(n(9007199254740990), n(9007199254740990), 18014398509481980, 0); // overflow
add_sub(n(9007199254740990, 126), n(9007199254740990, 126), 'inf', 0); // overflow

// mul -------------------------------------------------------------------------

function mul(x: SuNum, y: SuNum, expected: string | number) {
    function mul2(x: SuNum, y: SuNum, expected: string | number) {
        let result = SuNum.mul(x, y);
        eq(result, expected);
    }
    mul2(x, y, expected);
    mul2(y, x, expected);
    mul2(x.neg(), y.neg(), expected);
    if (expected !== 0) {
        mul2(x.neg(), y, '-' + expected);
        mul2(x, y.neg(), '-' + expected);
    }
}

mul(n(0), n(123), 0);
mul(n(1), n(123), 123);
mul(n(128), n(128), 16384);
mul(n(128e3), n(128e5), 16384e8);
mul(SuNum.INF, n(123), 'inf');
mul(n(1, 99), n(1, 99), 'inf');
mul(n(1234567800000000), n(1234567800000000), '1.52415765279684e30');
mul(n(1234567890123456), n(1234567890123456), '1.524157875323882e30');

// div -------------------------------------------------------------------------

function div(x: SuNum, y: SuNum, expected: string | number) {
    function div2(x: SuNum, y: SuNum, expected: string | number) {
        let result = SuNum.div(x, y);
        eq(result, expected);
    }
    div2(x, y, expected);
    if (!y.isZero())
        div2(x.neg(), y.neg(), expected);
    if (expected !== 0) {
        div2(x.neg(), y, '-' + expected);
        if (!y.isZero())
            div2(x, y.neg(), '-' + expected);
    }
}

div(n(0), n(123), 0);
div(n(123), n(0), 'inf');
div(n(256), n(4), 64);
div(n(1234567890123456), n(1234567890123456), 1);
div(SuNum.INF, n(123), 'inf');
div(n(1, 99), n(1, 99), 1);
div(n(1), n(1234567890123456), 8.100000072900005e-16);

// format -------------------------------------------------------------------------
function format(x: SuNum, mask: string, expected: string) {
    assert.equal(x.format(mask), expected);
}
format(n(0), "###", "0");
format(n(0), "###.", "0.");
format(n(0), "#.##", ".00");
format(n(8, -2), "#.##", ".08");
format(n(8, -2), "#.#", ".1");
format(n(6789, -3), "#.##", "6.79");
format(n(123), "##", "#");
format(n(-1), "#.##", "-");
format(n(-12), "-####", "-12");
format(n(-12), "(####)", "(12)");

// frac  -------------------------------------------------------------------------
function frac(x: SuNum, expected: number) {
    eq(x.frac(), expected);
}

frac(n(0), 0);
frac(n(123), 0);
frac(n(1234, -2), .34);
frac(n(1000000002, -5), .00002);
frac(n(2, -5), .00002);
frac(n(32134324, -4), .4324);

// round -------------------------------------------------------------------------
function round(x: SuNum, num: number, expected: number, expectedRoundUp: number, expectedRoundDown: number) {
    eq(x.round(num, RoundingMode.HALF_UP), expected);
    eq(x.round(num, RoundingMode.DOWN), expectedRoundDown);
    eq(x.round(num, RoundingMode.UP), expectedRoundUp);
}

round(n(0), 0, 0, 0, 0);
round(n(123456, -3), 1, 123.5, 123.5, 123.4);
round(n(123499, -3), 1, 123.5, 123.5, 123.4);
round(n(123446, -3), 1, 123.4, 123.5, 123.4);
round(n(12340, -2), 1, 123.4, 123.5, 123.4);
round(n(-123456, -3), 1, -123.5, -123.5, -123.4);
round(n(123456, -3), -1, 120, 130, 120);
round(n(153456, -3), -2, 200, 200, 100);

assert.that(n(0).isZero());
assert.that(n(0).isInt());
assert.that(n(123).isInt());
assert.that(n(123, 3).isInt());
assert.that(n(123000, -3).isInt());
assert.that(!n(123, -3).isInt());

assert.equal(n(0).toInt(), 0);
assert.equal(n(1, -9).toInt(), 0);
assert.equal(n(1, -1).toInt(), 0);
assert.equal(n(9, -1).toInt(), 1);
assert.equal(n(-1, -1).toInt(), 0);
assert.equal(n(-9, -1).toInt(), -1);
assert.equal(n(1, 3).toInt(), 1000);
assert.equal(n(123456, -3).toInt(), 123);
assert.equal(dn('123.111').toInt(), 123);
assert.equal(dn('123.999').toInt(), 124);
assert.equal(dn('-123.111').toInt(), -123);
assert.equal(dn('-123.999').toInt(), -124);

assert.that(0 === SuNum.cmp(SuNum.fromNumber(1.5), n(15, -1)));

// porttests -------------------------------------------------------------------

import { runFile } from "./porttests";

runFile("dnum.test", { dnum_add, dnum_sub, dnum_mul, dnum_div, dnum_cmp });

function binary(x: string, y: string, z: string,
    fn: (x: SuNum, y: SuNum, z: SuNum) => boolean): boolean {
    return fn(dn(x), dn(y), dn(z));
}

function ck1(x: SuNum, y: SuNum, z: SuNum, op: (x: SuNum, y: SuNum) => SuNum): boolean {
    if (!op(x, y).equals(z)) {
        console.log(op.name + " " + x + ", " + y +
            " => " + op(x, y) + " should be " + z);
        return false;
    } else
        return true;
}

function dnum_add(x: string, y: string, z: string): boolean {
    return binary(x, y, z, (x, y, z) =>
        ck1(x, y, z, SuNum.add) && ck1(y, x, z, SuNum.add));
}

function dnum_sub(x: string, y: string, z: string): boolean {
    return binary(x, y, z, (x, y, z) =>
        ck1(x, y, z, SuNum.sub) && ck1(y, x, z.neg(), SuNum.sub));
}

function dnum_mul(x: string, y: string, z: string): boolean {
    return binary(x, y, z, (x, y, z) =>
        ck1(x, y, z, SuNum.mul) && ck1(y, x, z, SuNum.mul));
}

function dnum_div(x: string, y: string, z: string): boolean {
    return binary(x, y, z, (x, y, z) =>
        ck1(x, y, z, SuNum.div));
}

function dnum_cmp(...data: string[]): boolean {
    const n = data.length;
    for (let i = 0; i < n; ++i) {
        let x = dn(data[i]);
        if (SuNum.cmp(x, x) !== 0)
            return false;
        for (let j = i + 1; j < n; ++j) {
            let y = dn(data[j]);
            if (SuNum.cmp(x, y) >= 0)
                return false;
        }
    }
    return true;
}

function dn(s: string): SuNum {
    return s === "inf" ? SuNum.INF :
        s === "-inf" ? SuNum.MINUS_INF :
            SuNum.parse(s) !;
}
