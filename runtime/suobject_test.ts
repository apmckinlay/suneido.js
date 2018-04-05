import { SuObject, ObjectIter, Values } from "./suobject";
import { SuNum } from "./sunum";
import * as assert from "./assert";
import { SuIterable } from "./suvalue";
import { makeObj } from "./testUtility";

const dn = SuNum.fromNumber;

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
assert.equal(ob.get(SuNum.ZERO), 123);
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

// cmp
function cmp(x: SuObject, y: SuObject, expected: number): void {
    assert.equal(x.compareTo(y), expected);
    assert.equal(y.compareTo(x), -expected);
}
ob = new SuObject();
cmp(ob, ob, 0);
ob2 = new SuObject();
cmp(ob, ob2, 0);
ob.add(123);
cmp(ob, ob2, +1);
ob2.add(SuNum.fromNumber(123));
cmp(ob, ob2, 0);
ob.add(456);
cmp(ob, ob2, +1);

// toString
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

// Join
function joinTest(expected: string, sep: string, ...args: any[]) {
    let temp = new SuObject(args);
    assert.equal(temp.Join(sep), expected);
}
joinTest('', '');
joinTest("", "<>");
joinTest("", "", "", "", "");
joinTest("abc", "", "abc");
joinTest("abc", "<>", "abc");
joinTest("123", "", 1, 2, 3);
joinTest("1.2.3", ".", 1, 2, 3);
joinTest("1.two.3", ".", 1, "two", 3);
joinTest("1<>2<>3", "<>", 1, 2, 3);
let ob1 = new SuObject([1, 2]);
let iter = ob1.Iter();
let num = SuNum.make(123, -2);
joinTest('#(1, 2), aObjectIter, 1.23', ', ', ob1, iter, num);

// Iter & ObjectIter
function iterTest(iter: SuIterable, expected: any[]) {
    let temp = iter.Next();
    function find(value: string | number | any[]) {
        if (temp instanceof SuObject)
            return temp.get(0) === (value as any[])[0] &&
                temp.get(1) === (value as any[])[1];
        else
            return value === temp;
    }
    while (temp !== iter) {
        assert.that(expected.findIndex(find) !== -1, "match " + temp);
        temp = iter.Next();
    }
}
ob = new SuObject();
iterTest(ob.Iter(), []);
ob = new SuObject([1, 2, 3, 4]);
ob.put('key_a', 'a');
ob.put('key_b', 'b');
let iter1 = ob.Iter();
iterTest(iter1, [1, 2, 3, 4, 'a', 'b']);
iterTest(iter1.Dup(), [1, 2, 3, 4, 'a', 'b']);

function modifyDuringIteration(modifyOp: (ob: SuObject) => void) {
    let fn = function() {
        let ob1 = new SuObject([1, 2, 3, 4]);
        let iter2 = ob1.Iter();
        iter2.Next();
        modifyOp(ob1);
        iter2.Next();
    };
    return fn;
}
assert.throws(modifyDuringIteration((ob) => ob.add('5')), "object modified during iteration");
assert.throws(modifyDuringIteration((ob) => ob.put('a', '5')), "object modified during iteration");
assert.throws(modifyDuringIteration((ob) => ob.delete(1)), "object modified during iteration");
assert.throws(modifyDuringIteration((ob) => ob.erase(1)), "object modified during iteration");
assert.throws(modifyDuringIteration((ob) => ob.clear()), "object modified during iteration");

iterTest(new ObjectIter(ob, Values.ITER_KEYS), [0, 1, 2, 3, 'key_a', 'key_b']);
iterTest(new ObjectIter(ob, Values.ITER_ASSOCS),
    [[0, 1], [1, 2], [2, 3], [3, 4], ['key_a', 'a'], ['key_b', 'b']]);
iterTest(new ObjectIter(ob, Values.ITER_KEYS, false, true), ['key_a', 'key_b']);
iterTest(new ObjectIter(ob, Values.ITER_KEYS, true, false), [0, 1, 2, 3]);

// delete & erase
ob = new SuObject([1, 2, 3, 4]);
ob.put('a', 'a');
assert.equal(ob.get(1), 2);
assert.equal(ob.get('a'), 'a');
ob.delete(1);
assert.equal(ob.get(1), 3);
ob.delete('a');
assert.that(!ob["Member?"]('a'));

