import { SuObject } from "./suobject";
import { Dnum } from "./dnum";
import * as assert from "./assert";

const dn = Dnum.fromNumber;

let ob = new SuObject();
assert.equal(ob.size(), 0);
ob.Add(123);
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
ob.Add(11);
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
ob.Set_default(0);
assert.equal(ob.get('x'), 0);

ob.Set_readonly();
assert.throws(() => ob.put('b', true),
    /can't modify readonly objects/);

// equals
ob = new SuObject();
assert.that(ob.equals(ob));
assert.that(!ob.equals(123));
let ob2 = new SuObject();
assert.that(ob.equals(ob2));
ob.Add(123);
assert.that(!ob.equals(ob2));
assert.that(!ob2.equals(ob));
ob2.Add(123);
assert.that(ob.equals(ob2));
assert.that(ob2.equals(ob));
ob.put('a', 'alpha');
ob2.put('a', 'Alpha');
assert.that(!ob.equals(ob2));
assert.that(!ob2.equals(ob));
ob2.put('a', 'alpha');
assert.that(ob.equals(ob2));
assert.that(ob2.equals(ob));

// cmp
function cmp(x: SuObject, y: SuObject, expected: number): void {
    assert.equal(x.compareTo(y), expected);
    assert.equal(y.compareTo(x), -expected);
}
ob = new SuObject();
cmp(ob, ob, 0);
ob2 = new SuObject();
cmp(ob, ob2, 0);
ob.Add(123);
cmp(ob, ob2, +1);
ob2.Add(Dnum.fromNumber(123));
cmp(ob, ob2, 0);
ob.Add(456);
cmp(ob, ob2, +1);

// toString
ob = new SuObject();
assert.equal(ob.toString(), '#()');
ob.Add(12);
ob.Add(34);
assert.equal(ob.toString(), '#(12, 34)');
ob.put('b', 'Bob');
assert.equal(ob.toString(), '#(12, 34, b: "Bob")');

ob = new SuObject();
ob.put('a b', dn(1000));
assert.equal(ob.toString(), '#("a b": 1000)');

ob = new SuObject();
ob.Add('a b');
assert.equal(ob.toString(), '#("a b")');
