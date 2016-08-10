/**
 * @file
 * Run-time support routines
 */

//TODO global
//TODO dynget, dynset, dynpush, dynpop
//TODO record builder

import { Dnum } from "./dnum";
import { SuObject } from "./suobject";
import { SuValue } from "./suvalue";

export const empty_object = new SuObject().setReadonly();

export function put(ob: any, key: any, val: any): void {
    if (ob instanceof SuObject)
        ob.put(key, val);
    else
        throw typeName(ob) + " does not support put (" + key + ")";
}

export function get(x: any, key: any): any {
    if (typeof x === 'string')
        return x[toInt(key)];
    if (x instanceof SuObject)
        return x.get(key);
    throw typeName(x) + " does not support get (" + key + ")";
}

export function rangeto(x: any, i: number, j: number) {
    let len = x.length;
    return x.slice(prepFrom(i, len), j);
}

export function rangelen(x: any, i: number, n: number) {
    let len = x.length;
    i = prepFrom(i, len);
    return x.slice(i, i + n);
}

function prepFrom(from: number, len: number) {
    if (from < 0) {
        from += len;
        if (from < 0)
            from = 0;
    }
    return from;
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
    return ~x; // TODO
}

function toInt(x: any): number {
    if (Number.isSafeInteger(x))
        return x;
    if (x instanceof Dnum && x.isInt())
        return x.toInt();
    throw "can't convert " + typeName(x) + " to integer";
}

function toNum(x: any): number | Dnum {
    if (typeof x === 'number' || x instanceof Dnum)
        return x;
    if (x === false || x === "")
        return 0;
    if (x === true)
        return 1;
    if (typeof x === 'string') {
        if (!/[.eE]/.test(x) && x.length < 14)
            return parseInt(x);
        else
            return Dnum.parse(x);
    }
    throw "can't convert " + typeName(x) + " to number";
}

function toDnum(x: number | Dnum): Dnum {
    return (typeof x === 'number') ? Dnum.make(x) : x;
}

export function add(x: any, y: any): any {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x + y;
    else
        return Dnum.add(toDnum(x), toDnum(y));
}

export function sub(x: any, y: any) {
    return x - y; //TODO
}

export function cat(x: any, y: any): string {
    return "" + x + y; //TODO
}

export function mul(x: any, y: any) {
    return x * y; //TODO
}

export function div(x: any, y: any) {
    return x / y; //TODO
}

export function mod(x: any, y: any) {
    return x % y; //TODO
}

export function lshift(x: any, y: any): number {
    return x << y; //TODO
}

export function rshift(x: any, y: any): number {
    return x >> y; //TODO
}

export function bitand(x: any, y: any): number {
    return x & y; //TODO
}

export function bitor(x: any, y: any): number {
    return x | y; //TODO
}

export function bitxor(x: any, y: any): number {
    return x ^ y; //TODO
}

function isNum(x: any): boolean {
    return typeof x === 'number' || x instanceof Dnum;
}

export function is(x: any, y: any): boolean {
    if (x === y)
        return true;
    if (x instanceof SuValue)
        return x.equals(y);
    if (y instanceof SuValue)
        return y.equals(x);
    return false;
}

export function isnt(x: any, y: any): boolean {
    return !is(x, y); //TODO
}

export function lt(x: any, y: any): boolean {
    return x < y; //TODO
}

export function lte(x: any, y: any): boolean {
    return x <= y; //TODO
}

export function gt(x: any, y: any): boolean {
    return x > y; //TODO
}

export function gte(x: any, y: any): boolean {
    return x >= y; //TODO
}

export function match(x: any, y: any): boolean {
    return RegExp(y).test(x); //TODO
}

export function matchnot(x: any, y: any): boolean {
    return !RegExp(y).test(x); //TODO
}

export function toBool(x: any): boolean {
    if (x !== true && x !== false)
        throw "can't convert " + typeof x + " to boolean";
    return x;
}

export function catchMatch(e: string, pat: string): boolean { // TODO
    if (pat[0] === '*')
        return -1 !== e.indexOf(pat.substring(1));
    else
        return -1 !== e.lastIndexOf(pat, 0);

}

export function noargs(args: any[]): void {
    if (args.length !== 0)
        throw "too many arguments";
}

export function argsall(args: any[]) {
    return args; //TODO
}

export function args(args: any[], spec: string) {
    return args; //TODO
}

export function typeName(x: any): string {
    if (typeof x.typeName === 'function')
        return x.typeName();
    let t = typeof x;
    switch (t) {
        case 'boolean': return 'Boolean';
        case 'string': return 'String';
        case 'number': return 'Number';
    }
    return t;
}

export function display(x: any): string {
    if (typeof x.display === 'function')
        return x.display();
    if (typeof x === 'string')
        return displayString(x);
    return x.toString();
}

export let default_single_quotes = false;

function displayString(s: string): string {
    if (-1 === s.indexOf('`') &&
        -1 !== s.indexOf('\\') &&
        -1 === s.search(/[^ -~]/))
        return '`' + s + '`';
    s = s.replace('\\', '\\\\');
    let single_quotes = default_single_quotes
        ? -1 === s.indexOf("'")
        : (-1 !== s.indexOf('"') && -1 === s.indexOf("'"));
    if (single_quotes)
        return "'" + s + "'";
    else
        return "\"" + s.replace("\"", "\\\"") + "\"";
}

export function mandatory() {
    throw new Error("missing argument");
}

/**
 * constructor for object constants i.e. #(...)
 * named members passed as sequence of key,value
 */
export function mkObject(...args: any[]): SuObject {
    let i = args.indexOf(null);
    if (i === -1)
        return new SuObject(args).setReadonly();
    let vec = args.slice(0, i);
    let map = new Map<any, any>();
    for (i++; i < args.length; i += 2)
        map.set(args[i], args[i + 1]);
    return new SuObject(vec, map).setReadonly();
}

export function mkObject2(vec: any[], map?: Map<any, any>): SuObject {
    return new SuObject(vec, map);
}

/** used in code generated by JsTranslateFunction */
export function toMap(ob: any): Map<any, any> {
    let map = new Map<any, any>();
    for (let k of Object.keys(ob))
        map.set(k, ob[k]);
    return map;
}

/**
 * convert map to plain JavaScript object
 * used in code generated by JsTranslateFunction
 */
export function toObject(map: Map<any, any>): Object {
    let ob: any = {};
    for (let [k, v] of map)
        ob[k] = v;
    return ob;
}