ob = new SuObject([1, 2, 3, 4]);
ob.put('a', 'a');
assert.equal(ob.get(1), 2);
assert.equal(ob.get('a'), 'a');
ob.erase(1);
assert.that(!ob["Member?"](1));
assert.equal(ob.get(2), 3);
ob.erase('a');
assert.that(!ob["Member?"]('a'));

// Unique!
cmp(new SuObject()["Unique!"](), new SuObject(), 0);
cmp(new SuObject([1, 2, 3])["Unique!"](), new SuObject([1, 2, 3]), 0);
cmp(new SuObject([1, 1, 2, 3, 1])["Unique!"](), new SuObject([1, 2, 3, 1]), 0);

// Reverse!
cmp(makeObj([])["Reverse!"](), makeObj([]), 0);
cmp(makeObj([1, 2, 3])["Reverse!"](), makeObj([3, 2, 1]), 0);
cmp(makeObj([1, 2, 3], ['a', 'a'])["Reverse!"](), makeObj([3, 2, 1], ['a', 'a']), 0);

// Add
ob = makeObj([0, 1, 2], [6, 6], ['a', 'a']);
assert.throws(() => ob.Add(makeObj([], ['invalid', 1])),
    "usage: object.Add(value, ... [ at: position ])");
assert.throws(() => ob.Add(makeObj([], ['at', 1], ['invalid', 1])),
    "usage: object.Add(value, ... [ at: position ])");
assert.throws(() => ob.Add(makeObj([1, 2], ['at', 'a'])),
    "can only Add multiple values to un-named or to numeric positions");
// ob.Add()
cmp(ob.Add(makeObj([])), ob, 0);
// ob.Add(3)
cmp(ob.Add(makeObj([3])), makeObj([0, 1, 2, 3], [6, 6], ['a', 'a']), 0);
// ob.Add(4, 5, at: 4.9) -> migrate
cmp(ob.Add(makeObj([4, 5], ['at', SuNum.fromNumber(4.9)])), makeObj([0, 1, 2, 3, 4, 5, 6], ['a', 'a']), 0);
// ob.Add('b', at: 'b')
cmp(ob.Add(makeObj(['b'], ['at', 'b'])), makeObj([0, 1, 2, 3, 4, 5, 6], ['a', 'a'], ['b', 'b']), 0);
ob.Set_readonly();
assert.throws(() => ob.Add(makeObj([1])), "can't modify readonly objects");

// Test handle map & canonical
ob = makeObj([]);
ob.put(SuNum.fromNumber(1.1), 1);
ob.put(SuNum.fromNumber(-1.2), 2);
assert.equal(ob.get(SuNum.fromNumber(1.1)), 1);
assert.equal(ob.Find(2), SuNum.fromNumber(-1.2));
assert.that(ob["Member?"](SuNum.fromNumber(-1.2)));
ob.delete(SuNum.fromNumber(1.1));
cmp(ob, makeObj([], [SuNum.fromNumber(-1.2), 2]), 0);
cmp(ob.Members(), makeObj([SuNum.fromNumber(-1.2)]), 0);

// Test LowerBound, UpperBound & EqualRange
function testFn(ob: SuObject, value: any,
    expected_lower: number, expected_upper: number,
    expected_equal: [number, number], block?: any) {
    assert.equal(ob.LowerBound(value, block), expected_lower);
    assert.equal(ob.UpperBound(value, block), expected_upper);
    cmp(ob.EqualRange(value, block), makeObj(expected_equal), 0);
}
ob = makeObj([]);
testFn(ob, 1, 0, 0, [0, 0]);
ob = makeObj([1, 1, 2, 2, 3, 3, 4, 4]);
testFn(ob, 0, 0, 0, [0, 0]);
testFn(ob, 5, 8, 8, [8, 8]);
testFn(ob, 2, 2, 4, [2, 4]);
testFn(ob, SuNum.fromNumber(2.5), 4, 4, [4, 4]);

ob = makeObj([4, 4, 3, 3, 2, 2, 1, 1]);
let $f: any = {};
$f.$call = (x: number, y: number) => x > y;
testFn(ob, 2, 4, 6, [4, 6], $f);
