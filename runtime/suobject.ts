/**
 * Uses a JavaScript array and Map
 * Map does not handle object keys so these are disallowed for now.
 * Dnum keys are converted to JavaScript numbers, hopefully losslessly.
 */

import { Dnum } from "./dnum";
import * as su from "./su";
import { SuValue } from "./suvalue";

export class SuObject extends SuValue {
    private readonly: boolean;
    private defval: any;
    private vec: Array<any>;
    private map: Map<any, any>;
    static EMPTY = new SuObject().setReadonly();

    /** WARNING: the object will take ownership of the array and map */
    constructor(vec?: any[], map?: Map<any, any>) {
        super();
        this.vec = vec || [];
        this.map = map || new Map();
        this.readonly = false;
    }

    // length property is used by su.range... to be compatible with string
    get length(): number {
        return this.size();
    }

    static list(...args: any[]): SuObject {
        return new SuObject(args);
    }

    static toString2(x: SuObject, before: string, after: string) {
        let s = "";
        for (let i = 0; i < x.vec.length; ++i)
            s += x.vec[i] + ', ';
        for (let [k, v] of x.map)
            s += keyString(k) + ': ' + su.display(v) + ', ';
        return before + s.slice(0, -2) + after;
    }

    size(): number {
        return this.vec.length + this.map.size;
    }

    vecsize(): number {
        return this.vec.length;
    }

    mapsize(): number {
        return this.map.size;
    }

    private checkReadonly(ob: SuObject): void {
        if (ob.readonly)
            throw "can't modify readonly objects";
    }

    private mapget(key: any): any {
        return this.map.get(canonical(key));
    }

    private migrate(): void {
        let x: any;
        while (undefined !== (x = this.map.get(this.vec.length))) {
            this.map.delete(this.vec.length);
            this.vec.push(x);
        }
    }

    add(x: any): SuObject {
        this.checkReadonly(this);
        this.vec.push(x);
        this.migrate();
        return this;
    }

    put(key: any, value: any): SuObject {
        this.checkReadonly(this);
        let i = index(key);
        if (0 <= i && i < this.vec.length)
            this.vec[i] = value;
        else if (i === this.vec.length)
            this.add(value);
        else
            this.map.set(key, value);
        return this;
    }

    get(key: any): any {
        let value = this.getIfPresent(this, key);
        if (value !== undefined)
            return value;
        //TODO handle SuObject defval
        return this.defval;
    }

    getIfPresent(ob: SuObject, key: any): any {
        let i = index(key);
        return (0 <= i && i < ob.vec.length) ? ob.vec[i] : this.mapget(key);
    }

    setReadonly(): SuObject {
        if (this.readonly)
            return this;
        this.readonly = true;
        //TODO recursively set readonly
        return this;
    }

    setDefault(value: any): SuObject {
        this.defval = value;
        return this;
    }

    typeName(): string {
        return "Object";
    }

    slice(i: number, j: number): SuObject {
        return new SuObject(this.vec.slice(i, j));
    }

    toString(): string {
        return SuObject.toString2(this, '#(', ')');
    }

    display(): string {
        return this.toString();
    }

    equals(that: any): boolean {
        if (!(that instanceof SuObject))
            return false;
        return SuObject.equals2(this, that, new PairStack());
    }
    private static equals2(x: SuObject, y: SuObject, stack: PairStack): boolean {
        if (x.vec.length !== y.vec.length || x.map.size !== y.map.size)
            return false;
        if (stack.contains(x, y))
            return true; // comparison is already in progress
        stack.push(x, y);
        try {
            for (let i = 0; i < x.vec.length; ++i)
                if (!SuObject.equals3(x.vec[i], y.vec[i], stack))
                    return false;
            for (let [k, v] of x.map)
                if (!SuObject.equals3(v, y.map.get(k), stack))
                    return false;
            return true;
        } finally {
            stack.pop();
        }
    }
    private static equals3(x: any, y: any, stack?: PairStack): boolean {
        if (x === y)
            return true;
        if (!(x instanceof SuObject))
            return su.is(x, y);
        if (!(y instanceof SuObject))
            return false;
        return SuObject.equals2(x, y, stack);
    }

} // end of SuObject class

function canonical(key: any): any {
    if (key instanceof Dnum)
        return key.toNumber();
    if (typeof key === 'object')
        throw "suneido.js objects do not support object keys";
    return key;
}

function index(key: any): number {
    if (key instanceof Dnum && key.isInt())
        key = key.toInt();
    return Number.isSafeInteger(key) ? key : -1;
}

function keyString(x: any): string {
    if (typeof x === 'string' &&
        /^[_a-zA-Z][_a-zA-Z0-9]*[?!]?$/.test(x))
        return x;
    return su.display(x);
}

class PairStack {
    public stack: Array<any>;
    constructor() {
        this.stack = [];
    }
    public push(x: any, y: any): void {
        this.stack.push(x);
        this.stack.push(y);
    }
    public contains(x: any, y: any): boolean {
        for (let i = 0; i < this.stack.length; i += 2)
            if (this.stack[i] === x && this.stack[i + 1] === y)
                return true;
        return false;
    }
    public pop(): void {
        this.stack.pop();
        this.stack.pop();
    }
}
