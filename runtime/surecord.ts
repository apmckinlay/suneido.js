import { SuObject } from "./suobject";
import { SuBoundMethod, SuCallable } from "./suBoundMethod";
import { mandatory, maxargs } from "./args";
import { cmp } from "./cmp";
import * as ops from "./ops";
import { tryGlobal } from "./global";
import * as assert from "./assert";

export enum Status {
    NEW,
    OLD,
    DELETED
}

// This is a partial implementation
// Functionalities related to DB are not implemented
export class SuRecord extends SuObject {
    private observers: any[] = [];
    private invalid: Set<any> = new Set();
    private activeRules: string[] = [];
    private invalidated: Set<any> = new Set();
    private attachedRules: Map<any, any> = new Map();

    constructor(private hdr: any, private tran: any,
        private recadr: number, private status: Status,
        private dependencies: MultiMap,
        vec?: any[], map?: Map<any, any>) {
        super(vec, map);
        this.defval = ""

        /* Added to avoid typescript "declared but its value is never read" errors */
        this.hdr;
        this.tran;
        this.recadr;
        this.addField;
    }

    static mkRecord(o: SuObject): SuRecord {
        return new SuRecord(null, null, 0, Status.NEW, new MultiMap(),
            o.vec, o.map);
    }

    static mkRecord1(): SuRecord {
        return new SuRecord(null, null, 0, Status.NEW, new MultiMap());
    }

    public Clear(): void {
        maxargs(0, arguments.length);
        super.clear();
        this.hdr = null;
        this.tran = null;
        this.recadr = 0;
        this.status = Status.NEW;
    }

    public Copy(): SuRecord {
        maxargs(0, arguments.length);
        return new SuRecord(null, null, 0, this.status,
            new MultiMap(this.dependencies), this.vec.slice(), new Map(this.map));
    }

    private addField(field: string, value: any): void {
        if (field === "-")
            return;
        if (field.endsWith("_deps"))
            this.addDependencies(SuRecord.baseFieldName(field), value as string);
        else
            super.put(field, value);
    }

    private static baseFieldName(field: string): string {
        return field.substring(0, field.length - 5);
    }

    private addDependencies(mem: string, s: string): void {
        s.split(',').forEach(t => this.addDependency(mem, t));
    }

    private addDependency(src: any, dst: any): void {
        this.dependencies.put(dst, src);
    }

    public toString(): string {
        maxargs(0, arguments.length);
        return SuObject.toString2(this, "[", "]");
    }

    public put(key: any, value: any): SuRecord {
        this.invalid.delete(key);
        let old = super["Member?"](key) ? super.get(key) : null;
        super.put(key, value);
        if (old === null || cmp(old, value) !== 0) {
            this.invalidateDependents(key);
            this.callObservers(key);
        }
        return this;
    }

    public PreSet(key: any = mandatory(), value: any = mandatory()): void {
        maxargs(2, arguments.length);
        this.preset(key, value);
    }

    public delete(key: any): boolean {
        let result = super.delete(key);
        if (result === true) {
            this.invalidateDependents(key);
            this.callObservers(key);
        }
        return result;
    }

    public erase(key: any): boolean {
        let result = super.erase(key);
        if (result === true) {
            this.invalidateDependents(key);
            this.callObservers(key);
        }
        return result;
    }

    private invalidateDependents(key: any): void {
        this.dependencies.get(key).forEach(m => this.invalidate1(m));
    }

    private invalidate1(member: any): void {
        if (this.invalid.has(member))
            return;
        this.invalidated.add(member);
        this.invalid.add(member);
        this.invalidateDependents(member);
    }

    public Invalidate(args: SuObject): void {
        if (args.mapsize() !== 0)
            throw new Error("usage: record.Invalidate(member, ...)");
        for (let arg of args.vec)
            this.invalidate(arg);
    }

    private invalidate(member: any): void {
        assert.that(this.invalidated.size === 0);
        this.invalidate1(member);
        this.callObservers(member);
    }

    public get(key: any): any {
        let ar = RuleContext.top();
        if (ar != null && ar.rec === this)
            this.addDependency(ar.member, key);

        let result = this.getIfPresent(key);
        if (result == null || this.invalid.has(key)) {
            let x = this.getIfSpecial(key);
            if (x != null)
                return x;
            x = this.callRule(key);
            if (x != null)
                result = x;
            else if (result == null)
                result = this.defval;
        }
        return result;
    }

    private getIfSpecial(key: any): any {
        if (ops.isString(key) && SuRecord.isSpecialField(key)) {
            let keyStr = key as string;
            let base = keyStr.substring(0, keyStr.lastIndexOf('_'));
            let result = this.getIfPresent(base);
            if (result != null)
                return ops.isString(result)
                    ? (result as string).toLowerCase()
                    : result
        }
        return null;
    }

    private static isSpecialField(s: string): boolean {
        return s.endsWith("_lower!");
    }

