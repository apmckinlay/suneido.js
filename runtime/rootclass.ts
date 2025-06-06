/**
 * @file
 * The start of the inheritance chain.
 * The base of base-less classes.
 */

import { SuValue, SuCallable } from "./suvalue";
import { SuObject } from "./suobject";
import { SuBoundMethod, isBlock, isFunction } from "./suBoundMethod";
import { mandatory, maxargs } from "./args";
import { is, toBoolean, toStr, isString } from "./ops";
import { globalLookup } from "./global";
import { type } from "./type";
import * as util from "./utility";

export class RootClass extends SuValue {
    private library: string;
    private className: string;
    // Generated code should call this when generating Class
    $setClassInfo(library: string, className: string) {
        Object.defineProperty(this, 'library',  { value: library });
        Object.defineProperty(this, 'className',  { value: className });
    }
    // SuValue methods

    get(this: any, key: any): any {
        let val = this[key];
        if (val !== undefined)
            return typeof val === 'function' && val.$callableType === 'METHOD'
                ? new SuBoundMethod(this, val)
                : val;
        val = this["Getter_"];
        if (val && typeof val === 'function')
            return val.$call.call(this, key);
        val = typeof key === 'string' && this["Getter_" + key];
        if (val && typeof val === 'function')
            return val.$call.call(this);
        throw new Error("member not found " + key);
    }

    put(this: any, key: any, val: any): void {
        if (this.isClass())
            throw new Error("Class does not support put");
        // classes are frozen which makes their properties read-only
        // which means we can't do simple assignment
        Object.defineProperty(this, key,
            { enumerable: true, configurable: true, writable: true, value: val });
    }

    type(): string {
        return this.isClass() ? "Class" : "Object";
    }

    getName(): string {
        return this.isClass() ? this.className : '';
    }

    display(): string {
        return this.isClass() ? this.displayClass() : this.displayInstance();
    }

    private displayInstance(): string {
        let s = this.userDefToString();
        return s !== null ? s : `${this.toClass().className}()`;
    }

    // Instance method
    userDefToString(): string | null {
        if (this.isClass())
            return null;
        let toString = this.getMethod("ToString");
        if (isFunction(toString)) {
            let x = toString.$call.call(this);
            if (isString(x))
                return x.toString();
            throw new Error("ToString should return a string");
        }
        return null;
    }

    private displayClass(): string {
        if (this.className.endsWith("$c"))
            return "/* class */";
        if (this.library)
            return `${this.className} /* ${this.library} class */`;
        return this.className;
    }

    equals(that: any): boolean {
        if (this.isClass())
            return this === that;
        else {
            return instanceEquals(this, that);
        }
    }

    compareTo(_that: any): util.Cmp {
        throw new Error("class/instance compare not implemented");
    }

    isClass(): boolean {
        return Object.isFrozen(this);
    }

    lookup(this: any, method: string): SuCallable {
        let start = this.toClass();
        if (method === 'New')
            return start.New;
        return (RootClass.prototype as any)[method] ||
            start[method] || globalLookup('Objects', method) || notFound(method);
    }

    getMethod(this: any, method: string) {
        let start = this.toClass();
        return start[method];
    }

    // external methods

    $call(this: any) {
        if (this.isClass())
            return this.CallClass.$call.apply(this, arguments);
        else
            return this.Call.$call.apply(this, arguments);
    }
    $callAt(this: any) {
        if (this.isClass())
            return this.CallClass.$callAt.apply(this, arguments);
        else
            return this.Call.$callAt.apply(this, arguments);
    }
    $callNamed(this: any) {
        if (this.isClass())
            return this.CallClass.$callNamed.apply(this, arguments);
        else
            return this.Call.$callNamed.apply(this, arguments);
    }

    /** default CallClass creates new instance */
    CallClass(): any {
        let instance: any = Object.create(this);
        instance.New.$call.apply(instance, arguments);
        return instance;
    }

    New(): any {
    }

    Size(): number {
        maxargs(0, arguments.length);
        return Object.keys(this).length;
    }

    Members(_all: any = false): SuObject {
        maxargs(1, arguments.length);
        let all = toBoolean(_all);
        let c = Object.keys(this);
        if (all !== true)
            return new SuObject(c);
        let cur = this;
        while ((cur = Object.getPrototypeOf(cur)) !== RootClass.prototype)
            c.push(...Object.keys(cur));
        return (new SuObject(c))['Sort!']()["Unique!"]();
    }

