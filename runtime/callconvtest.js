const su = require("./su.js");
const assert = require("./assert.js");

"use strict";

let f = (function() {
    function callNamed(named, a, b, c) {
        ({ a = a, b = b, c = c } = named);
        return call(a, b, c);
    }
    function call(a = su.mandatory(), b = 1, c = 2) {
        return [a, b, c];
    }
    return {
        call,
        callNamed,
        callAt(args) {
            return callNamed(su.toObject(args.map), ...args.vec);
        },
        params: 'a, b=1, c=2'
    }})();

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

const g = (function () {
    function callAt(args = su.mandatory()) {
        return args.toString();
    }
    return {
        callAt,
        call(...args) {
            return callAt(su.mkObject2(args));
        },
        callNamed(named, ...args) {
            return callAt(su.mkObject2(args, su.toMap(named)));
        },
        params: '@args'
    }})();

assert.equal(g.callAt(su.empty_object), '#()');
assert.equal(g.callAt(su.mkObject(1, null, 'a', 2)), '#(1, a: 2)');

assert.equal(g.call(), '#()');
assert.equal(g.call(1, 2, 3), '#(1, 2, 3)');

assert.equal(g.callNamed({a: 2}, 1), '#(1, a: 2)');
