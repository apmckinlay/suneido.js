import { mandatory, maxargs } from "../args";
import { toStr, isString, toObject } from "../ops";
import { SuObject } from "../suobject";
import { global } from "../global";
import { RootClass } from "../rootclass";
import { type } from "../type";
import * as util from "../utility";

export function su_construct(what: any = mandatory(), s: any = '') {
    maxargs(2, arguments.length);
    let suffix = toStr(s);
    let c: SuObject = toObject(what);
    let newargs: SuObject | undefined;
    if (c != null) {
        what = c.get(0);
        if (what == null)
            throw new Error("Construct: object requires member 0");
        newargs = c;
    }
    if (isString(what)) {
        let className = toStr(what);
        if (!className.endsWith(suffix))
            className += suffix;
        what = global(className);
    }
    if (what instanceof RootClass && what.isClass()) {
        let instance = Object.create(what);
        let call: any = what.New;
        if (!newargs)
            call.$call.call(instance);
        else
            call.$callAt.call(instance, new SuObject(newargs.vec.slice(1), newargs.map));
        return instance;
    }
    throw new Error(`can't create instance of ${type(what)}`);
}

//BUILTIN Construct(what, suffix="")
//GENERATED start
(su_construct as any).$call = su_construct;
(su_construct as any).$callNamed = function ($named: any, what: any, suffix: any) {
    maxargs(3, arguments.length);
    ({ what = what, suffix = suffix } = $named);
    return su_construct(what, suffix);
};
(su_construct as any).$callAt = function (args: SuObject) {
    return (su_construct as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_construct as any).$callableType = "BUILTIN";
(su_construct as any).$callableName = "Construct";
(su_construct as any).$params = 'what, suffix=""';
//GENERATED end

