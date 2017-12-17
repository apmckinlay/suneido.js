import { Numbers } from "./numbers";
import { SuNum } from "../sunum";
import * as assert from "../assert";

const nm = Numbers.prototype;

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
