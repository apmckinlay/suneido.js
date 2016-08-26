const su = require("./su.js");
const assert = require("./assert.js");

"use strict";

// JsTranslate('function (a,b=1,c=2) { return [:a, :b, :c] }')
let f = (function () {
    function $callNamed(named, a, b, c) {
        ({ a = a, b = b, c = c } = named);
        return $f(a, b, c);
    }
    function $f(a = su.mandatory(), b = 1, c = 2) {
        return [a, b, c]; //su.callNamed(su.global("Record"), {"a": a, "b": b, "c": c, });
    }
    $f.call = $f;
    $f.callNamed = $callNamed;
    $f.callAt = function (args) {
        return $callNamed(su.toObject(args.map), ...args.vec);
    };
    $f.params = 'a, b=1, c=2';
    return $f
    })();

assert.throws(() => f.call(), /missing argument/);

assert.equal(f.call(0),         [0, 1, 2]);
assert.equal(f.call(0, 11),     [0, 11, 2]);
assert.equal(f.call(0, 11, 22), [0, 11, 22]);

assert.equal(f.callNamed({}, 0),                [0, 1, 2]);
assert.equal(f.callNamed({c: 9}, 0),            [0, 1, 9]);
assert.equal(f.callNamed({a: 9}, 4, 5, 6),      [9, 5, 6]);
assert.equal(f.callNamed({a: 4, b: 5, c: 6}),   [4, 5, 6]);

assert.throws(() => f.callAt(su.mkObject()), /missing argument/);
assert.equal(f.callAt(su.mkObject(0)),                              [0, 1, 2]);
assert.equal(f.callAt(su.mkObject(0, null, 'c', 9)),                [0, 1, 9]);
assert.equal(f.callAt(su.mkObject(4, 5, 6, null, 'a', 9)),          [9, 5, 6]);
assert.equal(f.callAt(su.mkObject(null, 'a', 4, 'b', 5, 'c', 6)),   [4, 5, 6]);

// JsTranslate('function (@args) { return args }')
const g = (function () {
    function $f(args = su.mandatory()) {
        return args;
    }
    $f.callAt = $f;
    $f.call = function (...args) {
        return $f(su.mkObject2(args));
    };
    $f.callNamed = function (named, ...args) {
        return $f(su.mkObject2(args, su.toMap(named)));
    };
    $f.params = '@args';
    return $f
    })();

assert.equal(g.callAt(su.empty_object).toString(), '#()');
assert.equal(g.callAt(su.mkObject(1, null, 'a', 2)).toString(), '#(1, a: 2)');

assert.equal(g.call().toString(), '#()');
assert.equal(g.call(1, 2, 3).toString(), '#(1, 2, 3)');

assert.equal(g.callNamed({a: 2}, 1).toString(), '#(1, a: 2)');
