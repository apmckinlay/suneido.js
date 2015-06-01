/**
 * Created by andrew on 2015-05-30.
 */
"use strict";

import dnum = require("./dnum");
import suob = require("./suobject");
import su = require("./su");

var assert = require("assert");

var n = dnum.make;

function is(x, y): void {
    assert(su.is(x, y), x + " is " + y + " should be true");
    assert(su.is(y, x), y + " is " + x + " should be true");
}
is(true, true);
is('hello', 'hello');
is(123, 123);
is(123, n(123));
is(n(15, -1), 1.5);

function isnt(x, y): void {
    assert(su.isnt(x, y), x + " isnt " + y + " should be true");
    assert(su.isnt(y, x), y + " isnt " + x + " should be true");
}
isnt(true, false);
isnt(123, 'hello');
isnt(n(1), true);

function add(x, y, expected): void {
    var sum = su.add(x, y);
    assert(su.is(sum, expected), "add " + x + ", " + y +
        " expected " + expected + " got " + sum);
    sum = su.add(y, x);
    assert(su.is(sum, expected), "add " + y + ", " + x +
        " expected " + expected + " got " + sum);
}
add(1, 2, 3);
add(n(1), n(2), n(3));
add(n(1), 2, n(3));

assert.equal(su.get('hello', 1), 'e');
assert.equal(su.get('hello', n(1)), 'e');
assert.throws(function () { su.get('hello', 'x') }, /can't convert to integer/);

var ob = suob.make();
su.put(ob, 'n', 123);
assert.equal(su.get(ob, 'n'), 123);
