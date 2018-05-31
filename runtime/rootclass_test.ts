import { makeClass, makeObj } from "./testUtility";
import { defGlobal } from "./global";
import * as su from "./su";
import * as assert from "./assert";
import { SuObject } from "./suobject";

// Setup
defGlobal('Objects', makeClass(false, []));

// Test Get_ Method
/* class
	{
    X: 123
	Get_Test()
		{
		return 'Test' $ .test
		}
	get_test()
		{
		return '- test'
		}
	} */
let fn1 = function () {
    su.maxargs(0, arguments.length);
    return "Test" + su.toStr(su.get(this, "eval$c_test"));
};
let fn2 = function () {
    su.maxargs(0, arguments.length);
    return " - test";
};
let cl1 = makeClass(false, [
    {key: 'X', value: 123},
    {key: 'Get_Test', value: fn1, params: '', paramNames: []},
    {key: 'Get_eval$c_test', value: fn2, params: '', paramNames: []},
]);

assert.equal(su.get(cl1, "X"), 123);
assert.equal(su.get(cl1, "Test"), "Test - test");
assert.throws(() => su.get(cl1, "Test1"), /member not found/);

/* class
	{
    X: 123
	Get_Test()
		{
		return 'Test' $ .test
		}
	get_test()
		{
		return '- test'
        }
    Get_(member)
        {
        return 'Get: ' $ member
        }
	} */
let fn3 = function (member = su.mandatory()) {
    su.maxargs(1, arguments.length);
    return "Get: " + su.toStr(member);
};
let cl2 = makeClass(false, [
    {key: 'X', value: 123},
    {key: 'Get_Test', value: fn1, params: '', paramNames: []},
    {key: 'Get_eval$c_test', value: fn2, params: '', paramNames: []},
    {key: 'Get_', value: fn3, params: 'member', paramNames: ['member']},
]);
assert.equal(su.get(cl2, "X"), 123);
assert.equal(su.get(cl2, "Test"), "Get: Test");
assert.equal(su.get(cl2, "TestTest"), "Get: TestTest");

// Test GetDefault
let c = su.instantiate(cl1);
function testGetDefault(c: any, key: any, def: any, expected: any) {
    assert.equal(su.invoke(c, "GetDefault", key, def), expected);
}
testGetDefault(c, 'X', 'unused', 123);
testGetDefault(c, 'Test', 'unused', 'Test - test');
testGetDefault(cl2, 'Key', 'unused', 'Get: Key');
testGetDefault(cl1, 'Key', 'value', 'value');
testGetDefault(c, 'Key', 111, 111);
su.put(c, "Key", 'new value');
testGetDefault(c, 'Key', 111, 'new value');

// If default value is a block,
// GetDefault should call the block and return the result
// b = { 'block' }
let b = (function () {
    let $f: any = function () {
        su.maxargs(0, arguments.length);
        return "block";
    };
    $f.$callableType = "BLOCK";
    $f.$call = $f;
    $f.$params = '';
    return $f;
    })();
testGetDefault(c, "NewKey", b, "block");

// If default values are others
// GetDefault should return the value directly
// f = function() { return 'function' }
let f = (function () {
    let $f: any = function () {
        su.maxargs(0, arguments.length);
        return "function";
    };
    $f.$callableType = "FUNCTION";
    $f.$call = $f;
    $f.$params = '';
    return $f;
    })();
testGetDefault(c, "NewKey", f, f);

// Test display
let cl3 = makeClass(false, [], 'stdlib', 'TestClass$c');
assert.equal(cl3.display(), "/* class */");
cl3 = makeClass(false, [], 'stdlib', 'TestClass');
assert.equal(cl3.display(), "TestClass/* stdlib class */");
cl3 = makeClass(false, [], '', 'TestClass');
assert.equal(cl3.display(), "TestClass");

c = su.instantiate(cl3);
assert.equal(c.display(), "TestClass()");

let toStringReturn: any = "ToString Method return";
let fn4 = function () {
    su.maxargs(0, arguments.length);
    return toStringReturn;
};
cl3 = makeClass(false, [
    {key: 'ToString', value: fn4, params: '', paramNames: []},
]);
c = su.instantiate(cl3);
assert.equal(c.display(), toStringReturn);

toStringReturn = 1;
assert.throws(() => c.display(), "ToString should return a string");

// Test Default calls
/* class
	{
	Test()
		{
		return 'Test'
		}
    Default(@args)
        {
        return args
        }
	} */
let fn5 = function () {
    su.maxargs(0, arguments.length);
    return "Test";
};
let fn6 = function (args: SuObject = su.mandatory()) {
    su.maxargs(1, arguments.length);
    return args;
};
let cl4 = makeClass(false, [
    {key: 'Test', value: fn5, params: '', paramNames: []},
    {key: 'Default', value: fn6, params: '@args', paramNames: ['args']},
]);
assert.equal(su.invoke(cl4, "Test"), "Test");
assert.equal(su.invoke(cl4, "Test1"), makeObj(["Test1"]));
assert.equal(su.invoke(cl4, "Test1", 1, 2), makeObj(["Test1", 1, 2]));
assert.equal(su.invokeNamed(cl4, "Test1", {a: 'aa', b: 'bb'}, 1, 2),
    makeObj(["Test1", 1, 2], ['a', 'aa'], ['b', 'bb']));
assert.equal(su.invokeAt(cl4, "Test1", makeObj([1], ['a', 'aa'])),
    makeObj(["Test1", 1], ['a', 'aa']));

c = su.instantiate(cl4);
assert.equal(su.invoke(cl4, "Test"), "Test");
assert.equal(su.invoke(cl4, "Test1"), makeObj(["Test1"]));
assert.equal(su.invoke(cl4, "Test1", 1, 2), makeObj(["Test1", 1, 2]));
assert.equal(su.invokeNamed(cl4, "Test1", {a: 'aa', b: 'bb'}, 1, 2),
    makeObj(["Test1", 1, 2], ['a', 'aa'], ['b', 'bb']));
assert.equal(su.invokeAt(cl4, "Test1", makeObj([1], ['a', 'aa'])),
    makeObj(["Test1", 1], ['a', 'aa']));
