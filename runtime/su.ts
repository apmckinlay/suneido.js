/**
 * @file
 * Run-time support routines
 */

//TODO dynget, dynset, dynpush, dynpop
//TODO record builder

import { SuValue } from "./suvalue";
import { SuNum } from "./sunum";
import { SuObject } from "./suobject";
import { SuDate } from "./sudate";
import { type } from "./type";
import { display } from "./display";
import { is } from "./is";
import { cmp } from "./cmp";
import { suglobals } from "./globals";
import { mandatory, maxargs } from "./args";
import { Strings } from "./builtin/strings";
const sm: any = Strings.prototype;
import { Numbers } from "./builtin/numbers";
const nm: any = Numbers.prototype;
import { Functions } from "./builtin/functions";
const fm: any = Functions.prototype;
import { RootClass } from "./rootclass";

type Num = number | SuNum;

export { display, is, mandatory, maxargs };

export const empty_object = new SuObject().Set_readonly();

export const root_class = RootClass.prototype;

export function put(ob: any, key: any, val: any): any {
    if (ob instanceof SuValue)
        ob.put(key, val);
    else
        throw type(ob) + " does not support put (" + key + ")";
    return val;
}

export function get(x: any, key: any): any {
    if (typeof x === 'string')
        return x[toInt(key)];
    if (x instanceof SuValue)
        return x.get(key);
    throw type(x) + " does not support get (" + key + ")";
}

export function rangeto(x: any, i: number, j: number) {
    sliceable(x);
    return x.slice(i, j);
}

export function rangelen(x: any, i: number, n: number) {
    sliceable(x);
    return x.slice(i, n < 0 ? n : i + n);
}

function sliceable(x: any): void {
    if (typeof x !== 'string' && !(x instanceof SuObject))
        throw type(x) + " does not support slice";
}

export function inc(x: any) {
    return x + 1; // TODO
}

export function dec(x: any) {
    return x - 1; // TODO
}

export function uadd(x: any) {
    return +x; // TODO
}

export function usub(x: any) {
    return -x; // TODO
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
    throw "can't convert " + type(x) + " to integer";
}

function toNum(x: any): Num {
    if (typeof x === 'number' || x instanceof SuNum)
        return x;
    if (x === false || x === "")
        return 0;
    if (x === true)
        return 1;
    if (typeof x === 'string') {
        let n: SuNum | null;
        if (!/[.eE]/.test(x) && x.length < 14)
            return parseInt(x);
        else if (n = SuNum.parse(x))
            return n;
    }
    throw "can't convert " + type(x) + " to number";
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

export function toStr(x: any): string {
    if (typeof x === 'string')
        return x;
    else if (x === true)
        return "true";
    else if (x === false)
        return "false";
    else if (typeof x === 'number' || x instanceof SuNum)
        return x.toString();
    else
        throw new Error("can't convert " + type(x) + " to String");
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
    return toInt(x) >> toInt(y);
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

export function match(x: any, y: any): boolean {
    return RegExp(y).test(x); //TODO
}

export function matchnot(x: any, y: any): boolean {
    return !RegExp(y).test(x); //TODO
}

export function toBool(x: any): boolean {
    if (x !== true && x !== false)
        throw "can't convert " + type(x) + " to boolean";
    return x;
}

export function catchMatch(e: string, pat: string): boolean { // TODO
    if (pat[0] === '*')
        return -1 !== e.indexOf(pat.substring(1));
    else
        return -1 !== e.lastIndexOf(pat, 0);

}

export function mknum(s: string) {
    return SuNum.parse(s) ||
        err("can't convert " + display(s) + " to number");
}

function err(s: string): void {
    throw new Error(s);
}

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

export function mkdate(s: string): SuDate {
    return SuDate.literal(s)!;
}

// Note: only Suneido values and strings are callable

// Note: using apply until better spread (...) performance in v8

export function call(f: any, ...args: any[]): any {
    let call = f.$call;
    if (call)
        return call.apply(undefined, args);
    //  TODO strings
    cantCall(f);
}

export function callNamed(f: any, ...args: any[]) {
    let call = f.$callNamed;
    if (call)
        return call.apply(undefined, args);
    //  TODO strings
    cantCall(f);
}

export function callAt(f: any, args: SuObject): any {
    let call = f.$callAt;
    if (call)
        return call(args);
    //  TODO strings
    cantCall(f);
}

function cantCall(f: any): never {
    throw new Error("can't call " + type(f));
}

/**
 * Call a method on an object.
 */
export function invoke(ob: any, method: string, ...args: any[]): any {
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$call;
        if (call)
            return call.apply(ob, args);
    }
    methodNotFound(ob, method);
}

export function invokeNamed(ob: any, method: string, ...args: any[]): any {
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$callNamed;
        if (call)
            return call.apply(ob, args);
    }
    methodNotFound(ob, method);
}

export function invokeAt(ob: any, method: string, args: SuObject): any {
    let f = getMethod(ob, method);
    if (f) {
        let call = f.$callAt;
        if (call)
            return call.call(ob, args);
    }
    methodNotFound(ob, method);
}

function methodNotFound(ob: any, method: string): never {
    throw new Error("method not found: " + type(ob) + "." + method);
}

function getMethod(ob: any, method: string): any {
    let t = typeof ob;
    if (t === 'string')
        return sm[method];
    if (t === 'number' || ob instanceof SuNum)
        return nm[method];
    if (t === 'function')
        return fm[method];
    // for instances, start lookup in class
    let start = Object.isFrozen(ob) ? ob : Object.getPrototypeOf(ob);
    let f = start[method];
    if (typeof f === 'function')
        return f;
    methodNotFound(ob, method);
}

export function global(name: string) {
    let x = suglobals[name];
    if (!x)
        throw new Error("can't find " + name);
    return x;
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