    private callRule(k: any): any {
        this.invalid.delete(k);
        if (!ops.isString(k))
            return null;
        let key: string = k.toString();
        let rule = this.attachedRules.get(key);
        if (rule == null && this.defval != null)
            rule = tryGlobal("Rule_" + key);
        if (rule == null)
            return null;
        // prevent cycles
        if (this.activeRules.indexOf(key) !== -1) //
            return null;
        this.activeRules.push(key);
        try {
            RuleContext.push(this, key);
            try {
                if (typeof rule === 'function' && typeof rule.$call === 'function') {
                    let x = (rule as SuCallable).$call.call(this);
                    if (x != null && !this["Readonly?"]())
                        this.map.set(key, x);
                    return x;
                } else
                    throw new Error("invalid Rule_" + key);
            } finally {
                RuleContext.pop(this, key);
            }
        } finally {
            assert.that(this.activeRules[this.activeRules.length - 1] === key);
            this.activeRules.pop();
        }
    }

    // TODO: toDbRecord
    // TODO: update
    // TODO: delete

    public type(): string {
        return "Record";
    }

    public ["New?"](): boolean {
        maxargs(0, arguments.length);
        return this.status === Status.NEW;
    }

    // TODO: getTransaction

    public Observer(observer: any = mandatory()): void {
        maxargs(1, arguments.length);
        this.observers.push(observer);
    }

    public RemoveObserver(observer: any = mandatory()): void {
        maxargs(1, arguments.length);
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    public static activeObservers: ActiveObserver[] = [];

    /**
	 * Calls observers for the specified field,
	 * and then for any other invalidated fields.
	 */
    public callObservers(member: any): void {
        this.callObservers2(member);
        this.invalidated.delete(member);
        for (let m of this.invalidated) {
            this.invalidated.delete(m);
            this.callObservers2(m);
        }
    }

    /** Call all the observers for a particular field */
    private callObservers2(member: any): void {
        let aos = SuRecord.activeObservers;
        for (let observer of this.observers) {
            let ao: ActiveObserver = new ActiveObserver(observer, member);
            if (aos.findIndex(v => ao.equals(v)) !== -1)
                continue;
            aos.push(ao);
            try {
                if (observer instanceof SuBoundMethod)
                    observer.$callNamed({member: member});
                else if (typeof observer === "function" && typeof observer.$callNamed === "function")
                    (observer as SuCallable).$callNamed.call(this, {member: member});
                else
                    throw new Error("invalid observer");
            } finally {
                let index = aos.findIndex(v => ao.equals(v));
                aos.splice(index, 1);
            }
        }
    }

    public GetDeps(field: any = mandatory()): string {
        maxargs(1, arguments.length);
        return this.getdeps(ops.toStr(field));
    }

    private getdeps(field: string): string {
        let deps = [];
        for (let key of this.dependencies.keySet())
            if (this.dependencies.get(key).has(field))
                deps.push(key);
        return deps.join(',')
    }

    public SetDeps(field: any = mandatory(), deps: any = mandatory()): void {
        maxargs(2, arguments.length);
        let fieldStr = ops.toStr(field);
        let depsStr = ops.toStr(deps);
        for (let d of depsStr.split(','))
            this.addDependency(fieldStr, d);
    }

    public AttachRule(field: any = mandatory(), rule: any = mandatory()): void {
        maxargs(2, arguments.length);
        this.attachedRules.set(ops.toStr(field), rule);
    }
}

class MultiMap {
    private map: Map<any, Set<any>>;
    constructor(map?: MultiMap) {
        this.map = new Map();
        if (map === undefined)
            return;
        map.map.forEach((value, key) =>
            this.map.set(key, new Set(value)));
    }

    public get(key: any): Set<any> {
        let res = this.map.get(key);
        return res === undefined ? new Set() : res;
    }

    public put(key: any, value: any): void {
        this.map.set(key, this.get(key).add(value));
    }

    public keySet() {
        return this.map.keys()
    }
}

class ActiveObserver {
    constructor(public observer: any, public member: any) {}
    public equals(other: any): boolean {
        if (this === other)
            return true;
        if (!(other instanceof ActiveObserver))
            return false;
        return cmp(this.observer, other.observer) === 0 &&
            cmp(this.member, other.member) === 0;
    }
}

interface Rule {
    rec: SuRecord,
    member: any
}

class RuleContext {
    private static activeRules: Rule[] = [];
    public static push(rec: SuRecord, member: any): void {
        RuleContext.activeRules.push({rec: rec, member: member});
    }
    public static top(): Rule {
        return RuleContext.activeRules[RuleContext.activeRules.length - 1];
    }
    public static pop(rec: SuRecord, member: any): void {
        let ar = RuleContext.activeRules.pop();
        assert.that(ar !== undefined &&
            rec === ar.rec && member === ar.member);
    }
}
