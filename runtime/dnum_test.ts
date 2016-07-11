import Dnum from "./dnum";
import * as assert from "./assert";

const n = Dnum.make;

function eq(x: Dnum, y?: string | number) {
    if (typeof y == "string")
        assert.equal(x.toString(), y);
    else if (typeof y == "number")
        assert.equal(x.toNumber(), y);
    else
        assert.equal(x, y);
}

// make/toString ---------------------------------------------------------------

eq(Dnum.ZERO, "0");
eq(Dnum.INF, "inf");
eq(Dnum.MINUS_INF, "-inf");
eq(n(123), "123");
eq(n(-123), "-123");
eq(n(1, -3), ".001");
eq(n(1, 3), "1000");
eq(n(1234, -4), ".1234");
eq(n(1234, -2), "12.34");
eq(n(123000, -3), "123");
eq(n(1000000, -3), "1000");

// toNumber --------------------------------------------------------------------

function toNum(s: string, expected) {
    var n = Dnum.parse(s).toNumber();
    assert.equal(n, expected);
    // var dif = Math.abs(n - expected);
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

function parse(s: string, expected) {
    var result = Dnum.parse(s);
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

// abs/neg ---------------------------------------------------------------------

eq(n(0).abs(), 0);
eq(n(0).neg(), 0);
eq(n(1).abs(), 1);
eq(n(1).neg(), -1);
eq(n(-1).neg(), 1);
eq(n(-1).abs(), 1);
eq(Dnum.INF.neg(), '-inf');
eq(Dnum.INF.abs(), 'inf');
eq(Dnum.MINUS_INF.neg(), 'inf');
eq(Dnum.MINUS_INF.abs(), 'inf');

// add/sub ---------------------------------------------------------------------

function add_sub(x: Dnum, y: Dnum, sum, dif) {
    function op(fn, x, y, expected) {
        var result = fn(x, y);
        var sfn = (fn === Dnum.add) ? " + " : " - ";
        eq(result, expected);
    }
    op(Dnum.add, x, y, sum);
    op(Dnum.sub, x, y, dif);
    op(Dnum.add, y, x, sum);
    if (dif != 0)
        op(Dnum.sub, y, x, '-' + dif);
    if (sum !== 0) {
        op(Dnum.add, x.neg(), y.neg(), '-' + sum);
        op(Dnum.add, y.neg(), x.neg(), '-' + sum);
    }
}

add_sub(n(1), n(1), 2, 0);
add_sub(n(1), n(-1), 0, 2);
add_sub(n(1, 3), n(1), 1001, 999);
add_sub(n(123), n(0), 123, 123);
add_sub(Dnum.INF, Dnum.MINUS_INF, 0, 'inf');
add_sub(Dnum.INF, Dnum.INF, 'inf', 0);
add_sub(n(9007199254740990), n(9007199254740990), 18014398509481980, 0); // overflow
add_sub(n(9007199254740990, 126), n(9007199254740990, 126), 'inf', 0); // overflow

// mul -------------------------------------------------------------------------

function mul(x: Dnum, y: Dnum, expected) {
    function mul2(x, y, expected) {
        var result = Dnum.mul(x, y);
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
mul(Dnum.INF, n(123), 'inf');
mul(n(1, 99), n(1, 99), 'inf');
mul(n(1234567800000000), n(1234567800000000), '1.52415765279684e30');
mul(n(1234567890123456), n(1234567890123456), '1.52415787532388e30');

// div -------------------------------------------------------------------------

function div(x, y, expected) {
    function div2(x, y, expected) {
        var result = Dnum.div(x, y);
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
div(Dnum.INF, n(123), 'inf');
div(n(1, 99), n(1, 99), 1);
div(n(1), n(1234567890123456), 8.10000007290001e-16);

assert.that(n(0).isZero());
assert.that(n(0).isInt());
assert.that(n(123).isInt());
assert.that(n(123, 3).isInt());
assert.that(n(123000, -3).isInt());
assert.that(!n(123, -3).isInt());

assert.that(0 == Dnum.cmp(Dnum.fromNumber(1.5), n(15, -1)));

//function randint(limit) {
//    return Math.floor(Math.random() * limit);
//}
//var nfailed = 0;
//for (var i = 0; i < 1000000; ++i) {
//    var x = n(randint(1000000000000), randint(200) - 100);
//    //console.log(x.toString());
//    var num = x.toNumber();
//    var y = Dnum.fromNumber(num);
//    if (0 != Dnum.cmp(x, y)) {
//        ++nfailed;
//        console.log(x + " != " + y);
//    }
//}
//console.log("nfailed " + nfailed);
