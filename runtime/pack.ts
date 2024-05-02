import { SuNum } from "./sunum";
import { ByteBuffer } from "./bytebuffer";
import { SuRecord } from "./surecord";
import { SuObject } from "./suobject";
import { SuDate } from "./sudate";
import { canonical, isString } from "./ops";
import { SuValue } from "./suvalue";
import { type } from "./type";
import { Tag, AsciiToUTF16, Encoder, convert, fromUtf16ToAscii } from "./packbase";

export class Pack {
    public static convertStringToBuffer(s: string, utf16: boolean = false): ByteBuffer {
        let bufView = new Uint8Array(new ArrayBuffer(s.length));
        let code;
        for (let i = 0; i < s.length; i++) {
            code = s.charCodeAt(i);
            // JavaScript string is UTF-16 encoded.
            // Some characters' codes are different from the original extended ASCII codes.
            // Thus, here we need to map back to ASCII code in order to get the original bytes.
            bufView[i] = (utf16 && fromUtf16ToAscii(code)) || code;
        }
        return new ByteBuffer(bufView);
    }

    private static packedTrue = new Uint8Array([Tag.TRUE]);
    private static packedFalse = new Uint8Array([Tag.FALSE]);

    public static pack(value: any): Uint8Array {
        if (value === true) {
            return Pack.packedTrue;
        }
        if (value === false) {
            return Pack.packedFalse;
        }

        const size = Pack.packSize(value);
        const buf = new Encoder(size);

        if (isString(value)) {
            if (value !== "") {
                buf.put1(Tag.STRING).putStr(value);
            }
        } else if (typeof value === 'number') {
            SuNum.fromNumber(value).pack(buf);
        } else if (value instanceof SuValue) {
            value.pack(buf);
        } else {
            throw new Error("can't pack " + type(value));
        }
        return buf.buf;
    }

    private static packSize(value: any): number {
        if (value === true || value === false) {
            return 1;
        } else if (typeof value === 'number') {
            return SuNum.fromNumber(value).packSize();
        } else if (isString(value)) {
            const len = (value as string).length;
            return len === 0 ? 0 : 1 + len;
        } else if (value instanceof SuValue) {
            return value.packSize();
        }
        throw new Error("can't pack " + type(value));
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

        let sign = buf.get(buf.position() - 1) === Tag.MINUS ? -1 : 1;
        let xor = (sign < 0)  ? -1 : 0;

        // exponent
        let exp = convert(buf.get() ^ 0x80, xor);

        let pos = buf.position();
        let b = convert(buf.get(pos), xor);
        if (b === -1) {
            return sign < 0 ? SuNum.MINUS_INF : SuNum.INF;
        }

        let coef = 0;
        let lo = 0;
        let hi = 0;
        let zeros = 16 - buf.remaining() * 2;
        switch (buf.remaining()) {
            // @ts-ignore allow falls through
            case 8:
                lo += convert(buf.get(pos + 7), xor);
            // @ts-ignore allow falls through
            case 7:
                lo += convert(buf.get(pos + 6), xor) * 100;
            // @ts-ignore allow falls through
            case 6:
                lo += convert(buf.get(pos + 5), xor) * 10000;
            // @ts-ignore allow falls through
            case 5:
                lo += convert(buf.get(pos + 4), xor) * 1000000;
            // @ts-ignore allow falls through
            case 4:
                hi += convert(buf.get(pos + 3), xor);
            // @ts-ignore allow falls through
            case 3:
                hi += convert(buf.get(pos + 2), xor) * 100;
            // @ts-ignore allow falls through
            case 2:
                hi += convert(buf.get(pos + 1), xor) * 10000;
            case 1:
                hi += convert(buf.get(pos + 0), xor) * 1000000;
        }
        if (hi > 90000000) {
            lo = (lo - (lo % 10)) / 10;
            coef = hi * 10000000 + lo;
            ++exp;
            --zeros;
        } else {
            coef = hi * 100000000 + lo;
        }
        while (zeros > 0) {
            coef = coef / 10;
            ++exp;
            --zeros;
        }
        return SuNum.make(sign * coef, exp - 16);
    }

    private static unpackString(buf: ByteBuffer, pos: number, len: number) {
        if (len === 0)
            return "";

        let code;
        let s = "";
        let end = pos + len;
        for (let i = pos; i < end; i++) {
            code = buf.get(i);
            s += String.fromCharCode(AsciiToUTF16.get(code) || code);
        }
        return s;
    }
    private static unpackObject(buf: ByteBuffer) {
        let vec: any[] = [];
        let map: Map<any, any> = new Map();
        if (buf.remaining() !== 0) {
            let n = Pack.uvarint(buf);
            let i;
            for (i = 0; i < n; i++)
                vec.push(Pack.unpackvalue(buf));
            n = Pack.uvarint(buf);
            for (i = 0; i < n; i++) {
                let key = Pack.unpackvalue(buf);
                let val = Pack.unpackvalue(buf);
                map.set(canonical(key), val);
            }
            if (buf.remaining() !== 0)
                throw new Error("ERROR: buf not end");
        }
        return new SuObject(vec, map);
    }
    private static uvarint(buf: ByteBuffer): number {
        let shift = 0;
        let n = 0;
        let b;
        do {
            b = buf.get();
            n |= (b & 0x7f) << shift;
            shift += 7;
        } while (b & 0x80);
        return n;
    }
    private static unpackvalue(buf: ByteBuffer) {
        let n = Pack.uvarint(buf);
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
        let extra = (buf.remaining() === 0) ? 0 : buf.get(); // timestamp
        return new SuDate(date, time, extra);
    }
}
