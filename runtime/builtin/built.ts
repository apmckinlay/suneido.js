import { maxargs } from "../args";
import * as util from "../utility";
import { SuObject } from "../suobject";

export function su_built(): string {
    maxargs(0, arguments.length);
    return ''; // updated by setbuilt.ts
}

//BUILTIN Built()
//GENERATED start
(su_built as any).$call = su_built;
(su_built as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return su_built();
};
(su_built as any).$callAt = function (args: SuObject) {
    return (su_built as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_built as any).$callableType = "BUILTIN";
(su_built as any).$callableName = "Built";
(su_built as any).$params = '';
//GENERATED end
