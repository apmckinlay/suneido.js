/**
 * @file
 * The start of the inheritance chain.
 * The base of base-less classes.
 */

import { SuValue } from "./suvalue";
import { SuObject } from "./suobject";
import { maxargs } from "./args";
import * as util from "./utility";

export class RootClass extends SuValue {

    // SuValue methods

    get(key: any): any {
        let val = this[key];
        if (val === undefined)
            throw new Error("member not found " + key);
        return val;
    }

    put(key: any, val: any): void {
        this[key] = val;
    }

    type(): string {
        return "Object";
    }

    display(): string { //TODO
        return Object.isFrozen(this) ? "class" : "instance";
    }

    equals(that: any): boolean {
        //TODO instance equality
        return this === that;
    }

    compareTo(_that: any): number {
        throw new Error("class/instance compare not implemented");
    }

    //

    New(): any {
        return Object.create(this);
    }

    Size(): number {
        maxargs(0, arguments.length);
        return Object.keys(this).length;
    }

    Members(): SuObject {
        maxargs(0, arguments.length);
        return new SuObject(Object.keys(this));
    }

    ['Member?'](key: string): boolean {
        maxargs(1, arguments.length);
        return key in this;
    }

    Delete(key: string = "", all: boolean = false): any {
        maxargs(2, arguments.length);
        if (Object.isFrozen(this))
            throw new Error("method not found: class.Delete");
        if ((key === "") === (all === false))
            throw new Error("usage: object.Delete(key) or (all:)");
        if (key !== "")
            delete this[key];
        else if (all === true)
            for (let k of Object.keys(this))
                delete this[k];
        return this;
    }

    Copy(): any {
        maxargs(0, arguments.length);
        if (Object.isFrozen(this))
            throw new Error("method not found: class.Copy");
        let x = Object.create(Object.getPrototypeOf(this));
        for (let k of Object.keys(this))
            x[k] = this[k];
        return x;
    }
}

//BUILTIN RootClass.New()
//GENERATED start
(RootClass.prototype['New'] as any).$call = RootClass.prototype['New'];
(RootClass.prototype['New'] as any).$callNamed = function (_named: any) {
    return RootClass.prototype['New'].call(this);
};
(RootClass.prototype['New'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['New'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['New'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.Size()
//GENERATED start
(RootClass.prototype['Size'] as any).$call = RootClass.prototype['Size'];
(RootClass.prototype['Size'] as any).$callNamed = function (_named: any) {
    return RootClass.prototype['Size'].call(this);
};
(RootClass.prototype['Size'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Size'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Size'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.Members()
//GENERATED start
(RootClass.prototype['Members'] as any).$call = RootClass.prototype['Members'];
(RootClass.prototype['Members'] as any).$callNamed = function (_named: any) {
    return RootClass.prototype['Members'].call(this);
};
(RootClass.prototype['Members'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Members'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Members'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.Member?(key)
//GENERATED start
(RootClass.prototype['Member?'] as any).$call = RootClass.prototype['Member?'];
(RootClass.prototype['Member?'] as any).$callNamed = function ($named: any, key: any) {
    ({ key = key } = $named);
    return RootClass.prototype['Member?'].call(this, key);
};
(RootClass.prototype['Member?'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Member?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Member?'] as any).$params = 'key';
//GENERATED end

//BUILTIN RootClass.Delete(key=false, all=false)
//GENERATED start
(RootClass.prototype['Delete'] as any).$call = RootClass.prototype['Delete'];
(RootClass.prototype['Delete'] as any).$callNamed = function ($named: any, key: any, all: any) {
    ({ key = key, all = all } = $named);
    return RootClass.prototype['Delete'].call(this, key, all);
};
(RootClass.prototype['Delete'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Delete'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Delete'] as any).$params = 'key=false, all=false';
//GENERATED end

//BUILTIN RootClass.Copy()
//GENERATED start
(RootClass.prototype['Copy'] as any).$call = RootClass.prototype['Copy'];
(RootClass.prototype['Copy'] as any).$callNamed = function (_named: any) {
    return RootClass.prototype['Copy'].call(this);
};
(RootClass.prototype['Copy'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Copy'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Copy'] as any).$params = '';
//GENERATED end
