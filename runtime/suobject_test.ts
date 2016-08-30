import { SuObject } from "./suobject";
import { Dnum } from "./dnum";
import * as assert from "./assert";

const dn = Dnum.fromNumber;

let ob = new SuObject();
assert.equal(ob.size(), 0);
ob.add(123);
assert.equal(ob.size(), 1);
ob.put('a', 'hi');
assert.equal(ob.size(), 2);
assert.equal(ob.length, 2);
assert.equal(ob.vecsize(), 1);
assert.equal(ob.mapsize(), 1);
assert.equal(ob.get(0), 123);
assert.equal(ob.get(Dnum.ZERO), 123);
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
assert.equal(ob.get(dn(1.5)), 15);


assert.equal(ob.get('x'), undefined);
ob.setDefault(0);
assert.equal(ob.get('x'), 0);

ob.setReadonly();
assert.throws(() => ob.put('b', true),
    /can't modify readonly objects/);

ob = new SuObject();
assert.that(ob.equals(ob));
assert.that(!ob.equals(123));
let ob2 = new SuObject();
assert.that(ob.equals(ob2));
ob.add(123);
assert.that(!ob.equals(ob2));
assert.that(!ob2.equals(ob));
ob2.add(123);
assert.that(ob.equals(ob2));
assert.that(ob2.equals(ob));
ob.put('a', 'alpha');
ob2.put('a', 'Alpha');
assert.that(!ob.equals(ob2));
assert.that(!ob2.equals(ob));
ob2.put('a', 'alpha');
assert.that(ob.equals(ob2));
assert.that(ob2.equals(ob));

ob = new SuObject();
assert.equal(ob.toString(), '#()');
ob.add(12);
ob.add(34);
assert.equal(ob.toString(), '#(12, 34)');
ob.put('b', 'Bob');
assert.equal(ob.toString(), '#(12, 34, b: "Bob")');

ob = new SuObject();
ob.put('a b', dn(1000));
assert.equal(ob.toString(), '#("a b": 1000)');

ob = new SuObject();
ob.add('a b');
assert.equal(ob.toString(), '#("a b")');
