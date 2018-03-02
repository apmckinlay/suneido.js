/**
 * @file
 * Run-time support routines
 */

//TODO dynget, dynset, dynpush, dynpop
//TODO record builder
//TODO iter, next, blockreturn

import { SuValue, SuIterable } from "./suvalue";
import { SuNum } from "./sunum";
import { SuObject } from "./suobject";
import { SuDate } from "./sudate";
import { type } from "./type";
import { display } from "./display";
import { is } from "./is";
import { cmp } from "./cmp";
import { global } from "./global";
import { Strings, String2, toStr, isString } from "./builtin/strings";
const sm: any = Strings.prototype;
import { Numbers } from "./builtin/numbers";
const nm: any = Numbers.prototype;
import { Functions } from "./builtin/functions";
const fm: any = Functions.prototype;
import { RootClass } from "./rootclass";
import { mapToOb, obToMap } from "./utility";
import { Regex, Pattern } from "./regex";
import { CacheMap } from "./cachemap";
import { Dynamic } from "./dynamic";
import "./globals";
import { mandatory } from "./args";
import { SuException, err } from "./suexception";
import { Except } from "./builtin/except";

type Num = number | SuNum;

export { toStr } from "./builtin/strings";
export { mkObject, mkObject2} from "./suobject"
export { mandatory, maxargs } from "./args";
export { blockreturn, blockReturnHandler, rethrowBlockReturn } from "./blockreturn";
export { display, is, global, mapToOb, obToMap };

export const empty_object = new SuObject().Set_readonly();

export const root_class = RootClass.prototype;

export function put(ob: any, key: any, val: any): any {
    if (ob instanceof SuValue)
        ob.put(key, val);
    else
        err(type(ob) + " does not support put (" + key + ")");
    return val;
}

export function get(x: any, key: any): any {
    if (isString(x)) {
        x = x.toString();
        let i = toInt(key);
        let n = x.length;
        if (i < 0) {
            i += n;
            if (i < 0)
                return "";
        }
        return i < n ? x[i] : "";
    }
    if (x instanceof SuValue)
        return x.get(key);
    err(type(x) + " does not support get (" + key + ")");
}

export function rangeto(x: any, i: number, j: number) {
    sliceable(x);
    return x.slice(i, j);
}

export function rangelen(x: any, i: number, n: number) {
    sliceable(x);
    if (n < 0)
        n = 0;
    return x.slice(i, i + n);
}

function sliceable(x: any): void {
    if (typeof x !== 'string' && !(x instanceof SuObject) && !(x instanceof String2))
        err(type(x) + " does not support slice");
}

export function inc(x: any): Num {
    return add(x, 1);
}

export function dec(x: any): Num {
    return sub(x, 1);
}

export function uadd(x: any): Num {
    return toNum(x);
}

export function usub(x: any): Num {
    x = toNum(x);
    if (typeof x === 'number')
        return -x;
    else if (x instanceof SuNum)
        return x.neg();
    return err("unreachable");
}

export function not(x: any): boolean {
    return !toBool(x);
}

export function bitnot(x: any): number {
    return ~toInt(x);
}

function toInt(x: any): number {
    if (Number.isSafeInteger(x))
        return x;
    if (x instanceof SuNum && x.isInt())
        return x.toInt();
    return err("can't convert " + type(x) + " to integer");
}

function toNum(x: any): Num {
    if (typeof x === 'number' || x instanceof SuNum)
        return x;
    if (x === false || x === "")
        return 0;
    if (x === true)
        return 1;
    if (isString(x)) {
        x = x.toString();
        if (!/[.eE]/.test(x) && x.length < 14)
            return parseInt(x);
        let n = SuNum.parse(x);
        if (n)
            return n;
    }
    return err("can't convert " + type(x) + " to number");
}

function toSuNum(x: number | SuNum): SuNum {
    return (typeof x === 'number') ? SuNum.make(x) : x;
}

export function add(x: any, y: any): Num {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x + y;
    else
        return SuNum.add(toSuNum(x), toSuNum(y));
}

export function sub(x: any, y: any): Num {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x - y;
    else
        return SuNum.sub(toSuNum(x), toSuNum(y));
}

export function cat(x: any, y: any): string | Except {
    let result = toStr(x) + toStr(y);
    if (x instanceof Except)
        return x.As(result);
    if (y instanceof Except)
        return y.As(result);
    return result;
}

export function mul(x: any, y: any): Num {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x * y;
    else
        return SuNum.mul(toSuNum(x), toSuNum(y));
}

export function div(x: any, y: any): SuNum {
    x = toNum(x);
    y = toNum(y);
    return SuNum.div(toSuNum(x), toSuNum(y));
}

export function mod(x: any, y: any): number {
    return toInt(x) % toInt(y);
}

export function lshift(x: any, y: any): number {
    return toInt(x) << toInt(y);
}

export function rshift(x: any, y: any): number {
    return toInt(x) >>> toInt(y);
}

export function bitand(x: any, y: any): number {
    return toInt(x) & toInt(y);
}

export function bitor(x: any, y: any): number {
    return toInt(x) | toInt(y);
}

export function bitxor(x: any, y: any): number {
    return toInt(x) ^ toInt(y);
}

export function isnt(x: any, y: any): boolean {
    return !is(x, y);
}

export function lt(x: any, y: any): boolean {
    return cmp(x, y) < 0;
}

export function lte(x: any, y: any): boolean {
    return cmp(x, y) <= 0;
}

export function gt(x: any, y: any): boolean {
    return cmp(x, y) > 0;
}

export function gte(x: any, y: any): boolean {
    return cmp(x, y) >= 0;
}

export let regexCache =
    new CacheMap<string, Pattern>(32, (s) => Regex.compile(s));

