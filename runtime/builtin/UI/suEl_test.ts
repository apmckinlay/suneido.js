import * as assert from "../../assert";
import { convertSuValue, makeSuValue, SuEl, defMap } from "./suEl";
import { Except } from "../except";
import { SuNum } from "../../sunum";
import { makeObj } from "../../testUtility";

class TestEl extends SuEl {
    public el: string = "test";
    type(): string {
        return "TestEl";
    }
}
class Test {}
defMap(Test, TestEl);

let fn = convertSuValue;
// string
assert.equal(fn("test"), "test");
assert.equal(fn(new Except(new Error("test"))), "test");
// boolean
assert.equal(fn(true), true);
// number
assert.equal(fn(123), 123);
assert.equal(fn(SuNum.fromNumber(123.123)), 123.123);
// object
assert.equal(fn(makeObj([])), {});
assert.equal(fn(makeObj([1, 2, "a"])), [1, 2, "a"]);
assert.equal(fn(makeObj([], ["a", "a"], ["b", "b"])), { a: "a", b: "b" });
assert.throws(() => fn(makeObj([1, 2], ["a", "a"])), "Cannot convert Object with both named and un-named elements");
// element
assert.equal(fn(new TestEl()), "test");
// combined
assert.equal(
    fn(makeObj([1, "a", true, makeObj([], [1, SuNum.fromNumber(0.1)], ["a", new TestEl()])])),
    [1, "a", true, { 1: 0.1, a: "test"}]);

let fn1 = makeSuValue;
// undefined
assert.equal(fn1(undefined), undefined);
// string
assert.equal(fn1("test"), "test");
// boolean
assert.equal(fn1(true), true);
// number
assert.equal(fn1(123), SuNum.make(123));
assert.equal(fn1(123.123), SuNum.make(123123, -3));
// element
assert.that(fn1(new Test()) instanceof TestEl);
// array & object
assert.equal(fn1([]), makeObj([]));
assert.equal(fn1({}), makeObj([]));
assert.equal(fn1([1, 2, 3]), makeObj([1, 2, 3]));
assert.equal(fn1({a: "aa", b: "bb"}), makeObj([], ["a", "aa"], ["b", "bb"]));
// combined
assert.equal(
    fn1([1, true, {a: "aa", b: [], c: null}]),
    makeObj([1, true, makeObj([], ["a", "aa"], ["b", makeObj([])], ["c", undefined])]));
// circular deps
let arr: any[] = [1];
arr[1] = arr;
assert.equal(fn1(arr), 
    makeObj([1, makeObj([1, makeObj([1, makeObj([1, makeObj([1, 
    makeObj([1, makeObj([1, makeObj([1, makeObj([1, makeObj([1, 
    makeObj([1, makeObj([1, makeObj([1, makeObj([1, makeObj([1, 
    makeObj([1, makeObj([1, makeObj([1, makeObj([1, makeObj([1, makeObj([])])])])])])])])])])])])])])])])])])])])]))
