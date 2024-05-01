
export enum Tag {
    FALSE = 0,
    TRUE,
    MINUS,
    PLUS,
    STRING,
    DATE,
    OBJECT,
    RECORD
}

export const UTF16ToAscii = new Map([
    [8364, 128], [8218, 130], [402, 131], [8222, 132], [8230, 133],
    [8224, 134], [8225, 135], [710, 136], [8240, 137], [352, 138],
    [8249, 139], [338, 140], [381, 142], [8216, 145], [8217, 146],
    [8220, 147], [8221, 148], [8226, 149], [8211, 150], [8212, 151],
    [732, 152], [8482, 153], [353, 154], [8250, 155], [339, 156],
    [382, 158], [376, 159]]);
export const AsciiToUTF16 = new Map([
    [128, 8364], [130, 8218], [131, 402], [132, 8222], [133, 8230],
    [134, 8224], [135, 8225], [136, 710], [137, 8240], [138, 352],
    [139, 8249], [140, 338], [142, 381], [145, 8216], [146, 8217],
    [147, 8220], [148, 8221], [149, 8226], [150, 8211], [151, 8212],
    [152, 732], [153, 8482], [154, 353], [155, 8250], [156, 339],
    [158, 382], [159, 376]]);

export function convert(n: number, xor: number) {
    return ((n ^ xor) << 24) >> 24; // convert Uint8 to int
}

export function varintLen(n: number) {
    if (n === 0) {
        return 1;
    }
    let bits = Math.ceil(Math.log2(n + 1));
    return Math.ceil(bits / 7);
}

export class Encoder {
    public buf: Uint8Array;
    public len: number;

    constructor(private size: number) {
        this.buf = new Uint8Array(this.size);
        this.len = 0;
    }

    put1(b: number): Encoder {
        this.buf[this.len++] = b;
        return this;
    }

    put2(a: number, b: number): Encoder {
        this.buf[this.len++] = a;
        this.buf[this.len++] = b;
        return this;
    }

    put4(a: number, b: number, c: number, d: number): Encoder {
        this.buf[this.len++] = a;
        this.buf[this.len++] = b;
        this.buf[this.len++] = c;
        this.buf[this.len++] = d;
        return this;
    }

    putStr(s: string): Encoder {
        let code: number;
        for (let i = 0; i < s.length; i++) {
            code = s.charCodeAt(i);
            this.buf[this.len++] = UTF16ToAscii.get(code) || code;
        }
        return this;
    }

    uint16(n: number): Encoder {
        return this.put2(n>>8, n);
    }

    uint32(n: number): Encoder {
        return this.put4(n>>24, n>>16, n>>8, n);
    }

    varUint(n: number): Encoder {
        while (n >= 0x80) {
            this.buf[this.len++] = n | 0x80;
            n >>= 7;
        }
        this.buf[this.len++] = n;
        return this;
    }

    // Move moves the last nbytes over by shift bytes
    move(nbytes: number, shift: number): Encoder {
        const start = this.len - nbytes;
        this.buf.copyWithin(start + shift, start, this.len);
        this.len += shift;
        return this;
    }
}

const nestingLimit = 16;
export class PackStack {
    private stack: any[];
    private len = 0;
    constructor() {
        this.stack = new Array(nestingLimit);
    }
    push(x: any) {
        if (this.len >= 16) {
            throw new Error('object nesting overflow');
        }
        for (let i = 0; i < this.len; i++) {
            if (this.stack[i] === x) {
                throw new Error("can't pack object/record containing itself");
            }
        }
        this.stack[this.len++] = x;
    }
    pop() {
        if (this.len <= 0) {
            throw new Error("PackStack underflow");
        }
        --this.len;
    }
}