import { display } from "../display";
import { mandatory, maxargs } from "../args";
import * as util from "../utility";
import { SuObject } from "../suobject";

export function su_display(x: any = mandatory()) {
    maxargs(1, arguments.length);
    return display(x);
}

//BUILTIN Display(x)
//GENERATED start
(su_display as any).$call = su_display;
(su_display as any).$callNamed = function ($named: any, x: any) {
    maxargs(2, arguments.length);
    ({ x = x } = $named);
    return su_display(x);
};
(su_display as any).$callAt = function (args: SuObject) {
    return (su_display as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_display as any).$params = 'x';
//GENERATED end
