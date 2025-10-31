import { Except } from "./except";
import { type } from "../type";
import * as su from "../su";
import * as assert from "../assert";

let except = new Except(new Error(), "test");
assert.equal(type(except), "Except");
assert.equal(su.display(except), '"test"');
assert.equal(su.get(except, 1), "e");
assert.throws(() => su.put(except, 1, "x"), "Except does not support put (1)");
assert.equal(su.rangelen(except, 1, 2), "es");

let except2 = new Except("error");
assert.equal(type(except2), "Except");
assert.equal(su.display(except2), '"error (string)"');
assert.equal(su.get(except2, 1), "r");

let except3 = new Except(undefined);
assert.equal(type(except3), "Except");
assert.equal(su.display(except3), '"undefined (undefined)"');
assert.equal(su.get(except3, 1), "n");

// test su.invode can handle except method calls
let newExcept = su.invoke(except, "As", "abc");
assert.that(newExcept instanceof Except);
assert.equal(newExcept.toString(), "abc");
assert.equal(except.getError(), newExcept.getError());

assert.equal(su.invoke(except, "Upper"), "TEST");
assert.equal(su.invoke(except, "Size"), 4);
