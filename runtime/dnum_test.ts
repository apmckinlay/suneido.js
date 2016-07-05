/**
 * Created by andrew on 2015-05-17.
 */
import dnum = require("./dnum");
import assert = require("assert");

var n = dnum.make;

// make/toString ---------------------------------------------------------------

assert.equal(dnum.ZERO, "0");
assert.equal(dnum.INF, "inf");
assert.equal(dnum.MINUS_INF, "-inf");
assert.equal(n(123), "123");
assert.equal(n(-123), "-123");
assert.equal(n(1, -3), ".001");
assert.equal(n(1, 3), "1000");
assert.equal(n(1234, -4), ".1234");
assert.equal(n(1234, -2), "12.34");
assert.equal(n(123000, -3), "123");
assert.equal(n(1000000, -3), "1000");

// toNumber --------------------------------------------------------------------

function toNum(s, expected) {
    var n = dnum.parse(s).toNumber();
    var dif = Math.abs(n - expected);
    assert(dif < Math.abs(n) / 1e12, "expected " + expected + " got " + n);
}
toNum('1234', 1234);
toNum('-1234', -1234);
toNum('12.34', 12.34);
toNum('-12.34', -12.34);
toNum('12.34e56', 12.34e56);
toNum('-12.34e56', -12.34e56);
toNum('12.34e-56', 12.34e-56);

// parse -----------------------------------------------------------------------

function parse(s, expected) {
    var result = dnum.parse(s);
    assert.equal(result, expected,
        "parse(" + s + ") expected " + expected + " got " + result);
}
parse("0", 0);
parse("123", 123);
parse("-123", -123);
parse("12.34", 12.34);
parse(".001",.001);
parse("1e3", 1000);
parse("1e-2", .01);
parse("123x", null);
parse("x123", null);
parse("12x34", null);
parse("1e3x", null);

// abs/neg ---------------------------------------------------------------------

assert.equal(n(0).abs(), 0);
assert.equal(n(0).neg(), 0);
assert.equal(n(1).abs(), 1);
assert.equal(n(1).neg(), -1);
assert.equal(n(-1).neg(), 1);
assert.equal(n(-1).abs(), 1);
assert.equal(dnum.INF.neg(), '-inf');
assert.equal(dnum.INF.abs(), 'inf');
assert.equal(dnum.MINUS_INF.neg(), 'inf');
assert.equal(dnum.MINUS_INF.abs(), 'inf');

// add/sub ---------------------------------------------------------------------

function add_sub(x, y, sum, dif) {
    function op(fn, x, y, expected) {
        var result = fn(x, y);
        var sfn = (fn === dnum.add) ? " + " : " - ";
        assert.equal(result, expected, "" + x + sfn + y +
             " should be " + expected + " but got " + result);
    }
    op(dnum.add, x, y, sum);
    op(dnum.sub, x, y, dif);
    op(dnum.add, y, x, sum);
    if (dif != 0)
        op(dnum.sub, y, x, '-' + dif);
    if (sum !== 0) {
        op(dnum.add, x.neg(), y.neg(), '-' + sum);
        op(dnum.add, y.neg(), x.neg(), '-' + sum);
    }
}

add_sub(n(1), n(1), 2, 0);
add_sub(n(1), n(-1), 0, 2);
add_sub(n(1, 3), n(1), 1001, 999);
add_sub(n(123), n(0), 123, 123);
add_sub(dnum.INF, dnum.MINUS_INF, 0, 'inf');
add_sub(dnum.INF, dnum.INF, 'inf', 0);
add_sub(n(9007199254740990), n(9007199254740990), 18014398509481980, 0); // overflow
add_sub(n(9007199254740990, 126), n(9007199254740990, 126), 'inf', 0); // overflow

// mul -------------------------------------------------------------------------

function mul(x, y, expected) {
    mul2(x, y, expected);
    mul2(y, x, expected);
    mul2(x.neg(), y.neg(), expected);
    if (expected !== 0) {
        mul2(x.neg(), y, '-' + expected);
        mul2(x, y.neg(), '-' + expected);
    }
}
function mul2(x, y, expected) {
    var result = dnum.mul(x, y);
    assert.equal(result, expected, "" + x + " * " + y +
        " should be " + expected + " but got " + result);
}
mul(n(0), n(123), 0);
mul(n(1), n(123), 123);
mul(n(128), n(128), 16384);
mul(n(128e3), n(128e5), 16384e8);
mul(dnum.INF, n(123), 'inf');
mul(n(1, 99), n(1, 99), 'inf');
mul(n(1234567800000000), n(1234567800000000), '1.52415765279684e30');
mul(n(1234567890123456), n(1234567890123456), '1.52415787532388e30');

// div -------------------------------------------------------------------------

function div(x, y, expected) {
    div2(x, y, expected);
    if (!y.isZero())
        div2(x.neg(), y.neg(), expected);
    if (expected !== 0) {
        div2(x.neg(), y, '-' + expected);
        if (!y.isZero())
            div2(x, y.neg(), '-' + expected);
    }
}
function div2(x, y, expected) {
    var result = dnum.div(x, y);
    assert.equal(result, expected, "" + x + " / " + y +
        " should be " + expected + " but got " + result);
}
div(n(0), n(123), 0);
div(n(123), n(0), 'inf');
div(n(256), n(4), 64);
div(n(1234567890123456), n(1234567890123456), 1);
div(dnum.INF, n(123), 'inf');
div(n(1, 99), n(1, 99), 1);
div(n(1), n(1234567890123456), 8.10000007290001e-16);

assert(n(0).isZero());
assert(n(0).isInt());
assert(n(123).isInt());
assert(n(123, 3).isInt());
assert(n(123000, -3).isInt());
assert(! n(123, -3).isInt());

assert(0 == dnum.cmp(dnum.fromNumber(1.5), n(15, -1)));

//function randint(limit) {
//    return Math.floor(Math.random() * limit);
//}
//var nfailed = 0;
//for (var i = 0; i < 1000000; ++i) {
//    var x = n(randint(1000000000000), randint(200) - 100);
//    //console.log(x.toString());
//    var num = x.toNumber();
//    var y = dnum.fromNumber(num);
//    if (0 != dnum.cmp(x, y)) {
//        ++nfailed;
//        console.log(x + " != " + y);
//    }
//}
//console.log("nfailed " + nfailed);
