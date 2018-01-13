import { makeClass } from "./testUtility";
import * as su from "./su";
import * as assert from "./assert";

/* class {
    X: 123
    Fn(a)
        {
        return .X + a
        }
    Fn1(a)
        {
        return .X + a
        }
    } */
let fn = function (a = su.mandatory()) {
    su.maxargs(1, arguments.length);
    return su.add(su.get(this, "X"), a);
};
let fn1 = function (a = su.mandatory()) {
    su.maxargs(1, arguments.length);
    return su.add(su.get(this, "X"), a);
};
let cl = makeClass(false, [
    {key: 'X', value: 123},
    {key: 'Fn', value: fn, params: 'a', paramNames: ['a']},
    {key: 'Fn1', value: fn1, params: 'a', paramNames: ['a']}
]);
let c = su.instantiate(cl);
let fn_cl = su.get(cl, "Fn");
let fn_cl_copy = su.get(cl, "Fn");
let fn1_cl = su.get(cl, "Fn1");
let fn_c = su.get(c, "Fn");

assert.equal(su.callAt(fn_cl, su.callNamed(su.global("Object"), {"a": 1})), 124);
assert.equal(su.call(fn_c, 1), 124);

su.put(c, "X", 999);
assert.equal(su.call(fn_cl, 1), 124);
assert.equal(su.callNamed(fn_c, {"a": 1}), 1000);

assert.that(fn_cl.equals(fn_cl_copy));
assert.that(!fn_cl.equals(fn_c));
assert.that(!fn_cl.equals(fn1_cl));


