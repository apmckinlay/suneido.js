// temporary - till we can use stdlib version

import { mandatory, maxargs } from "../args";
import * as util from "../utility";
import { SuObject } from "../suobject";

export function su_assert(b: boolean = mandatory(), msg: string = ""): void {
    maxargs(2, arguments.length);
    if (b !== true)
        throw new Error("Assert failed" + (msg ? ": " + msg : ""));
}

//BUILTIN Assert(cond, msg="")
//GENERATED start
(su_assert as any).$call = su_assert;
(su_assert as any).$callNamed = function ($named: any, cond: any, msg: any) {
    ({ cond = cond, msg = msg } = $named);
    return su_assert(cond, msg);
};
(su_assert as any).$callAt = function (args: SuObject) {
    return (su_assert as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_assert as any).$params = 'cond, msg=""';
//GENERATED end
