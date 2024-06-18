import * as assert from "./assert";
import { Pack } from "./pack";
import { ByteBuffer } from "./bytebuffer";
import { SuNum } from "./sunum";
import { SuDate } from "./sudate";
import { SuRecord } from "./surecord";
import { makeObj } from "./testUtility";
import { mkObject, mkObject2 } from "./su";
import { su_seq } from "./builtin/seq";
import { RootClass } from "./rootclass";

let fn = Pack.unpack;
function createBuffer(array: number[]) {
    let buf = new Uint8Array(new ArrayBuffer(array.length));
    buf.set(array);
    return new ByteBuffer(buf);
}
function test(array: number[], expected: any) {
    let buf = createBuffer(array);
    let res = fn(buf);
    assert.equal(res, expected);
}

test([0], false);
test([1], true);
test([3], 0);
test([3, 255, 255], SuNum.INF);
test([2, 0, 0], SuNum.MINUS_INF);
test([3, 129, 10], 1);
test([3, 129, 49, 45, 57, 37, 70, 49, 10], SuNum.make(4945573770491, -12));
test([], "");
test([4, 97, 98, 99], "abc");
test([5, 0, 15, 197, 11, 5, 212, 28, 3], SuDate.make(2018, 8, 11, 23, 20, 7, 3));
test([6], makeObj([]));
test([7], SuRecord.mkRecord(makeObj([])));
test([3, 133, 10], 10000);
test([3, 133, 10, 0, 10], 10001);
test([3, 132, 12, 34], 1234);
test([3, 136, 12, 34, 56, 78], 12345678);
test([3, 138, 12, 34, 56, 78, 90], 1234567890);
test([2, 117, 243, 221, 199, 177, 165], -1234567890);

// test unpack dnum
test([2, 188, 243, 225], SuNum.make(-123, -64));
test([3, 126, 10], SuNum.make(1, -3));
test([3, 144, 12, 34, 56, 78, 90, 12, 34, 56], 1234567890123456);
test([2, 223, 243, 225], SuNum.make(-123, -99));
test([3, 230, 45, 60], SuNum.make(456, 99));

// test unpack [-1, 1.1, a: "a", ob: #(true, false)]
test([7, 2, 3, 2, 126, 245, 3, 3, 129, 11, 2, 3, 4, 111, 98,
    7, 6, 2, 1, 1, 1, 0, 0, 2, 4, 97, 2, 4, 97],
SuRecord.mkRecord(makeObj([-1, SuNum.make(11, -1)], ['a', 'a'], ['ob', makeObj([true, false])])));

function testPackUnpack(v: any) {
    let buf = Pack.pack(v);
    let result = Pack.unpack(new ByteBuffer(buf));
    assert.equal(v, result);
}

testPackUnpack(false);
testPackUnpack(true);
testPackUnpack(0);
testPackUnpack(SuNum.INF);
testPackUnpack(SuNum.MINUS_INF);
testPackUnpack(1);
testPackUnpack(SuNum.make(4945573770491, -12));

testPackUnpack(10000);
testPackUnpack(10001);
testPackUnpack(1234);
testPackUnpack(12345678);
testPackUnpack(1234567890);
testPackUnpack(-1234567890);

testPackUnpack(SuNum.make(-123, -64));
testPackUnpack(SuNum.make(1, -3));
testPackUnpack(1234567890123456);
testPackUnpack(SuNum.make(-123, -99));
testPackUnpack(SuNum.make(456, 99));

testPackUnpack("");
testPackUnpack("abc");

testPackUnpack(mkObject(null, 'evnetId', 2));

testPackUnpack(SuDate.make(2018, 8, 11, 23, 20, 7, 3));
testPackUnpack(SuDate.make(2018, 8, 11, 23, 20, 7, 3, 3));

testPackUnpack(SuRecord.mkRecord(makeObj([])));
testPackUnpack(SuRecord.mkRecord(makeObj([-1, SuNum.make(11, -1)], ['a', 'a'], ['ob', makeObj([true, false])])));

testPackUnpack('a'.repeat(1000));
// test varintLen > 1
let numbers = new Array(10000);
for (let i = 0; i < 9999; i++) {
    numbers[i] = i;
}
numbers[9999] = null;
testPackUnpack(mkObject(1, 'a'.repeat(1000), mkObject(...numbers), null, 'name', 2));

testPackUnpack(su_seq(0, 1000));

function testPackNum(v: string, array: number[]) {
    let packed = Pack.pack(SuNum.parse(v));
    assert.that(array.every((v, i) => v === packed[i]));
}

testPackNum('0', [3]);
testPackNum('1', [3, 129, 10]);
testPackNum('-1', [2, 126, 10^0xff]);
testPackNum(".1", [3, 128, 10]);
testPackNum("20000", [3, 133, 20]);
testPackNum("123.456", [3, 131, 12, 34, 56]);
testPackNum("12345678.87654321", [3, 136, 12, 34, 56, 78, 87, 65, 43, 21]);
testPackNum("1e23", [3, 152, 10]);
testPackNum("-1e23", [2, 152^0xff, 10^0xff]);
testPackNum("1e-23", [3, 106, 10]);
testPackNum('9999', [3, 132, 99, 99]);
testPackNum('99999', [3, 133, 99, 99, 90]);
testPackNum('999999', [3, 134, 99, 99, 99]);
testPackNum('9999999', [3, 135, 99, 99, 99, 90]);
testPackNum('-9999999', [2, 120, 156, 156, 156, 165]);

assert.throws(() => Pack.pack(null), "can't pack null");
assert.throws(() => Pack.pack(Object.freeze(new RootClass())), "can't pack Class");

let ob = mkObject2([1, 'a']);
ob.add(ob);
assert.throws(() => Pack.pack(ob), "can't pack object/record containing itself");

ob = mkObject2([]);
let curOb = ob;
for (let i = 0; i < 16 + 1; i++) {
    let newOb = mkObject2([]);
    curOb.add(newOb);
    curOb = newOb;
}
assert.throws(() => Pack.pack(ob), 'object nesting overflow');