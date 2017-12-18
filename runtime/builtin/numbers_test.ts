import { Numbers } from "./numbers";
import { SuNum } from "../sunum";
import * as assert from "../assert";

const nm = Numbers.prototype;
const n = SuNum.fromNumber;

// Frac ******************************************************
function frac(num: number, expected: number): void {
    assert.equal(nm.Frac.call(num), expected);
    assert.equal(nm.Frac.call(SuNum.fromNumber(num)), expected);
}

function frac_test(): void {
    frac(0, 0);
    frac(123, 0);
    frac(12.34, 0.34);
    frac(10000.00002, 0.00002);
    frac(.00002, .00002);
    frac(3213.4324, .4324);
}

frac_test();

// Round/RoundDown/RoundUp *************************************
assert.equal(nm.Round.call(123.456, n(1.2)), 123.5);
assert.equal(nm.Round.call(123.456, n(1.9)), 123.5);
assert.equal(nm.RoundDown.call(123.456, n(1.2)), 123.4);
assert.equal(nm.RoundDown.call(123.456, n(1.9)), 123.4);
assert.equal(nm.RoundUp.call(123.41, n(1.2)), 123.5);
assert.equal(nm.RoundUp.call(123.41, n(1.9)), 123.5);
