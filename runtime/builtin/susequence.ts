import { SuObject } from "../suobject";
import { SuValue, SuIterable, SuCallable } from "../suvalue";
import { maxargs, mandatory } from "../args";
import { display } from "../display";
import { toStr, toBoolean, isString } from "../ops";
import { type } from "../type";
import { globalLookup } from "../global";
import * as util from "../utility";

export abstract class SequenceBase extends SuObject {
    protected instantiated: boolean = false;
    protected duped: boolean = false;

    protected abstract instantiate(): void;
    protected abstract copy(): SuValue;
    protected abstract iter(): SuIterable;
    protected abstract infinite(): boolean;

    public lookup(method: string): SuCallable {
        let x;
        if (this.override(method) &&
            (x = (SequenceBase.SequenceMethods.prototype as any)[method]
                || globalLookup('Sequences', method)))
            return x;
        else {
            this.ck_instantiate();
            return super.lookup(method);
        }
    }

    private override(method: String): boolean {
        return method === "Instantiated?" ||
            (! this.instantiated && ! this.duped);
    }

    public static SequenceMethods = class {
        public Iter(this: SequenceBase): SuIterable {
            maxargs(0, arguments.length);
            return this.iter();
        }

        public ["Instantiated?"](this: SequenceBase): boolean {
            maxargs(0, arguments.length);
            return this.instantiated;
        }

        public Copy(this: SequenceBase): any {
            maxargs(0, arguments.length);
            if (this.instantiated)
                return new SuObject(this.vec, this.map);
            if (this.infinite())
                throw new Error("can't instantiate infinite sequence");
            return this.copy();
        }

        public Join(this: SequenceBase, sepArg: any = ''): string {
            maxargs(1, arguments.length);
            let sep = toStr(sepArg);
            let s = "";
            let iter: SuIterable = this.invoke(this, 'Iter');
            let next;
            while (iter !== (next = this.invoke(iter, "Next"))) {
                if (isString(next))
                    s += next;
                else
                    s += display(next);
                s += sep;
            }
            if (s.length > 0)
                s = s.substr(0, s.length - sep.length);
            return s;
        }
    };

    protected ck_instantiate(): void {
        if (this.instantiated)
            return;
        if (this.infinite())
            throw new Error("can't instantiate infinite sequence");
        this.instantiate();
        this.instantiated = true;
    }

    protected invoke(ob: SuValue, method: string) {
        let f = ob.lookup(method);
        if (f) {
            let call = f.$call;
            if (typeof call === 'function')
                return call.apply(ob);
        }
        throw new Error("method not found: " + type(ob) + "." + method);
    }

    public equals(that: any): boolean {
        this.ck_instantiate();
        return super.equals(that);
    }

    public toString(): string {
        this.ck_instantiate();
        return super.toString();
    }

    public get(key: any): any {
        this.ck_instantiate();
        return super.get(key);
    }

    public type(): string {
        return "Object";
    }

    public toObject(): SuObject {
        this.ck_instantiate();
        return this;
    }

    public compareTo(that: SuObject) {
        this.ck_instantiate();
        return super.compareTo(that);
    }
}

const SequenceMethods = SequenceBase.SequenceMethods;

export function su_sequence(iterator: SuIterable = mandatory()): SuSequence {
    return new SuSequence(iterator);
}

export class SuSequence extends SequenceBase {
    constructor(private iterator: SuIterable) {
        super();
    }

    protected iter(): SuIterable {
        this.duped = true;
        return this.invoke(this.iterator, "Dup");
    }

    protected copy(): SuValue {
        let iter = this.iter();
        let ob = new SuObject();
        let x;
        while (iter !== (x = this.invoke(iter, "Next")))
            ob.add(x);
        return ob;
    }

    protected instantiate(): void {
        let iter = this.iter();
        let x;
        while (iter !== (x = this.invoke(iter, "Next")))
            this.add(x);
    }

    protected infinite(): boolean {
        try {
            return toBoolean(this.invoke(this.iterator, "Infinite?"));
        } catch (e) {
            return false;
        }
    }

    public toString(): string {
        if (this.infinite())
            return "infiniteSequence";
        return super.toString();
    }
}

//BUILTIN SequenceMethods.Iter()
//GENERATED start
(SequenceMethods.prototype['Iter'] as any).$call = SequenceMethods.prototype['Iter'];
(SequenceMethods.prototype['Iter'] as any).$callNamed = function (_named: any) {
    return SequenceMethods.prototype['Iter'].call(this);
};
(SequenceMethods.prototype['Iter'] as any).$callAt = function (args: SuObject) {
    return (SequenceMethods.prototype['Iter'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SequenceMethods.prototype['Iter'] as any).$params = '';
//GENERATED end

//BUILTIN SequenceMethods.Instantiated?()
//GENERATED start
(SequenceMethods.prototype['Instantiated?'] as any).$call = SequenceMethods.prototype['Instantiated?'];
(SequenceMethods.prototype['Instantiated?'] as any).$callNamed = function (_named: any) {
    return SequenceMethods.prototype['Instantiated?'].call(this);
};
(SequenceMethods.prototype['Instantiated?'] as any).$callAt = function (args: SuObject) {
    return (SequenceMethods.prototype['Instantiated?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SequenceMethods.prototype['Instantiated?'] as any).$params = '';
//GENERATED end

//BUILTIN SequenceMethods.Copy()
//GENERATED start
(SequenceMethods.prototype['Copy'] as any).$call = SequenceMethods.prototype['Copy'];
(SequenceMethods.prototype['Copy'] as any).$callNamed = function (_named: any) {
    return SequenceMethods.prototype['Copy'].call(this);
};
(SequenceMethods.prototype['Copy'] as any).$callAt = function (args: SuObject) {
    return (SequenceMethods.prototype['Copy'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SequenceMethods.prototype['Copy'] as any).$params = '';
//GENERATED end

//BUILTIN SequenceMethods.Join(sep="")
//GENERATED start
(SequenceMethods.prototype['Join'] as any).$call = SequenceMethods.prototype['Join'];
(SequenceMethods.prototype['Join'] as any).$callNamed = function ($named: any, sep: any) {
    ({ sep = sep } = $named);
    return SequenceMethods.prototype['Join'].call(this, sep);
};
(SequenceMethods.prototype['Join'] as any).$callAt = function (args: SuObject) {
    return (SequenceMethods.prototype['Join'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SequenceMethods.prototype['Join'] as any).$params = 'sep=""';
//GENERATED end

//BUILTIN Sequence(iterator)
//GENERATED start
(su_sequence as any).$call = su_sequence;
(su_sequence as any).$callNamed = function ($named: any, iterator: any) {
    ({ iterator = iterator } = $named);
    return su_sequence(iterator);
};
(su_sequence as any).$callAt = function (args: SuObject) {
    return (su_sequence as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_sequence as any).$params = 'iterator';
//GENERATED end
