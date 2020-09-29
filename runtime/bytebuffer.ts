/* this is a simple implementation of Java ByteBuffer*/
export class ByteBuffer {
    private i: number = 0;
    private end: number;
    constructor(private buffer: Uint8Array) {
        this.end = this.buffer.byteLength;
    }
    public remaining() {
        return this.end - this.i;
    }
    public get(i: number|false = false) {
        if (i === false)
            return this.buf[this.i++];
        return this.buf[i];
    }
    public getShort() {
        return (this.buf[this.i++] << 8) + this.buf[this.i++];
    }
    public getInt() {
        return (this.getShort() << 16) + this.getShort();
    }
    public position(pos: number | false = false) {
        if (pos === false)
            return this.i;
        return this.i = pos;
    }
    public slice() {
        return new ByteBuffer(this.buffer.subarray(this.i));
    }
    public limit(limit: number) {
        if (limit > this.buffer.byteLength)
            throw new Error("ERROR: New limit is larger than buffer's capacity");
        this.end = limit;
        if (this.i > limit)
            this.i = limit;
    }
    get buf() {
        if (this.i >= this.end)
            throw new Error("ERROR: ByteBuffer access exceeds limit");
        return this.buffer;
    }
}
