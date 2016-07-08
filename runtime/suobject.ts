/**
 * Uses a JavaScript array and Map
 * Map does not handle object keys so these are disallowed for now.
 * Dnum keys are converted to JavaScript numbers, hopefully losslessly.
 * Iteration through the map must use forEach until TypeScript has for-of
 * Created by andrew on 2015-05-31.
 */

import * as dnum from "./dnum";
import { Dnum } from "./dnum";
import * as su from "./su";

declare var Map: {
    new <K, V>(): Map<K, V>;
    prototype: Map<any, any>;
};

export interface SuObject {
    readonly: boolean;
    defval: any;
    vec: Array<any>;
    map: Map<any, any>;
    length: number;

    size(): number;
    vecsize(): number;
    mapsize(): number;
    add(value: any): void;
    put(key: any, value: any): void;
    get(key: any): any;
    setReadonly(): void;
    setDefault(value: any): void;
    typeName(): string;
    slice(i, j): SuObject;
    equals(that): boolean;
    toString(): string;
    display(): string;
}

var suob = Object.create(null);
suob.readonly = false;

// length property is used by su.range... to be compatible with string
Object.defineProperty(suob, 'length', {
    get: function() { return this.size(); }
});

export function make(): SuObject {
    var ob = Object.create(suob);
    ob.vec = [];
    ob.map = new Map();
    return ob;
}

export function list(...args): SuObject {
    var ob = make();
    ob.vec = args;
    return ob;
}

export function isSuOb(x: any): boolean {
    return typeof x === 'object' && Object.getPrototypeOf(x) === suob;
}

suob.size = function(): number {
    return this.vec.length + this.map.size;
};

suob.vecsize = function(): number {
    return this.vec.length;
};

suob.mapsize = function(): number {
    return this.map.size;
};

function checkReadonly(ob: SuObject) {
    if (ob.readonly)
        throw "can't modify readonly objects";
}

function mapget(ob: SuObject, key: any) {
    return ob.map.get(canonical(key));
}

function migrate(ob: SuObject): void {
    var x;
    while (undefined != (x = ob.map.get(ob.vec.length))) {
        ob.map.delete(ob.vec.length);
        ob.vec.push(x);
    }
}

suob.add = function(x: any): void {
    checkReadonly(this);
    this.vec.push(x);
    migrate(this);
};

function canonical(key: any): any {
    if (dnum.isDnum(key))
        return (<Dnum>key).toNumber();
    if (typeof key === 'object')
        throw "suneido.js objects do not support object keys";
    return key;
}

function index(key: any): number {
    if (dnum.isDnum(key) && (<Dnum>key).isInt())
        key = (<Dnum>key).toInt();
    return dnum.isInteger(key) ? key : -1;
}

suob.put = function(key: any, value: any): void {
    checkReadonly(this);
    var i = index(key);
    if (0 <= i && i < this.vec.length)
        this.vec[i] = value;
    else if (i === this.vec.length)
        this.add(value);
    else
        this.map.set(key, value);
};

suob.get = function(key: any): any {
    var value = getIfPresent(this, key);
    if (value !== undefined)
        return value;
    //TODO handle SuObject defval
    return this.defval;
};

function getIfPresent(ob: SuObject, key: any): any {
    var i = index(key);
    return (0 <= i && i < ob.vec.length) ? ob.vec[i] : mapget(ob, key);
}

suob.setReadonly = function(): void {
    if (this.readonly)
        return;
    this.readonly = true;
    //TODO recursively set readonly
};

suob.setDefault = function(value: any): void {
    this.defval = value;
};

suob.typeName = function(): string {
    return "Object";
};

suob.slice = function(i, j): SuObject {
    var ob = make();
    ob.vec = this.vec.slice(i, j);
    return ob;
};

suob.equals = function(that): boolean {
    if (!isSuOb(that))
        return false;
    return equals2(this, <SuObject>that, null);
};

function equals2(x, y, stack): boolean {
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

function equals3(x, y, stack): boolean {
    if (x === y)
        return true;
    if (!isSuOb(x))
        return su.is(x, y);
    if (!isSuOb(y))
        return false;
    return equals2(x, y, stack);
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

suob.toString = function(): string {
    return toString2(this, '#(', ')');
};

function toString2(x: SuObject, before: string, after: string) {
    var s = "";
    for (var i = 0; i < x.vec.length; ++i)
        s += x.vec[i] + ', ';
    x.map.forEach(function(v, k) {
        s += keyString(k) + ': ' + su.display(v) + ', ';
    }); //TODO use for-of once available
    return before + s.slice(0, -2) + after;
}

function keyString(x: any): string {
    if (typeof x === 'string' &&
        -1 !== x.search(/^[_a-zA-Z][_a-zA-Z0-9]*[?!]?$/))
        return x;
    return su.display(x);
}

suob.display = suob.toString;

export var empty_object = make();
