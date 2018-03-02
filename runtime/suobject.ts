/**
 * Uses a JavaScript array and Map
 * Map does not handle object keys so these are disallowed for now.
 * SuNum keys are converted to JavaScript numbers, hopefully losslessly.
 */

import { SuNum } from "./sunum";
import { SuValue, SuIterable } from "./suvalue";
import { isBlock } from "./suBoundMethod";
import { display } from "./display";
import { is } from "./is";
import { mandatory, maxargs } from "./args";
import { cmp } from "./cmp";
import * as util from "./utility";

import * as assert from "./assert";

/**
 * constructor for object constants i.e. #(...)
 * named members passed as sequence of key,value
 */
export function mkObject(...args: any[]): SuObject {
    let i = args.indexOf(null);
    if (i === -1)
        return new SuObject(args).Set_readonly();
    let vec = args.slice(0, i);
    let map = new Map<any, any>();
    for (i++; i < args.length; i += 2)
        map.set(args[i], args[i + 1]);
    return new SuObject(vec, map).Set_readonly();
}

export function mkObject2(vec: any[], map?: Map<any, any>): SuObject {
    return new SuObject(vec, map);
}

export class SuObject extends SuValue {
    private readonly: boolean;
    private defval: any;
    public vec: Array<any>;    // public only for readonly access
    public map: Map<any, any>; // public only for readonly access
    static EMPTY = new SuObject().Set_readonly();
    private version = 0;

