import { mandatory, maxargs } from "../args";
import * as util from "../utility";
import { SuObject } from "../suobject";

export function su_finally(main: any = mandatory(), final: any = mandatory()): any {
    maxargs(2, arguments.length);
    let e: any;
    let fe: any;
    let rtn: any;
    try {
        rtn = main.$call();
    } catch (ee) {
        e = ee;
    } 
    try {
        final.$call();
    } catch (fee) {
        fe = fee;
    }
    if (e) {
        throw e;
    } else if (fe) {
        throw fe;
    } else {
        return rtn;
    }
}

//BUILTIN Finally(main_block, final_block)
//GENERATED start
(su_finally as any).$call = su_finally;
(su_finally as any).$callNamed = function ($named: any, main_block: any, final_block: any) {
    maxargs(3, arguments.length);
    ({ main_block = main_block, final_block = final_block } = $named);
    return su_finally(main_block, final_block);
};
(su_finally as any).$callAt = function (args: SuObject) {
    return (su_finally as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_finally as any).$callableType = "BUILTIN";
(su_finally as any).$callableName = "Finally";
(su_finally as any).$params = 'main_block, final_block';
//GENERATED end