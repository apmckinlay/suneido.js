import { Numbers } from "./numbers";
import { SuNum } from "../sunum";
import * as assert from "../assert";

const nm = Numbers.prototype;
const n = SuNum.make;

// Round/RoundDown/RoundUp *************************************
assert.equal(nm.Round.call(n(123456, -3), n(12, -1)), 123.5);
assert.equal(nm.Round.call(n(123456, -3), n(19, -1)), 123.5);
assert.equal(nm.RoundDown.call(n(123456, -3), n(12, -1)), 123.4);
assert.equal(nm.RoundDown.call(n(123456, -3), n(19, -1)), 123.4);
assert.equal(nm.RoundUp.call(n(12341, -2), n(12, -1)), 123.5);
assert.equal(nm.RoundUp.call(n(12341, -2), n(19, -1)), 123.5);
