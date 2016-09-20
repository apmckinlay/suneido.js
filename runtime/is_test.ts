import { is } from "./is";
import { SuNum } from "./sunum";
import { SuDate } from "./sudate";
import { SuObject } from "./suobject";
import * as assert from "./assert";

function eq(x: any, y: any): void {
    assert.that(is(x, y), x + " is " + y + " should be true");
    assert.that(is(y, x), y + " is " + x + " should be true");
}
function neq(x: any, y: any): void {
    assert.that(!is(x, y), x + " is " + y + " should be false");
    assert.that(!is(y, x), y + " is " + x + " should be false");
}

eq(true, true);
neq(true, false);
eq('hello', 'hello');
eq(123, 123);
neq(1, true);
neq(123, 'hello');
let n = SuNum.fromNumber(123);
eq(123, n);
eq(n, SuNum.fromNumber(123));
eq(SuNum.make(15, -1), 1.5);
let x = new SuObject();
neq(x, 123);
let y = new SuObject();
eq(x, y);
x.Add(123);
neq(x, y);
y.Add(123);
eq(x, y);
let d = SuDate.literal('20160906.1646');
eq(d, d);
neq(d, n);
neq(d, SuDate.now());
eq(d, SuDate.literal('20160906.1646'));
neq(d, SuDate.literal('20160906.164600001'));


