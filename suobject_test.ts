/**
 * Created by andrew on 2015-05-31.
 */
"use strict";

import suob = require("./suobject");
import dnum = require("./dnum");
var n = dnum.make;
import assert = require("assert");

var ob = suob.make();
assert.equal(ob.size(), 0);
ob.add(123);
assert.equal(ob.size(), 1);
ob.put('a', 'hi');
assert.equal(ob.size(), 2);
assert.equal(ob.vecsize(), 1);
assert.equal(ob.mapsize(), 1);
assert.equal(ob.get(0), 123);
assert.equal(ob.get(dnum.ZERO), 123);
assert.equal(ob.get(1), undefined);
assert.equal(ob.get('a'), 'hi');
assert.equal(ob.get('b'), undefined);
// migrate
ob.put(2, 22);
assert.equal(ob.vecsize(), 1);
assert.equal(ob.mapsize(), 2);
ob.add(11);
assert.equal(ob.vecsize(), 3);
assert.equal(ob.mapsize(), 1);
ob.put(4, 44);
assert.equal(ob.vecsize(), 3);
assert.equal(ob.mapsize(), 2);
ob.put(3, 33);
assert.equal(ob.vecsize(), 5);
assert.equal(ob.mapsize(), 1);

ob.put(1.5, 15);
assert.equal(ob.get(1.5), 15);
assert.equal(ob.get(n(15, -1)), 15);


assert.equal(ob.get('x'), undefined);
ob.setDefault(0);
assert.equal(ob.get('x'), 0);

ob.setReadonly();
assert.throws(function () { ob.put('b', true); },
    /can't modify readonly objects/);