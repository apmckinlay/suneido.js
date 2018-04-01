/**
 * Uses a JavaScript array and Map
 * Map does not handle object keys so these are disallowed for now.
 * SuNum keys are converted to JavaScript numbers, hopefully losslessly.
 */

import { SuNum } from "./sunum";
import { SuValue, SuIterable, SuCallable } from "./suvalue";
import { isBlock, SuBoundMethod } from "./suBoundMethod";
import { display } from "./display";
import { is, toBoolean, isNumber, toInt,
    canonical, getKeyFromCanonical } from "./ops";
import { mandatory, maxargs } from "./args";
import { cmp } from "./cmp";
import { globalLookup, global } from "./global";
import * as util from "./utility";

import * as assert from "./assert";

export class SuObject extends SuValue {
    private readonly: boolean;
    protected defval: any;
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
           throw new Error("can't modify readonly objects");
    }

    private mapset(key: any, value: any): void {
        this.map.set(canonical(key), value);
    }

    private mapget(key: any): any {
        return this.map.get(canonical(key));
    }

    private maphas(key: any): boolean {
        return this.map.has(canonical(key));
    }

    private mapdelete(key: any): boolean {
        return this.map.delete(canonical(key));
    }

    private migrate(): void {
        let x: any;
        while (undefined !== (x = this.map.get(this.vec.length))) {
            this.map.delete(this.vec.length);
            this.vec.push(x);
        }
    }

    Add(args: SuObject): SuObject {
        this.checkReadonly();
        let numValuesToAdd = args.vecsize();
        let atArg = args.getDefault('at', null);
        let invalidUsage = atArg === null
            ? args.mapsize() > 0
            : args.mapsize() > 1;
        if (invalidUsage === true)
            throw new Error("usage: object.Add(value, ... [ at: position ])");

        if (numValuesToAdd === 0)
            return this;

        if (atArg === null)
            this.addAt(this.vec.length, args.vec);
        else if (isNumber(atArg))
            this.addAt(toInt(atArg), args.vec);
        else if (numValuesToAdd === 1)
            this.put(atArg, args.vec[0]);
        else
            throw new Error("can only Add multiple values to un-named "
                + "or to numeric positions");
        return this;
    }

    private addAt(at: number, values: any[]) {
        for (let i = 0; i < values.length; i++)
            this.insert(at + i, values[i]);
    }

    add(x: any): SuObject {
        this.checkReadonly();
        return this.runWithModificationCheck(() => {
            this.vec.push(x);
            this.migrate();
            return this;
        });
    }

    insert(at: number, value: any): SuObject {
        this.checkReadonly();
        if (0 <= at && at <= this.vec.length) {
            this.runWithModificationCheck(() => {
                this.vec.splice(at, 0, value);
                this.migrate();
            });
        } else
            this.preset(at, value);
        return this;
    }

    put(key: any, value: any): SuObject {
        return this.preset(key, value);
    }

    preset(key: any, value: any): SuObject {
        this.checkReadonly();
        return this.runWithModificationCheck(() => {
            let i = index(key);
            if (0 <= i && i < this.vec.length)
                this.vec[i] = value;
            else if (i === this.vec.length)
                this.add(value);
            else
                this.mapset(key, value);
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
                return getKeyFromCanonical(k);
        return false;
    }

    ['Member?'](key: any = mandatory()): boolean {
        maxargs(1, arguments.length);
        let i = index(key);
        return (0 <= i && i < this.vec.length) || this.maphas(key);
    }

    Delete(args: SuObject): SuObject {
        this.checkReadonly();
        if (args.getDefault('all', false) === true)
            this.clear();
        else
            for (let x of args.vec)
                this.delete(x);
        return this;
    }

    clear(): void {
        return this.runWithModificationCheck(() => {
            this.vec = [];
            this.map = new Map();
        });
    }

    delete(key: any): boolean {
        return this.runWithModificationCheck(() => {
            let i = index(key);
            if (0 <= i && i < this.vec.length) {
                this.vec.splice(i, 1);
                return true;
            } else
                return this.mapdelete(key);
        });
    }

    Erase(args: SuObject): SuObject {
        this.checkReadonly();
        for (let x of args.vec)
            this.erase(x);
        return this;
    }

    erase(key: any): boolean {
        return this.runWithModificationCheck(() => {
            let i = index(key);
            if (0 <= i && i < this.vec.length) {
                for (let j = this.vec.length - 1; j > i; j--)
                    this.map.set(j, this.vec[j]);
                this.vec.splice(i);
                return true;
            } else
                return this.mapdelete(key);
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

    ['Readonly?'](): boolean {
        return this.readonly;
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

    Values(_list: any = false, _named: any = false): SuObject {
        maxargs(2, arguments.length);
        let list = toBoolean(_list);
        let named = toBoolean(_named);
        if (list === false && named === false)
            list = named = true;
        return global("Sequence")(
            new ObjectIter(this.toObject(), Values.ITER_VALUES, list, named));
    }

    Assocs(_list: any = false, _named: any = false): SuObject {
        maxargs(2, arguments.length);
        let list = toBoolean(_list);
        let named = toBoolean(_named);
        if (list === false && named === false)
            list = named = true;
        return global("Sequence")(
            new ObjectIter(this.toObject(), Values.ITER_ASSOCS, list, named));
    }

    Members(_list: any = false, _named: any = false): SuObject {
        maxargs(2, arguments.length);
        let list = toBoolean(_list);
        let named = toBoolean(_named);
        if (list === false && named === false)
            list = named = true;
        return global("Sequence")(
            new ObjectIter(this.toObject(), Values.ITER_KEYS, list, named));
    }

    ['Unique!'](): SuObject {
        maxargs(0, arguments.length);
        this.checkReadonly();
        this.runWithModificationCheck(() => {
            let dst = 1;
            for (let src = 1; src < this.vec.length; ++src) {
                if (is(this.vec[src], this.vec[src - 1]))
                    continue;
                if (dst < src)
                    this.vec[dst] = this.vec[src];
                ++dst;
            }
            this.vec.splice(dst);
        });
        return this;
    }

    ['Reverse!'](): SuObject {
        maxargs(0, arguments.length);
        this.checkReadonly();
        this.runWithModificationCheck(() => {
            this.vec.reverse();
        });
        return this;
    }

    Eval(args: SuObject): any {
        return SuObject.evaluate(this, args);
    }

    Eval2(args: SuObject): SuObject {
        let value = SuObject.evaluate(this, args);
        let result = new SuObject();
        if (value != null)
            result.add(value);
        return result;
    }

    private static evaluate(self: SuObject, args: SuObject) {
        if (args.size() === 0)
            throw new Error("usage: object.Eval(callable [, args...]");
        if (! args.vec[0] || ! args.vec[0].$callAt ||
            typeof args.vec[0].$callAt !== 'function')
            throw new Error("usage: object.Eval requires callable");
        let fn = args.vec[0] instanceof SuBoundMethod
            ? args.vec[0].method.$callAt
            : args.vec[0].$callAt;
        args.delete(0);
        return fn.call(self, args);
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

    LowerBound(value: any = mandatory(), lt?: Lt): number {
        maxargs(2, arguments.length);
        let c = lt ? lt_to_cmp(lt) : cmp;
        return util.lowerBound(this.vec, value, c);
    }

    UpperBound(value: any = mandatory(), lt?: Lt): number {
        maxargs(2, arguments.length);
        let c = lt ? lt_to_cmp(lt) : cmp;
        return util.upperBound(this.vec, value, c);
    }

    EqualRange(value: any = mandatory(), lt?: Lt): SuObject {
        maxargs(2, arguments.length);
        let c = lt ? lt_to_cmp(lt) : cmp;
        return new SuObject(util.equalRange(this.vec, value, c));
    }

    equals(that: any): boolean {
        if (!(that instanceof SuObject))
            return false;
        if (this === that)
            return true;
        return SuObject.equals2(this, that.toObject(), new PairStack());
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
        return SuObject.equals2(x.toObject(), y.toObject(), stack);
    }

    /** Only compares vector, ignores map */
    compareTo(that: SuObject): util.Cmp {
        if (this === that)
            return 0;
        return this.compare2(that.toObject(), new PairStack());
    }
    private compare2(that: SuObject, stack: PairStack): util.Cmp {
        if (stack.contains(this, that))
            return 0; // comparison is already in progress
        stack.push(this, that);
        let ord: util.Cmp;
        for (let i = 0; i < this.vec.length && i < that.vec.length; ++i)
            if (0 !== (ord = SuObject.compare3(this.vec[i], that.vec[i], stack)))
                return ord;
        return util.cmp(this.vec.length, that.vec.length);
    }
    private static compare3(x: any, y: any, stack: PairStack): util.Cmp {
        if (x === y)
            return 0;
        else if (x instanceof SuObject && y instanceof SuObject)
            return x.compare2(y.toObject(), stack);
        else
            return cmp(x, y);
    }

    Iter(): SuIterable {
        maxargs(0, arguments.length);
        return new ObjectIter(this, Values.ITER_VALUES);
    }

    *begin(includeVec: boolean, includeMap: boolean): IterableIterator<any[]> {
        let oriVersion = this.version;
        function checkForModification(curVersion: number) {
            if (oriVersion !== curVersion)
               throw new Error("object modified during iteration");
        }
        if (includeVec)
            for (let i = 0; i < this.vec.length; i++) {
                yield [i, this.vec[i]];
                checkForModification(this.version);
            }
        if (includeMap)
            for (let pair of this.map.entries()) {
                pair[0] = getKeyFromCanonical(pair[0]);
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

    lookup(this: any, method: string): SuCallable {
        return this[method] || globalLookup('Objects', method);
    }

    toObject(): SuObject {
        return this;
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

type Lt = {$call: (x: any, y: any) => boolean};
type Cmp = (x: any, y: any) => util.Cmp;

function lt_to_cmp(lt: Lt): Cmp {
    return (x: any, y: any) => {
        if (lt.$call(x, y))
            return -1;
        else if (lt.$call(y, x))
            return 1;
        else
            return 0;
    };
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
