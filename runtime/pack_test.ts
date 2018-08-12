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
test([3, 255], SuNum.INF);
test([2, 0], SuNum.MINUS_INF);
test([3, 129, 0, 1], 1);
test([3, 129, 0, 4, 36, 239, 28, 209, 1, 235], SuNum.make(4945573770491, -12));
test([], "");
test([4, 97, 98, 99], "abc");
test([5, 0, 15, 197, 11, 5, 212, 28, 3], SuDate.make(2018, 8, 11, 23, 20, 7, 3));
test([6], makeObj([]));
test([7], SuRecord.mkRecord(makeObj([])));
test([3, 130, 0, 1], 10000);
test([3, 130, 0, 1, 0, 1], 10001);
test([3, 129, 4, 210], 1234);
test([3, 130, 4, 210, 22, 46], 12345678);
test([3, 131, 0, 12, 13, 128, 30, 210], 1234567890);
test([2, 124, 255, 243, 242, 127, 225, 45], -1234567890);

// test unpack dnum
test([2, 142, 255, 132], SuNum.make(-123, -64));
test([3, 128, 0, 10], SuNum.make(1, -3));
test([3, 132, 4, 210, 22, 46, 35, 52, 13, 128], 1234567890123456);
test([2, 151, 251, 49], SuNum.make(-123, -99));
test([3, 154, 0, 45, 23, 112], SuNum.make(456, 99));

// test uppack [-1, 1.1, a: "a", ob: #(true, false)]
test([7, 128, 0, 0, 2, 128, 0, 0, 4, 2, 126, 255, 254, 128, 0, 0, 6, 3,
    129, 0, 1, 3, 232, 128, 0, 0, 2, 128, 0, 0, 2, 4, 97, 128, 0, 0, 2, 4, 97,
    128, 0, 0, 3, 4, 111, 98, 128, 0, 0, 19, 6, 128, 0, 0, 2, 128, 0, 0, 1, 1,
    128, 0, 0, 1, 0, 128, 0, 0, 0], SuRecord.mkRecord(makeObj([-1, SuNum.make(11, -1)], ['a', 'a'], ['ob', makeObj([true, false])])));
