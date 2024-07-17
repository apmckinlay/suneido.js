import { toInt } from "../ops";
import { SuObject } from "../suobject";
import { maxargs, mandatory } from "../su";
import * as util from "../utility";

export function su_random(a: any = mandatory()): number {
    maxargs(1, arguments.length);
    let n = toInt(a);
    return n === 0 ? 0 : Math.floor(Math.random() * n);
}

//BUILTIN Random(n)
//GENERATED start
(su_random as any).$call = su_random;
(su_random as any).$callNamed = function ($named: any, n: any) {
    maxargs(2, arguments.length);
    ({ n = n } = $named);
    return su_random(n);
};
(su_random as any).$callAt = function (args: SuObject) {
    return (su_random as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_random as any).$callableType = "BUILTIN";
(su_random as any).$callableName = "Random";
(su_random as any).$params = 'n';
//GENERATED end
