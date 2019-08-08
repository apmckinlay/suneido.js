import * as assert from "./assert";
import { Pack } from "./pack";
import { ByteBuffer } from "./bytebuffer";
import { SuNum } from "./sunum";
import { SuDate } from "./sudate";
import { SuRecord } from "./surecord";
import { makeObj } from "./testUtility";

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