    ['Member?'](key: string): boolean {
        maxargs(1, arguments.length);
        return key in this && ! (key in RootClass.prototype);
    }

    MethodClass(_key: any) {
        let key = toStr(_key);
        let c = this.toClass();
        while (c !== RootClass.prototype) {
            if (c.hasOwnProperty(key))
                return c;
            c = Object.getPrototypeOf(c);
        }
        return false;
    }

    ['Method?'](_method: any) {
        let method = toStr(_method);
        return isFunction(this.getMethod(method));
    }

    toClass(): RootClass {
        return this.isClass() ? this : Object.getPrototypeOf(this);
    }

    Eval(args: SuObject): any {
        return SuObject.prototype.Eval.call(this, args);
    }

    Eval2(args: SuObject): SuObject {
        return SuObject.prototype.Eval2.call(this, args);
    }

    Delete(this: any, key: string = "", all: boolean = false): any {
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

    Copy(this: any): any {
        maxargs(0, arguments.length);
        if (Object.isFrozen(this))
            throw new Error("method not found: class.Copy");
        let x = Object.create(Object.getPrototypeOf(this));
        for (let k of Object.keys(this))
            x[k] = this[k];
        return x;
    }

    CompareAndSet(member: any = mandatory(), newval: any = mandatory(), oldval: any): boolean {
        maxargs(3, arguments.length);
        if (this.isClass())
            throw new Error("method not found: class.CompareAndSet")
        const val = (this as any)[toStr(member)];
        let set: boolean = true;
        if (oldval === undefined || val === undefined) {
            set = oldval === val;
        } else {
            set = is(val, oldval);
        }
        if (set) {
            this.put(member, newval);
        }
        return set;
    }

    GetDefault(this: any, key: any = mandatory(), defValue: any = mandatory()): any {
        maxargs(2, arguments.length);
        let val;
        try { val = this.get(key); } catch (e) {}
        if (val !== undefined)
            return val;
        return isBlock(defValue)
            ? defValue.$call()
            : defValue;
    }

    Base(): any {
        maxargs(0, arguments.length);
        let root = Object.getPrototypeOf(this);
        return !this.isClass() || root instanceof RootClass
            ? root
            : false;
    }

    ['Base?'](value: any = mandatory()): boolean {
        maxargs(1, arguments.length);
        let c = this.toClass();
        while (c !== RootClass.prototype) {
            if (c === value)
                return true;
            c = Object.getPrototypeOf(c);
        }
        return false;
    }
} // end of RootClass

function notFound(method: string): SuCallable {
    let f: any = function () {};
    f.$params = "@args";
    f.$callableType = "METHOD";
    f['$blockThis?'] = null;
    f.$call = function(this: RootClass) {
        if ("Default" !== method) {
            let fn = this.getMethod('Default');
            if (isFunction(fn))
                return fn.$call.call(this, method, ...arguments);
        }
        throw new Error(`method not found: ${type(this)}.${method}`);
    };
    f.$callAt = function(this: RootClass, arg: SuObject) {
        if ("Default" !== method) {
            let fn = this.getMethod('Default');
            if (isFunction(fn))
                return fn.$callAt.call(this, arg.insert(0, method));
        }
        throw new Error(`method not found: ${type(this)}.${method}`);
    };
    f.$callNamed = function(this: RootClass, ...args: any[]) {
        if ("Default" !== method) {
            let fn = this.getMethod('Default');
            if (isFunction(fn))
                return fn.$callNamed.call(this, args[0], method, ...args.slice(1));
        }
        throw new Error(`method not found: ${type(this)}.${method}`);
    };
    return f;
}

function instanceEquals(x: any, y: any): boolean {
    if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y))
        return false;
    let xkeys = Object.keys(x);
    if (xkeys.length !== y.Size())
        return false;
    for (let k of xkeys)
        if (!y.hasOwnProperty(k) || !is(x[k], y[k]))
            return false;
    return true;
}

(RootClass.prototype['CallClass'] as any).$call = RootClass.prototype['CallClass'];
(RootClass.prototype['CallClass'] as any).$callAt = function () {
        let instance: any = Object.create(this);
        instance.New.$callAt.apply(instance, arguments);
        return instance;
};
(RootClass.prototype['CallClass'] as any).$callNamed = function () {
        let instance: any = Object.create(this);
        instance.New.$callNamed.apply(instance, arguments);
        return instance;
};
(RootClass.prototype['CallClass'] as any).$params = '@args';

