import { SuIterable } from "../suvalue";
import { maxargs } from "../su";
import { add } from "../ops";
import { cmp } from "../cmp";
import { SuSequence, SequenceBase } from "./susequence";
import { SuObject } from "../suobject";
import * as util from "../utility";

class SuSeq extends SuIterable {
    private infinite: boolean = false;
    private i: any;
    constructor(private from: any, private to: any, private by: any) {
        super();
        if (from === false) {
            this.infinite = true;
            this.from = 0;
            this.to = Number.MAX_SAFE_INTEGER;
        } else if (to === false) {
            this.to = this.from;
            this.from = 0;
        }
        this.i = from;
    }

    public toString(): string {
        return this.infinite
            ? "Seq()"
            : `Seq(${this.from}, ${this.to}, ${this.by})`;
    }

    public Next(): any {
        maxargs(0, arguments.length);
        if (cmp(this.i, this.to) >= 0)
            return this;
        let x = this.i;
        this.i = add(this.i, this.by);
        return x;
    }

    public Dup(): SuIterable {
        maxargs(0, arguments.length);
        return this.infinite
            ? new SuSeq(false, false, this.by)
            : new SuSeq(this.from, this.to, this.by);
    }

    public ['Infinite?'](): boolean {
        maxargs(0, arguments.length);
        return this.infinite;
    }

    public type(): string {
        return 'SeqIter';
    }
}

export function su_seq(from: any = false, to: any = false, by: any = 1) {
    maxargs(3, arguments.length);
    return new SuSequence(new SuSeq(from, to, by));
}

export function su_seqq(x: any): boolean {
    maxargs(1, arguments.length);
    return x instanceof SequenceBase;
}

//BUILTIN Seq(from=false, to=false, by=1)
//GENERATED start
(su_seq as any).$call = su_seq;
(su_seq as any).$callNamed = function ($named: any, from: any, to: any, by: any) {
    maxargs(4, arguments.length);
    ({ from = from, to = to, by = by } = $named);
    return su_seq(from, to, by);
};
(su_seq as any).$callAt = function (args: SuObject) {
    return (su_seq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_seq as any).$params = 'from=false, to=false, by=1';
//GENERATED end

//BUILTIN Seq?(value)
//GENERATED start
(su_seqq as any).$call = su_seqq;
(su_seqq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_seqq(value);
};
(su_seqq as any).$callAt = function (args: SuObject) {
    return (su_seqq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_seqq as any).$params = 'value';
//GENERATED end

//BUILTIN SuSeq.Next()
//GENERATED start
(SuSeq.prototype['Next'] as any).$call = SuSeq.prototype['Next'];
(SuSeq.prototype['Next'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuSeq.prototype['Next'].call(this);
};
(SuSeq.prototype['Next'] as any).$callAt = function (args: SuObject) {
    return (SuSeq.prototype['Next'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuSeq.prototype['Next'] as any).$params = '';
//GENERATED end

//BUILTIN SuSeq.Dup()
//GENERATED start
(SuSeq.prototype['Dup'] as any).$call = SuSeq.prototype['Dup'];
(SuSeq.prototype['Dup'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuSeq.prototype['Dup'].call(this);
};
(SuSeq.prototype['Dup'] as any).$callAt = function (args: SuObject) {
    return (SuSeq.prototype['Dup'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuSeq.prototype['Dup'] as any).$params = '';
//GENERATED end

//BUILTIN SuSeq.Infinite?()
//GENERATED start
(SuSeq.prototype['Infinite?'] as any).$call = SuSeq.prototype['Infinite?'];
(SuSeq.prototype['Infinite?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuSeq.prototype['Infinite?'].call(this);
};
(SuSeq.prototype['Infinite?'] as any).$callAt = function (args: SuObject) {
    return (SuSeq.prototype['Infinite?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuSeq.prototype['Infinite?'] as any).$params = '';
//GENERATED end
