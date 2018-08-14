import { SuNum } from "./sunum";
import { ByteBuffer } from "./bytebuffer";
import { SuRecord } from "./surecord";
import { SuObject } from "./suobject";
import { SuDate } from "./sudate";

enum Tag {
    FALSE = 0,
    TRUE,
    MINUS,
    PLUS,
    STRING,
    DATE,
    OBJECT,
    RECORD
}

export class Pack {
    private static UTF16ToAscii = new Map([
        [8364, 128], [8218, 130], [402, 131], [8222, 132], [8230, 133],
        [8224, 134], [8225, 135], [710, 136], [8240, 137], [352, 138],
        [8249, 139], [338, 140], [381, 142], [8216, 145], [8217, 146],
        [8220, 147], [8221, 148], [8226, 149], [8211, 150], [8212, 151],
        [732, 152], [8482, 153], [353, 154], [8250, 155], [339, 156],
        [382, 158], [376, 159]]);
    private static AsciiToUTF16 = new Map([
        [128, 8364], [130, 8218], [131, 402], [132, 8222], [133, 8230],
        [134, 8224], [135, 8225], [136, 710], [137, 8240], [138, 352],
        [139, 8249], [140, 338], [142, 381], [145, 8216], [146, 8217],
        [147, 8220], [148, 8221], [149, 8226], [150, 8211], [151, 8212],
        [152, 732], [153, 8482], [154, 353], [155, 8250], [156, 339],
        [158, 382], [159, 376]]);
    private static MAX_SHIFTABLE = Number.MAX_SAFE_INTEGER / 10000;
    public static convertStringToBuffer(s: string): ByteBuffer {
        let bufView = new Uint8Array(new ArrayBuffer(s.length));
        let code;
        for (let i = 0; i < s.length; i++) {
            code = s.charCodeAt(i);
            // JavaScript string is UTF-16 encoded.
            // Some characters' codes are different from the original extended ASCII codes.
            // Thus, here we need to map back to ASCII code in order to get the original bytes.
            bufView[i] = Pack.UTF16ToAscii.get(code) || code;
        }
        return new ByteBuffer(bufView);
    }
    public static unpack(buf: ByteBuffer): any {
        if (buf.remaining() === 0)
            return "";
        switch (buf.get()) {
            case Tag.FALSE:
                return false;
            case Tag.TRUE:
                return true;
            case Tag.MINUS:
            case Tag.PLUS:
                return Pack.unpackNum(buf);
            case Tag.STRING:
                return Pack.unpackString(buf, buf.position(), buf.remaining());
            case Tag.OBJECT:
                return Pack.unpackObject(buf);
            case Tag.RECORD:
                return Pack.unpackRecord(buf);
            case Tag.DATE:
                return Pack.unpackDate(buf);
            default:
                throw new Error("invalid unpack type: " + buf.get(buf.position() - 1));
        }
    }
    private static unpackNum(buf: ByteBuffer) {
        if (buf.remaining() === 0)
            return 0;
        let minus = buf.get(buf.position() - 1) === Tag.MINUS;
        let e = buf.get() & 0xff;
        if (e === 0)
            return SuNum.MINUS_INF;
        if (e === 255)
            return SuNum.INF;
        if (minus)
            e = (~e) & 0xff;
        e = e ^ 0x80;
        e = (e << 24) >> 24; // convert Uint8 to int
        e = e - buf.remaining() / 2;
        let n = Pack.unpackLongPart(buf, minus);
        for (; 1 <= e && e <= 2 && n <= Pack.MAX_SHIFTABLE; --e)
            n *= 10000;
        if (e === 0 && Number.isSafeInteger(n))
            return minus ? -n : n;
        return SuNum.make((minus ? -1 : 1) * n, 4 * e);
    }
    private static unpackLongPart(buf: ByteBuffer, minus: boolean) {
        let flip = minus ? 0xffff : 0;
        let n = 0;
        while (buf.remaining() > 0)
            n = n * 10000 + (buf.getShort() ^ flip);
        return n;
    }
    private static unpackString(buf: ByteBuffer, pos: number, len: number) {
        if (len === 0)
            return "";
        let c: number[] = [];
        let code;
        for (let i = 0; i < len; i++) {
            code = buf.get(pos + i);
            c[i] = Pack.AsciiToUTF16.get(code) || code;
        }
        return String.fromCharCode(...c);
    }
    private static unpackObject(buf: ByteBuffer) {
        let vec: any[] = [];
        let map: Map<any, any> = new Map();
        if (buf.remaining() !== 0) {
            let n = buf.getInt() ^ 0x80000000;
            let i;
            for (i = 0; i < n; i++)
                vec.push(Pack.unpackvalue(buf));
            n = buf.getInt() ^ 0x80000000;
            for (i = 0; i < n; i++) {
                let key = Pack.unpackvalue(buf);
                let val = Pack.unpackvalue(buf);
                map.set(key, val);
            }
            if (buf.remaining() !== 0)
                throw new Error("ERROR: buf not end");
        }
        return new SuObject(vec, map);
    }
    private static unpackvalue(buf: ByteBuffer) {
        let n = buf.getInt() ^ 0x80000000;
        let buf2 = buf.slice();
        buf2.limit(n);
        buf.position(buf.position() + n);
        return Pack.unpack(buf2);
    }
    private static unpackRecord(buf: ByteBuffer) {
        return SuRecord.mkRecord(Pack.unpackObject(buf));
    }
    private static unpackDate(buf: ByteBuffer) {
        let date = buf.getInt();
        let time = buf.getInt();
        return new SuDate(date, time);
    }
}
