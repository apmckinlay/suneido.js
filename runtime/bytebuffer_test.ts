import { ByteBuffer } from "./bytebuffer";
import * as assert from "./assert";

let array = new Uint8Array(new ArrayBuffer(10));
array.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

let buf1 = new ByteBuffer(array);
assert.equal(buf1.remaining(), 10);

assert.equal(buf1.get(), 0);
assert.equal(buf1.get(2), 2);
assert.equal(buf1.position(), 1);
assert.equal(buf1.getShort(), 0x102);
assert.equal(buf1.position(), 3);
assert.equal(buf1.getInt(), 0x3040506);
assert.equal(buf1.position(), 7);

buf1.position(1);
assert.equal(buf1.position(), 1);
let buf2 = buf1.slice();
assert.equal(buf2.position(), 0);
assert.equal(buf2.remaining(), 9);

buf2.limit(1);
assert.equal(buf2.remaining(), 1);
assert.equal(buf2.get(), 1);
assert.throws(() => buf2.get(), "ByteBuffer access exceeds limit");
assert.throws(() => buf2.getInt(), "ByteBuffer access exceeds limit");
assert.equal(buf1.remaining(), 9);

assert.throws(() => buf1.limit(20), "New limit is larger than buffer's capacity");
assert.throws(() => buf2.limit(20), "New limit is larger than buffer's capacity");
