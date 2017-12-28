import { SuNum } from "./sunum";
import { SuObject } from "./suobject";
import * as su from "./su";
import * as assert from "./assert";

let n = SuNum.make;

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

let f = {
    $call: function(...args: any[]) { return ['call', args]; },
    $callAt: function(arg: any) { return ['callAt', arg]; },
    $callNamed: function(named: any, ...args: any[]) { return ['callNamed', named, args]; },
};

assert.equal(su.call(f, 1, 2), ['call', [1, 2]]);
ob = new SuObject().Add(1).put('a', 2);
assert.equal(su.callAt(f, ob), ['callAt', ob]);
assert.equal(su.callNamed(f, { a: 3, b: 4 }, 1, 2), ['callNamed', { a: 3, b: 4 }, [1, 2]]);
assert.throws(() => su.call(123), /can't call/);

ob = new SuObject([1, 2, 3]);
ob.put('ka', 'a');
assert.equal(su.call('Size', ob), 4);
assert.equal(su.callNamed('Size', {"list": true}, ob), 3);
let args = new SuObject([ob]);
args.put('named', true);
assert.equal(su.callAt('Size', args), 1);

// lang port test

import { runFile } from "./porttests";

runFile("lang.test", { lang_range, lang_sub });

function lang_range(s: string, i: string|number, j: string|number, expected: string): boolean {
    i = Number(i);
    j = Number(j);
    let ob = new SuObject(s.split(''));
    let expected_ob = new SuObject(expected.split(''));
    return su.rangeto(s, i, j) === expected &&
        su.is(su.rangeto(ob, i, j), expected_ob);
}

function lang_sub(...args: string[]): boolean {
    let expected = args.pop()!;
    let s = args[0];
    let i = Number(args[1]);
    let n = arguments.length === 3 ? 999 : Number(args[2]);
    let ob = new SuObject(s.split(''));
    let expected_ob = new SuObject(expected.split(''));
    return su.rangelen(s, i, n) === expected &&
        su.is(su.rangelen(ob, i, n), expected_ob);
}
