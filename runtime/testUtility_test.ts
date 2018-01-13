import * as su from "./su";
import * as assert from "./assert";
import { makeClass } from "./testUtility";
import { defGlobal } from "./global";

let fn = function(a = su.mandatory(), b = 10, c = 100) {
    su.maxargs(3, arguments.length);
    return su.add(su.add(su.add(su.get(this, "X"), a), b), c);
};
/* class {
	X: 1000
	Fn(a, b = 10, c = 100)
		{
		return .X + a + b + c
		}
	}
 */
let cl = makeClass(false, [
    {key: 'X', value: 1000},
    {key: 'Fn', value: fn, paramNames: ['a', 'b', 'c'], params: "a, b=10, c=100"}
]);
// test class
assert.equal(su.invoke(cl, 'Fn', 1), 1111);
assert.equal(su.invoke(cl, 'Fn', 1, 20), 1121);
assert.equal(su.invokeNamed(cl, 'Fn', {c: 200, b: 20}, 2), 1222);
assert.equal(su.invokeNamed(cl, 'Fn', {a: 3}, 1), 1113);

// test instance
let c = su.instantiate(cl);
su.put(c, "X", 2000);
assert.equal(su.invoke(c, 'Fn', 1), 2111);
assert.equal(su.invoke(c, 'Fn', 1, 20), 2121);
assert.equal(su.invokeNamed(c, 'Fn', {c: 200, b: 20}, 2), 2222);
assert.equal(su.invokeNamed(c, 'Fn', {a: 3}, 1), 2113);

// test super
let $super = 'TestClass'; // need this to make super call work
defGlobal($super, cl);
let fn1 = function (a = su.mandatory(), b = 90, c = 900) {
    su.maxargs(3, arguments.length);
    return su.add(su.get(this, "X"), su.invokeBySuper($super, "Fn", this, a, b, c));
};
/* TestClass {
	X: 3000
	Fn(a, b = 10, c = 100)
		{
		return .X + super.Fn(a, b, c)
		}
	} */
let cl1 = makeClass('TestClass', [
    {key: 'X', value: 3000},
    {key: 'Fn', value: fn1, paramNames: ['a', 'b', 'c'], params: "a, b=90, c=900"}
]);
assert.equal(su.invoke(cl1, 'Fn', 9), 6999);
assert.equal(su.invoke(cl1, 'Fn', 9, 20), 6929);
assert.equal(su.invokeNamed(cl1, 'Fn', {c: 200, b: 20}, 9), 6229);
assert.equal(su.invokeNamed(cl1, 'Fn', {a: 9}, 1), 6999);

