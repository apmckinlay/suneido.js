import { SuObject } from '../suobject';
import { cmp } from '../cmp';
import * as util from '../utility';
import { maxargs, mandatory } from "../args";

export function su_sameq(x: any = mandatory(), y: any = mandatory()): boolean {
    maxargs(2, arguments.length);
    return x === y;
}

//BUILTIN Same?(x, y)
//GENERATED start
(su_sameq as any).$call = su_sameq;
(su_sameq as any).$callNamed = function ($named: any, x: any, y: any) {
    maxargs(3, arguments.length);
    ({ x = x, y = y } = $named);
    return su_sameq(x, y);
};
(su_sameq as any).$callAt = function (args: SuObject) {
    return (su_sameq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_sameq as any).$callableType = "BUILTIN";
(su_sameq as any).$callableName = "Same?";
(su_sameq as any).$params = 'x, y';
//GENERATED end


export function su_cmp(x: any = mandatory(), y: any = mandatory()): number {
    maxargs(2, arguments.length);
    return cmp(x, y);
}

//BUILTIN Cmp(x, y)
//GENERATED start
(su_cmp as any).$call = su_cmp;
(su_cmp as any).$callNamed = function ($named: any, x: any, y: any) {
    maxargs(3, arguments.length);
    ({ x = x, y = y } = $named);
    return su_cmp(x, y);
};
(su_cmp as any).$callAt = function (args: SuObject) {
    return (su_cmp as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_cmp as any).$callableType = "BUILTIN";
(su_cmp as any).$callableName = "Cmp";
(su_cmp as any).$params = 'x, y';
//GENERATED end