export function match(x: any, y: any): boolean {
    return null != regexCache.get(toStr(y)).firstMatch(toStr(x), 0);
}

export function matchnot(x: any, y: any): boolean {
    return null == regexCache.get(toStr(y)).firstMatch(toStr(x), 0);
}

export function toBool(x: any): boolean {
    if (x !== true && x !== false)
        err("can't convert " + type(x) + " to boolean");
    return x;
}

export function exception(e: any): SuException {
    return e instanceof Except
        ? new SuException(e.toString(), e.getError(), true)
        : new SuException(toStr(e));
}

export function catchMatch(e: Error, pat?: string): Except {
    if (isCatchMatch(e.toString(), pat))
        return new Except(e);
    throw e;
}

function isCatchMatch(es: string, patterns?: string): boolean {
    if (!patterns)
        return true;

    let patlist = patterns.split('|')
    for (let pat in patlist)
        if (pat.startsWith('*')
            ? es.includes(pat.substr(1)) : es.startsWith(pat))
            return true;
    return false;
}

export function mknum(s: string) {
    return SuNum.parse(s) ||
        err("can't convert " + display(s) + " to number");
}

export function mkdate(s: string): SuDate {
    return SuDate.literal(s) !;
}

// Note: only Suneido values and strings are callable
export function call(f: any, ...args: any[]): any {
    if (typeof f === 'string') {
        if (args.length === 0)
            err("string call requires 'this' argument");
        return invoke(args[0], f, ...args.slice(1));
    }
    let call = f.$call;
    if (typeof call === 'function')
        return call.apply(f, args);
    cantCall(f);
}

export function callNamed(f: any, ...args: any[]): any {
    if (typeof f === 'string') {
        if (args.length <= 1)
            err("string call requires 'this' argument");
        return invokeNamed(args[1], f, args[0], ...args.slice(2));
    }
    let call = f.$callNamed;
    if (typeof call === 'function')
        return call.apply(f, args);
    cantCall(f);
}

export function callAt(f: any, args: SuObject): any {
    if (typeof f === 'string') {
        if (args.vecsize() === 0)
            err("string call requires 'this' argument");
        let ob = args.get(0);
        args.erase(0);
        return invokeAt(ob, f, args);
    }
    let call = f.$callAt;
    if (typeof call === 'function')
        return call.call(f, args);
    cantCall(f);
}

function cantCall(f: any): never {
    return err("can't call " + type(f));
}

/**
 * Call a method on an object.
 */
export function invoke(ob: any, method: string, ...args: any[]): any {
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$call;
        if (typeof call === 'function')
            return call.apply(ob, args);
    }
    methodNotFound(ob, method);
}

export function invokeNamed(ob: any, method: string, ...args: any[]): any {
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$callNamed;
        if (typeof call === 'function')
            return call.apply(ob, args);
    }
    methodNotFound(ob, method);
}

export function invokeAt(ob: any, method: string, args: SuObject): any {
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$callAt;
        if (typeof call === 'function')
            return call.call(ob, args);
    }
    methodNotFound(ob, method);
}

/**
 * for super calls
 * @param base equals to false if the base class is RootClass, otherwise saves the base class name
 * @param method method name
 * @param self class or instance called on
 * @param args
 */
export function invokeBySuper(base: string | false, method: string, self: any, ...args: any[]): any {
    let ob = base === false ? root_class : global(base);
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$call;
        if (typeof call === 'function')
            return call.apply(self, args);
    }
    methodNotFound(ob, method);
}

export function invokeNamedBySuper(base: string | false, method: string, self: any, ...args: any[]): any {
    let ob = base === false ? root_class : global(base);
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$callNamed;
        if (typeof call === 'function')
            return call.apply(self, args);
    }
    methodNotFound(ob, method);
}

export function invokeAtBySuper(base: string | false, method: string, self: any, args: SuObject): any {
    let ob = base === false ? root_class : global(base);
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$callAt;
        if (typeof call === 'function')
            return call.call(self, args);
    }
    methodNotFound(ob, method);
}

function methodNotFound(ob: any, method: string): never {
    return err("method not found: " + type(ob) + "." + method);
}

function getMethod(ob: any, method: string): any {
    let t = typeof ob;
    if (t === 'string')
        return sm[method] || global('Strings')[method];
    if (t === 'number' || ob instanceof SuNum)
        return nm[method] || global('Numbers')[method];
    if (t === 'function')
        return fm[method];
    // for instances, start lookup in class
    let start = Object.isFrozen(ob) ? ob : Object.getPrototypeOf(ob);
    if (start instanceof String2)
        return (start as any)[method] || sm[method] || global('Objects')[method];
    return start[method] || global('Objects')[method];
}

export function instantiate(clas: any, ...args: any[]): any {
    let instance = Object.create(clas);
    invoke(instance, 'New', ...args); // but spread is slow
    return instance;
}

export function instantiateAt(clas: any, args: SuObject): any {
    let instance = Object.create(clas);
    invokeAt(instance, 'New', args);
    return instance;
}

export function instantiateNamed(clas: any, ...args: any[]): any {
    let instance = Object.create(clas);
    invokeNamed(instance, 'New', ...args); // but spread is slow
    return instance;
}

export function iter(ob: any): SuIterable {
    return invoke(ob, 'Iter');
}

export function next(iter: SuIterable): any {
    return iter.Next();
}

export let dynpush = Dynamic.push;
export let dynpop = Dynamic.pop;
export let dynget = Dynamic.get;
export let dynset = Dynamic.put;
export function dynparam (name: string, defValue?: any): any {
    let value = Dynamic.getOrUndefined(name);
    if (value !== undefined)
        return value;
    return defValue !== undefined ? defValue : mandatory();
}