//BUILTIN RootClass.New()
//GENERATED start
(RootClass.prototype['New'] as any).$call = RootClass.prototype['New'];
(RootClass.prototype['New'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return RootClass.prototype['New'].call(this);
};
(RootClass.prototype['New'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['New'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['New'] as any).$callableType = "BUILTIN";
(RootClass.prototype['New'] as any).$callableName = "RootClass#New";
(RootClass.prototype['New'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.Size()
//GENERATED start
(RootClass.prototype['Size'] as any).$call = RootClass.prototype['Size'];
(RootClass.prototype['Size'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return RootClass.prototype['Size'].call(this);
};
(RootClass.prototype['Size'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Size'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Size'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Size'] as any).$callableName = "RootClass#Size";
(RootClass.prototype['Size'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.Members(all=false)
//GENERATED start
(RootClass.prototype['Members'] as any).$call = RootClass.prototype['Members'];
(RootClass.prototype['Members'] as any).$callNamed = function ($named: any, all: any) {
    maxargs(2, arguments.length);
    ({ all = all } = $named);
    return RootClass.prototype['Members'].call(this, all);
};
(RootClass.prototype['Members'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Members'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Members'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Members'] as any).$callableName = "RootClass#Members";
(RootClass.prototype['Members'] as any).$params = 'all=false';
//GENERATED end

//BUILTIN RootClass.Member?(key)
//GENERATED start
(RootClass.prototype['Member?'] as any).$call = RootClass.prototype['Member?'];
(RootClass.prototype['Member?'] as any).$callNamed = function ($named: any, key: any) {
    maxargs(2, arguments.length);
    ({ key = key } = $named);
    return RootClass.prototype['Member?'].call(this, key);
};
(RootClass.prototype['Member?'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Member?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Member?'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Member?'] as any).$callableName = "RootClass#Member?";
(RootClass.prototype['Member?'] as any).$params = 'key';
//GENERATED end

//BUILTIN RootClass.Method?(method)
//GENERATED start
(RootClass.prototype['Method?'] as any).$call = RootClass.prototype['Method?'];
(RootClass.prototype['Method?'] as any).$callNamed = function ($named: any, method: any) {
    maxargs(2, arguments.length);
    ({ method = method } = $named);
    return RootClass.prototype['Method?'].call(this, method);
};
(RootClass.prototype['Method?'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Method?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Method?'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Method?'] as any).$callableName = "RootClass#Method?";
(RootClass.prototype['Method?'] as any).$params = 'method';
//GENERATED end

//BUILTIN RootClass.MethodClass(key)
//GENERATED start
(RootClass.prototype['MethodClass'] as any).$call = RootClass.prototype['MethodClass'];
(RootClass.prototype['MethodClass'] as any).$callNamed = function ($named: any, key: any) {
    maxargs(2, arguments.length);
    ({ key = key } = $named);
    return RootClass.prototype['MethodClass'].call(this, key);
};
(RootClass.prototype['MethodClass'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['MethodClass'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['MethodClass'] as any).$callableType = "BUILTIN";
(RootClass.prototype['MethodClass'] as any).$callableName = "RootClass#MethodClass";
(RootClass.prototype['MethodClass'] as any).$params = 'key';
//GENERATED end

//BUILTIN RootClass.Eval(@args)
//GENERATED start
(RootClass.prototype['Eval'] as any).$callAt = RootClass.prototype['Eval'];
(RootClass.prototype['Eval'] as any).$call = function (...args: any[]) {
    return RootClass.prototype['Eval'].call(this, new SuObject(args));
};
(RootClass.prototype['Eval'] as any).$callNamed = function (named: any, ...args: any[]) {
    return RootClass.prototype['Eval'].call(this, new SuObject(args, util.obToMap(named)));
};
(RootClass.prototype['Eval'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Eval'] as any).$callableName = "RootClass#Eval";
(RootClass.prototype['Eval'] as any).$params = '@args';
//GENERATED end

//BUILTIN RootClass.Eval2(@args)
//GENERATED start
(RootClass.prototype['Eval2'] as any).$callAt = RootClass.prototype['Eval2'];
(RootClass.prototype['Eval2'] as any).$call = function (...args: any[]) {
    return RootClass.prototype['Eval2'].call(this, new SuObject(args));
};
(RootClass.prototype['Eval2'] as any).$callNamed = function (named: any, ...args: any[]) {
    return RootClass.prototype['Eval2'].call(this, new SuObject(args, util.obToMap(named)));
};
(RootClass.prototype['Eval2'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Eval2'] as any).$callableName = "RootClass#Eval2";
(RootClass.prototype['Eval2'] as any).$params = '@args';
//GENERATED end

//BUILTIN RootClass.Delete(key=false, all=false)
//GENERATED start
(RootClass.prototype['Delete'] as any).$call = RootClass.prototype['Delete'];
(RootClass.prototype['Delete'] as any).$callNamed = function ($named: any, key: any, all: any) {
    maxargs(3, arguments.length);
    ({ key = key, all = all } = $named);
    return RootClass.prototype['Delete'].call(this, key, all);
};
(RootClass.prototype['Delete'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Delete'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Delete'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Delete'] as any).$callableName = "RootClass#Delete";
(RootClass.prototype['Delete'] as any).$params = 'key=false, all=false';
//GENERATED end

//BUILTIN RootClass.Copy()
//GENERATED start
(RootClass.prototype['Copy'] as any).$call = RootClass.prototype['Copy'];
(RootClass.prototype['Copy'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return RootClass.prototype['Copy'].call(this);
};
(RootClass.prototype['Copy'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Copy'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Copy'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Copy'] as any).$callableName = "RootClass#Copy";
(RootClass.prototype['Copy'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.CompareAndSet(member, newVal, oldVal=null)
//GENERATED start
(RootClass.prototype['CompareAndSet'] as any).$call = RootClass.prototype['CompareAndSet'];
(RootClass.prototype['CompareAndSet'] as any).$callNamed = function ($named: any, member: any, newVal: any, oldVal: any) {
    maxargs(4, arguments.length);
    ({ member = member, newVal = newVal, oldVal = oldVal } = $named);
    return RootClass.prototype['CompareAndSet'].call(this, member, newVal, oldVal);
};
(RootClass.prototype['CompareAndSet'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['CompareAndSet'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['CompareAndSet'] as any).$callableType = "BUILTIN";
(RootClass.prototype['CompareAndSet'] as any).$callableName = "RootClass#CompareAndSet";
(RootClass.prototype['CompareAndSet'] as any).$params = 'member, newVal, oldVal=null';
//GENERATED end

//BUILTIN RootClass.GetDefault(member, default_value)
//GENERATED start
(RootClass.prototype['GetDefault'] as any).$call = RootClass.prototype['GetDefault'];
(RootClass.prototype['GetDefault'] as any).$callNamed = function ($named: any, member: any, default_value: any) {
    maxargs(3, arguments.length);
    ({ member = member, default_value = default_value } = $named);
    return RootClass.prototype['GetDefault'].call(this, member, default_value);
};
(RootClass.prototype['GetDefault'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['GetDefault'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['GetDefault'] as any).$callableType = "BUILTIN";
(RootClass.prototype['GetDefault'] as any).$callableName = "RootClass#GetDefault";
(RootClass.prototype['GetDefault'] as any).$params = 'member, default_value';
//GENERATED end

//BUILTIN RootClass.Base()
//GENERATED start
(RootClass.prototype['Base'] as any).$call = RootClass.prototype['Base'];
(RootClass.prototype['Base'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return RootClass.prototype['Base'].call(this);
};
(RootClass.prototype['Base'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Base'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Base'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Base'] as any).$callableName = "RootClass#Base";
(RootClass.prototype['Base'] as any).$params = '';
//GENERATED end

//BUILTIN RootClass.Base?(value)
//GENERATED start
(RootClass.prototype['Base?'] as any).$call = RootClass.prototype['Base?'];
(RootClass.prototype['Base?'] as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return RootClass.prototype['Base?'].call(this, value);
};
(RootClass.prototype['Base?'] as any).$callAt = function (args: SuObject) {
    return (RootClass.prototype['Base?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(RootClass.prototype['Base?'] as any).$callableType = "BUILTIN";
(RootClass.prototype['Base?'] as any).$callableName = "RootClass#Base?";
(RootClass.prototype['Base?'] as any).$params = 'value';
//GENERATED end
