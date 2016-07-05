/**
 * Run-time support routines for suneido.js
 * Created by andrew on 2015-05-25.
 */

//TODO global
//TODO dynget, dynset, dynpush, dynpop

import dnum = require("./dnum");
type Dnum = dnum.Dnum;

import suob = require("./suobject");
type SuObject = suob.SuObject;

export function put(ob, key, val): void {
    if (suob.isSuOb(ob))
        <SuObject>ob.put(key, val);
    else
        throw typeName(ob) + " does not support put (" + key + ")";
}

export function get(x, key): any {
    if (typeof x === 'string')
        return <string>x.charAt(toInt(key));
    if (suob.isSuOb(x))
        return <SuObject>x.get(key);
    throw typeName(x) + " does not support get (" + key + ")";
}

export function rangeto(x, i, j) {
    var len = x.length;
    return x.slice(prepFrom(i, len), j);
}

export function rangelen(x, i, n) {
    var len = x.length;
    i = prepFrom(i, len);
    return x.slice(i, i + n);
}

function prepFrom(from, len) {
    if (from < 0) {
        from += len;
        if (from < 0)
            from = 0;
    }
    return from;
}

export function inc(x) {
    return x + 1; // TODO
}

export function dec(x) {
    return x - 1; // TODO
}

export function uadd(x) {
    return +x; // TODO
}

export function usub(x) {
    return -x; // TODO
}

export function not(x): boolean {
    return !toBool(x);
}

export function bitnot(x): number {
    return ~x; // TODO
}

function toInt(x): number {
    if (dnum.isInteger(x))
        return x;
    if (dnum.isDnum(x) && <Dnum>x.isInt())
        return (<Dnum>x).toInt();
    throw "can't convert " + typeName(x) + " to integer";
}

function toNum(x: any): number|Dnum {
    if (typeof x === 'number' || dnum.isDnum(x))
        return x;
    if (x === false || x === "")
        return 0;
    if (x === true)
        return 1;
    if (typeof x === 'string') {
        if (-1 === x.search('[.eE]') && x.length < 14)
            return parseInt(x);
        else
            return dnum.parse(x);
    }
    throw "can't convert " + typeName(x) + " to number";
}

function toDnum(x: number|Dnum): dnum.Dnum {
    return (typeof x === 'number') ? dnum.make(x) : <Dnum>x;
}

export function add(x, y): any {
    x = toNum(x);
    y = toNum(y);
    if (typeof x === 'number' && typeof y === 'number')
        return x + y;
    else
        return dnum.add(toDnum(x), toDnum(y));
}

export function sub(x, y) {
    return x - y; //TODO
}

export function cat(x, y): string {
    return "" + x + y; //TODO
}

export function mul(x, y) {
    return x * y; //TODO
}

export function div(x, y) {
    return x / y; //TODO
}

export function mod(x, y) {
    return x % y; //TODO
}

export function lshift(x, y): number {
    return x << y; //TODO
}

export function rshift(x, y): number {
    return x >> y; //TODO
}

export function bitand(x, y): number {
    return x & y; //TODO
}

export function bitor(x, y): number {
    return x | y; //TODO
}

export function bitxor(x, y): number {
    return x ^ y; //TODO
}

function isNum(x): boolean {
    return typeof x === 'number' || dnum.isDnum(x);
}

export function is(x, y): boolean {
    if (x === y)
        return true;
    if (typeof x === 'number' && typeof y === 'number')
        return false;
    if (dnum.isDnum(x))
        return x.equals(y);
    if (dnum.isDnum(y))
        return y.equals(x);
   // TODO suneido objects
    return false;
}

export function isnt(x, y): boolean {
    return !is(x, y); //TODO
}

export function lt(x, y): boolean {
    return x < y; //TODO
}

export function lte(x, y): boolean {
    return x <= y; //TODO
}

export function gt(x, y): boolean {
    return x > y; //TODO
}

export function gte(x, y): boolean {
    return x >= y; //TODO
}

export function match(x, y): boolean {
    return -1 !== x.search(RegExp(y)); //TODO
}

export function matchnot(x, y): boolean {
    return -1 === x.search(RegExp(y)); //TODO
}

export function toBool(x): boolean {
    if (x !== true && x !== false)
        throw "can't convert " + typeof x + " to boolean";
    return x;
}

export function catchMatch(e: string, pat: string): boolean { // TODO
    if (pat.charAt(0) === '*')
        return -1 !== e.indexOf(pat.substring(1));
    else
        return -1 !== e.lastIndexOf(pat, 0);

}

export function noargs(args): void {
    if (args.length != 0)
        throw "too many arguments";
}

export function argsall(args) {
    return args; //TODO
}

export function args(args, spec) {
    return args; //TODO
}

export function typeName(x: any): string {
    if (typeof x.typeName === 'function')
        return x.typeName();
    var t = typeof x;
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

export var default_single_quotes = false;

function displayString(s: string): string {
    if (-1 === s.indexOf('`') &&
        -1 !== s.indexOf('\\') &&
        -1 === s.search(/[^ -~]/))
        return '`' + s + '`';
    s = s.replace('\\', '\\\\');
    var single_quotes = default_single_quotes
        ? -1 === s.indexOf("'")
        : (-1 !== s.indexOf('"') && -1 === s.indexOf("'"));
    if (single_quotes)
        return "'" + s + "'";
    else
        return "\"" + s.replace("\"", "\\\"") + "\"";
}

export var empty_object = suob.make();

export function call0(f) {
    return f();
}
