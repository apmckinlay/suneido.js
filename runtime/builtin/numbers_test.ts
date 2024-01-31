import { Numbers, su_number } from "./numbers";
import { SuNum } from "../sunum";
import * as assert from "../assert";
import { SuDate } from "../sudate";

const nm = Numbers.prototype;
const n = SuNum.make;

// Round/RoundDown/RoundUp *************************************
assert.equal(nm.Round.call(n(123456, -3), n(12, -1)), 123.5);
assert.equal(nm.Round.call(n(123456, -3), n(19, -1)), 123.5);
assert.equal(nm.RoundDown.call(n(123456, -3), n(12, -1)), 123.4);
assert.equal(nm.RoundDown.call(n(123456, -3), n(19, -1)), 123.4);
assert.equal(nm.RoundUp.call(n(12341, -2), n(12, -1)), 123.5);
assert.equal(nm.RoundUp.call(n(12341, -2), n(19, -1)), 123.5);

// Number 
const fn = su_number;
assert.equal(fn(""), 0);
assert.equal(fn(false), 0);
assert.equal(fn(0), 0);
assert.equal(fn(123), 123);
assert.equal(fn(-123), -123);
assert.equal(fn('1,234,567'), 1234567);
assert.equal(fn("   "), 0);
assert.equal(fn("0"), 0);
// assert.equal(fn("00"), 0);
assert.equal(fn("01"), 1);
assert.equal(fn("123"), 123);
assert.equal(fn(" 123"), 123);
assert.equal(fn("0777"), 777);
assert.equal(fn("+123"), 123);
assert.equal(fn("123."), 123);

assert.throws(() => { fn('.') }, "can't convert");
assert.throws(() => { fn('foo') }, "can't convert");
assert.throws(() => { fn('false') }, "can't convert");
assert.throws(() => { fn(SuDate.now()) }, "can't convert");