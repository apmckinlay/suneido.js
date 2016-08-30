import { Dnum } from "./dnum";
import { SuObject } from "./suobject";
import * as su from "./su";

import * as assert from "./assert";

let n = Dnum.make;

function is(x: any, y: any): void {
    assert.that(su.is(x, y), x + " is " + y + " should be true");
    assert.that(su.is(y, x), y + " is " + x + " should be true");
}
is(true, true);
is('hello', 'hello');
is(123, 123);
is(123, n(123));
is(n(15, -1), 1.5);
let x = su.mkObject();
isnt(x, 123);
let y = su.mkObject();
is(x, y);
x = su.mkObject(123);
isnt(x, y);
y = su.mkObject(123);
is(x, y);

function isnt(x: any, y: any): void {
    assert.that(su.isnt(x, y), x + " isnt " + y + " should be true");
    assert.that(su.isnt(y, x), y + " isnt " + x + " should be true");
}
isnt(true, false);
isnt(123, 'hello');
isnt(n(1), true);

function add(x: any, y: any, expected: any): void {
    let sum = su.add(x, y);
    assert.that(su.is(sum, expected), "add " + x + ", " + y +
        " expected " + expected + " got " + sum);
    sum = su.add(y, x);
    assert.that(su.is(sum, expected), "add " + y + ", " + x +
        " expected " + expected + " got " + sum);
}
add(1, 2, 3);
add(n(1), n(2), n(3));
add(n(1), 2, n(3));

assert.equal(su.get('hello', 1), 'e');
assert.equal(su.get('hello', n(1)), 'e');
assert.throws(function() { su.get('hello', 'x'); },
    /can't convert String to integer/);

let ob = new SuObject();
su.put(ob, 'n', 123);
assert.equal(su.get(ob, 'n'), 123);

assert.equal(su.typeName(true), 'Boolean');
assert.equal(su.typeName('hello'), 'String');
assert.equal(su.typeName(123), 'Number');
assert.equal(su.typeName(n(123)), 'Number');
assert.equal(su.typeName(new SuObject()), 'Object');

assert.equal(su.rangeto("abcde", 1, 4), "bcd");
assert.equal(su.rangeto("abcde", 2, 9), "cde");
assert.equal(su.rangeto("abcde", 1, -1), "bcd");
assert.equal(su.rangeto("abcde", -2, -1), "d");
assert.equal(su.rangeto("abcde", 4, 1), "");

assert.equal(su.rangelen("abcde", 1, 3), "bcd");
assert.equal(su.rangelen("abcde", 2, 9), "cde");
assert.equal(su.rangelen("abcde", -2, 1), "d");
assert.equal(su.rangelen("abcde", 3, 0), "");
assert.equal(su.rangelen("abcde", 3, -3), "");

let list = SuObject.list;
function eq(x: any, y: any) { assert.that(x.equals(y), x + " should be " + y); }
eq(su.rangeto(list(0, 1, 2, 3, 4), 2, 9), list(2, 3, 4));
eq(su.rangeto(list(0, 1, 2, 3, 4), 1, 4), list(1, 2, 3));
eq(su.rangeto(list(0, 1, 2, 3, 4), 1, -1), list(1, 2, 3));
eq(su.rangeto(list(0, 1, 2, 3, 4), -2, -1), list(3));
eq(su.rangeto(list(0, 1, 2, 3, 4), 4, 1), list());

eq(su.rangelen(list(0, 1, 2, 3, 4), 1, 3), list(1, 2, 3));
eq(su.rangelen(list(0, 1, 2, 3, 4), 2, 9), list(2, 3, 4));
eq(su.rangelen(list(0, 1, 2, 3, 4), -2, 1), list(3));
eq(su.rangelen(list(0, 1, 2, 3, 4), 3, 0), list());
eq(su.rangelen(list(0, 1, 2, 3, 4), 3, -3), list());

function disp(x: any, expected: string) {
    assert.equal(su.display(x), expected);
}
disp(true, 'true');
disp(123, '123');
disp(n(1234, -2), '12.34');
disp('hello', '"hello"');
disp('a\\b', '`a\\b`');
disp('a"b', "'a\"b'");

assert.equal(su.typename(null), "null");
assert.equal(su.typename(undefined), "undefined");
assert.equal(su.typename(123), "number");
assert.equal(su.typename("foo"), "string");

let f = {
    $call: function(...args: any[]) { return ['call', args]; },
    $callAt: function(arg: any) { return ['callAt', arg]; },
    $callNamed: function(named: any, ...args: any[]) { return ['callNamed', named, args]; },
};

assert.equal(su.call(f, 1, 2), ['call', [1, 2]]);
ob = new SuObject().add(1).put('a', 2);
assert.equal(su.callAt(f, ob), ['callAt', ob]);
assert.equal(su.callNamed(f, { a: 3, b: 4 }, 1, 2), ['callNamed', { a: 3, b: 4 }, [1, 2]]);
assert.throws(() => su.call(123), /can't call/);

