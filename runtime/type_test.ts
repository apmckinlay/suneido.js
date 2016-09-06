import { type } from "./type";
import * as assert from "./assert";
import { SuObject } from "./suobject";
import { SuDate } from "./sudate";
import { Dnum } from "./dnum";

assert.equal(type(null), "null");
assert.equal(type(true), 'Boolean');
assert.equal(type(123), 'Number');
assert.equal(type(Dnum.fromNumber(123)), 'Number');
assert.equal(type('hello'), 'String');
assert.equal(type(SuDate.literal("20160906")), 'Date');
assert.equal(type(new SuObject()), 'Object');
assert.throws(() => type(undefined), /uninitialized/);
