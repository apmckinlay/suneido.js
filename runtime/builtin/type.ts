import { type } from "../type";
import { mandatory, maxargs } from "../args";
import * as util from "../utility";
import { SuObject } from "../suobject";

export function su_type(x: any = mandatory()): string {
    maxargs(1, arguments.length);
    return type(x);
}

//BUILTIN Type(x)
//GENERATED start
(su_type as any).$call = su_type;
(su_type as any).$callNamed = function ($named: any, x: any) {
    ({ x = x } = $named);
    return su_type(x);
};
(su_type as any).$callAt = function (args: SuObject) {
    return (su_type as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_type as any).$params = 'x';
//GENERATED end