    /** WARNING: the object will take ownership of the array and map */
    constructor(vec?: any[], map?: Map<any, any>) {
        super();
        this.vec = vec || [];
        assert.that(Array.isArray(this.vec));
        this.map = map || new Map();
        assert.that(this.map instanceof Map);
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
            s += display(x.vec[i]) + ', ';
        for (let [k, v] of x.map)
            s += keyString(k) + ': ' + display(v) + ', ';
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

    Size(list = false, named = false): number {
        maxargs(2, arguments.length);
        if (list === named)
            return this.size();
        else if (list === true)
            return this.vecsize();
        else if (named === true)
            return this.mapsize();
        else
            throw new Error("SuObject.Size bad args");
    }

    private checkReadonly(): void {
        if (this.readonly)
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

    Add(x: any = mandatory()): SuObject {
        maxargs(1, arguments.length);
        this.checkReadonly();
        return this.runWithModificationCheck(() => {
            this.vec.push(x);
            this.migrate();
            return this;
        });
    }

    put(key: any, value: any): SuObject {
        this.checkReadonly();
        return this.runWithModificationCheck(() => {
            let i = index(key);
            if (0 <= i && i < this.vec.length)
                this.vec[i] = value;
            else if (i === this.vec.length)
                this.Add(value);
            else
                this.map.set(key, value);
            return this;
        });
    }

    get(key: any): any {
        return this.getDefault(key, this.defval);
    }

    getDefault(key: any, def: any): any {
        let value = this.getIfPresent(key);
        if (value === undefined)
            return def;
        return value;
    }

    GetDefault(key: any = mandatory(), def: any = mandatory()): any {
        maxargs(2, arguments.length);
        let val = this.getDefault(key, undefined);
        if (val !== undefined)
            return val;
        if (isBlock(def))
            return def.$call();
        return def;
    }

    getIfPresent(key: any): any {
        let i = index(key);
        return (0 <= i && i < this.vec.length) ? this.vec[i] : this.mapget(key);
    }

    Find(value: any = mandatory()): any {
        maxargs(1, arguments.length);
        for (let i = 0; i < this.vec.length; i++)
            if (is(this.vec[i], value))
                return i;
        for (let [k, v] of this.map)
            if (is(v, value))
                return k;
        return false;
    }

    ['Member?'](key: any = mandatory()): boolean {
        maxargs(1, arguments.length);
        let i = index(key);
        return (0 <= i && i < this.vec.length) || this.map.has(key);
    }

    //NOTE: not lazy
    Members(list = false, named = false): SuObject {
        maxargs(2, arguments.length);
        if (list === false && named === false)
            list = named = true;
        let ms: any[] = [];
        if (list === true)
            ms.push(...this.vec.keys());
        if (named === true)
            ms.push(...this.map.keys());
        return new SuObject(ms);
    }

    Delete(args: SuObject): SuObject {
        this.checkReadonly();
        if (args.getDefault('all', false) === true)
            this.clear();
        else
            for (let x of args.vec)
                this.erase(x);
        return this;
    }

    clear(): void {
        return this.runWithModificationCheck(() => {
            this.vec = [];
            this.map = new Map();
        });
    }

    erase(key: any): void {
        return this.runWithModificationCheck(() => {
            let i = index(key);
            if (0 <= i && i < this.vec.length)
                this.vec.splice(i, 1);
            else
                this.map.delete(key);
        });
    }

    Set_readonly(): SuObject {
        maxargs(0, arguments.length);
        if (this.readonly)
            return this;
        this.readonly = true;
        //TODO recursively set readonly
        return this;
    }

    Set_default(value: any = null): SuObject {
        maxargs(1, arguments.length);
        this.defval = value;
        return this;
    }

    type(): string {
        return "Object";
    }

    Copy(): SuObject {
        maxargs(0, arguments.length);
        let copy = new SuObject(this.vec.slice(), new Map(this.map));
        copy.defval = this.defval;
        return copy;
    }

    Slice(i: number = mandatory(), n: number = this.vecsize()): SuObject {
        maxargs(2, arguments.length);
        return this.slice(i, n < 0 ? n : i + n);
    }

    // used by su ranges, must match string.slice
    slice(i: number, j: number): SuObject {
        return new SuObject(this.vec.slice(i, j));
    }

    toString(): string {
        return SuObject.toString2(this, '#(', ')');
    }

    display(): string {
        return this.toString();
    }

    ['Sort!'](lt?: Lt): SuObject {
        this.checkReadonly();
        let c = lt ? lt_to_cmp(lt) : cmp;
        this.vec.sort(c);
        return this;
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
    private static equals3(x: any, y: any, stack: PairStack): boolean {
        if (x === y)
            return true;
        if (!(x instanceof SuObject))
            return is(x, y);
        if (!(y instanceof SuObject))
            return false;
        return SuObject.equals2(x, y, stack);
    }

    /** Only compares vector, ignores map */
    compareTo(that: any): number {
        if (this === that)
            return 0;
        return this.compare2(that, new PairStack());
    }
    private compare2(that: SuObject, stack: PairStack): number {
        if (stack.contains(this, that))
            return 0; // comparison is already in progress
        stack.push(this, that);
        let ord: number;
        for (let i = 0; i < this.vec.length && i < that.vec.length; ++i)
            if (0 !== (ord = SuObject.compare3(this.vec[i], that.vec[i], stack)))
                return ord;
        return util.cmp(this.vec.length, that.vec.length);
    }
    private static compare3(x: any, y: any, stack: PairStack): number {
        if (x === y)
            return 0;
        else if (x instanceof SuObject && y instanceof SuObject)
            return x.compare2(y, stack);
        else
            return cmp(x, y);
    }

    Iter(): ObjectIter {
        maxargs(0, arguments.length);
        return new ObjectIter(this, Values.ITER_VALUES);
    }

    *begin(includeVec: boolean, includeMap: boolean): IterableIterator<any[]> {
        let oriVersion = this.version;
        function checkForModification(curVersion: number) {
            if (oriVersion !== curVersion)
                throw "object modified during iteration";
        }
        if (includeVec)
            for (let i = 0; i < this.vec.length; i++) {
                yield [i, this.vec[i]];
                checkForModification(this.version);
            }
        if (includeMap)
            for (let pair of this.map.entries()) {
                yield pair;
                checkForModification(this.version);
            }
    }

    private runWithModificationCheck<T>(fn: () => T): T {
        let vecSize = this.vecsize();
        let mapSize = this.mapsize();
        let res = fn();
        if (vecSize !== this.vecsize() || mapSize !== this.mapsize())
            this.version++;
        return res;
    }

    Join(separator: string = ''): string {
        maxargs(1, arguments.length);
        return this.vec.join(separator);
    }
} // end of SuObject class

export enum Values { ITER_KEYS, ITER_VALUES, ITER_ASSOCS } // export for testing
export class ObjectIter extends SuIterable {
    private iter: IterableIterator<any[]>;
    constructor(private ob: SuObject, private values: Values,
        private iv: boolean = true, private im: boolean = true) {
        super();
        this.iter = this.ob.begin(iv, im);
    }
    type(): string {
        return 'ObjectIter';
    }
    toString(): string {
        return 'aObjectIter';
    }
    Next(): any {
        maxargs(0, arguments.length);
        let next = this.iter.next();
        if (next.done)
            return this;
        switch (this.values) {
        case Values.ITER_KEYS:
            return next.value[0];
        case Values.ITER_VALUES:
            return next.value[1];
        case Values.ITER_ASSOCS:
            return SuObject.list(...next.value);
        }
    }
    Dup(): ObjectIter {
        maxargs(0, arguments.length);
        return new ObjectIter(this.ob, this.values, this.iv, this.im);
    }
    ['Infinite?'](): boolean {
        maxargs(0, arguments.length);
        return false;
    }
}

type Lt = (x: any, y: any) => boolean;
type Cmp = (x: any, y: any) => -1|0|1;

function lt_to_cmp(lt: Lt): Cmp {
    return (x: any, y: any) => {
        if (lt(x, y))
            return -1;
        else if (lt(y, x))
            return 1;
        else
            return 0;
    };
}

function canonical(key: any): any {
    if (key instanceof SuNum)
        return key.toNumber();
    if (typeof key === 'object')
        throw "suneido.js objects do not support object keys";
    return key;
}

function index(key: any): number {
    if (key instanceof SuNum && key.isInt())
        key = key.toInt();
    return Number.isSafeInteger(key) ? key : -1;
}

function keyString(x: any): string {
    if (typeof x === 'string' &&
        /^[_a-zA-Z][_a-zA-Z0-9]*[?!]?$/.test(x))
        return x;
    return display(x);
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
