/**
 * Uses a JavaScript array and Map
 * Map does not handle object keys so these are disallowed for now.
 * Dnum keys are converted to JavaScript numbers, hopefully losslessly.
 * Iteration through the map must use forEach until TypeScript has for-of
 * Created by andrew on 2015-05-31.
 */

import Dnum from "./dnum";
import * as su from "./su";

declare var Map: {
    new <K, V>(): Map<K, V>;
    prototype: Map<any, any>;
};

export default class SuObject {
    private readonly: boolean;
    private defval: any;
    private vec: Array<any>;
    private map: Map<any, any>;

    constructor(readonly = false) {
        this.readonly = readonly;
        this.vec = [];
        this.map = new Map();
    }

    // length property is used by su.range... to be compatible with string
    get length(): number {
        return this.size();
    }

    static list(...args: any[]): SuObject {
        var ob = new SuObject();
        ob.vec = args;
        return ob;
    }

    static isSuOb(x: any): boolean {
        return typeof x === 'object' && x instanceof SuObject;
    }

    static toString2(x: SuObject, before: string, after: string) {
        var s = "";
        for (var i = 0; i < x.vec.length; ++i)
            s += x.vec[i] + ', ';
        x.map.forEach(function(v, k) {
            s += keyString(k) + ': ' + su.display(v) + ', ';
        }); //TODO use for-of once available
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
        var x: any;
        while (undefined != (x = this.map.get(this.vec.length))) {
            this.map.delete(this.vec.length);
            this.vec.push(x);
        }
    }

    add(x: any): void {
        this.checkReadonly(this);
        this.vec.push(x);
        this.migrate();
    }

    put(key: any, value: any): void {
        this.checkReadonly(this);
        var i = index(key);
        if (0 <= i && i < this.vec.length)
            this.vec[i] = value;
        else if (i === this.vec.length)
            this.add(value);
        else
            this.map.set(key, value);
    }

    get(key: any): any {
        var value = this.getIfPresent(this, key);
        if (value !== undefined)
            return value;
        //TODO handle SuObject defval
        return this.defval;
    }

    getIfPresent(ob: SuObject, key: any): any {
        var i = index(key);
        return (0 <= i && i < ob.vec.length) ? ob.vec[i] : this.mapget(key);
    }

    setReadonly(): void {
        if (this.readonly)
            return;
        this.readonly = true;
        //TODO recursively set readonly
    }

    setDefault(value: any): void {
        this.defval = value;
    }

    typeName(): string {
        return "Object";
    }

    slice(i: number, j: number): SuObject {
        var ob = new SuObject();
        ob.vec = this.vec.slice(i, j);
        return ob;
    }

    equals(that: any): boolean {
        if (!SuObject.isSuOb(that))
            return false;
        return SuObject.equals2(this, <SuObject>that, null);
    }

    toString(): string {
        return SuObject.toString2(this, '#(', ')');
    }

    display(): string {
        return this.toString();
    }
    static equals2(x: SuObject, y: SuObject, stack?: PairStack): boolean {
        if (x.vec.length != y.vec.length || x.map.size != y.map.size)
            return false;
        if (stack == undefined)
            stack = new PairStack();
        else if (stack.contains(x, y))
            return true; // comparison is already in progress
        stack.push(x, y);
        try {
            for (var i = 0; i < x.vec.length; ++i)
                if (!equals3(x.vec[i], y.vec[i], stack))
                    return false;
            var eq = true;
            x.map.forEach(function(v, k) {
                if (!equals3(v, y.map.get(k), stack))
                    eq = false;
            }); //TODO use for-of once available
            return eq;
        } finally {
            stack.pop();
        }
    }
} // end of SuObject class

function canonical(key: any): any {
    if (key instanceof Dnum)
        return (<Dnum>key).toNumber();
    if (typeof key === 'object')
        throw "suneido.js objects do not support object keys";
    return key;
}

function index(key: any): number {
    if (key instanceof Dnum && (<Dnum>key).isInt())
        key = (<Dnum>key).toInt();
    return Number.isSafeInteger(key) ? key : -1;
}

function equals3(x: any, y: any, stack?: PairStack): boolean {
    if (x === y)
        return true;
    if (!SuObject.isSuOb(x))
        return su.is(x, y);
    if (!SuObject.isSuOb(y))
        return false;
    return SuObject.equals2(x, y, stack);
}

function keyString(x: any): string {
    if (typeof x === 'string' &&
        -1 !== x.search(/^[_a-zA-Z][_a-zA-Z0-9]*[?!]?$/))
        return x;
    return su.display(x);
}


class PairStack {
    public stack: Array<any>;
    constructor() {
        this.stack = []
    }
    public push(x: any, y: any): void {
        this.stack.push(x);
        this.stack.push(y);
    }
    public contains(x: any, y: any): boolean {
        for (var i = 0; i < this.stack.length; i += 2)
            if (this.stack[i] === x && this.stack[i + 1] == y)
                return true;
        return false;
    }
    public pop(): void {
        this.stack.pop();
        this.stack.pop();
    }
}
