/**
 * Created by andrew on 2015-05-31.
 */
"use strict";

import dnum = require("./dnum");
type Dnum = dnum.Dnum;

export interface SuObject {
    readonly: boolean;
    defval: any;
    vec: Array<any>;
    map: Map<any,any>;

    size(): number;
    vecsize(): number;
    mapsize(): number;
    add(value: any): void;
    put(key: any, value: any): void;
    get(key: any): any;
    setReadonly(): void;
    setDefault(value: any): void;
}

var suob = Object.create(null);

export function make(): SuObject {
    var ob = Object.create(suob);
    ob.readonly = false;
    ob.defval = undefined;
    ob.vec = [];
    ob.map = new Map();
    return ob;
}

export function isSuOb(x: any): boolean {
    return typeof x === 'object' && Object.getPrototypeOf(x) === suob;
}

suob.size = function (): number {
    return this.vec.length + this.map.size;
}

suob.vecsize = function (): number {
    return this.vec.length;
}

suob.mapsize = function (): number {
    return this.map.size;
}

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

suob.add = function (x: any): void {
    checkReadonly(this);
    this.vec.push(x);
    migrate(this);
}

function canonical(key: any): any {
    if (dnum.isDnum(key) && (<Dnum>key).isInt())
        return (<Dnum>key).toInt();
    if (typeof key === 'number' && ! dnum.isInteger(key))
        return dnum.fromNumber(key);
    return key;
}

function index(key: any): number {
    if (dnum.isDnum(key) && (<Dnum>key).isInt())
        key = (<Dnum>key).toInt();
    return dnum.isInteger(key) ? key : -1;
}

suob.put = function (key: any, value: any): void {
    checkReadonly(this);
    var i = index(key);
    if (0 <= i && i < this.vec.length)
        this.vec[i] = value;
    else if (i === this.vec.length)
        this.add(value);
    else
        this.map.set(key, value);
}

suob.get = function (key: any): any {
    var value = getIfPresent(this, key);
    if (value !== undefined)
        return value;
    //TODO handle SuObject defval
    return this.defval;
}

function getIfPresent(ob: SuObject, key: any): any {
    var i = index(key);
    return (0 <= i && i < ob.vec.length) ? ob.vec[i] : ob.map.get(key);
}

suob.setReadonly = function (): void {
    if (this.readonly)
        return;
    this.readonly = true;
    //TODO recursively set readonly
}

suob.setDefault = function (value: any): void {
    this.defval = value;
}