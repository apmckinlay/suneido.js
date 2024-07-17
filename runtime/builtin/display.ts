import { display, name } from "../display";
import { mandatory, maxargs } from "../args";
import * as util from "../utility";
import { SuObject } from "../suobject";

export function su_display(x: any = mandatory()) {
    maxargs(1, arguments.length);
    return display(x);
}

export function su_name(x: any = mandatory()) {
    maxargs(1, arguments.length);
    return name(x);
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
(su_display as any).$callableType = "BUILTIN";
(su_display as any).$callableName = "Display";
(su_display as any).$params = 'x';
//GENERATED end

//BUILTIN Name(x)
//GENERATED start
(su_name as any).$call = su_name;
(su_name as any).$callNamed = function ($named: any, x: any) {
    maxargs(2, arguments.length);
    ({ x = x } = $named);
    return su_name(x);
};
(su_name as any).$callAt = function (args: SuObject) {
    return (su_name as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_name as any).$callableType = "BUILTIN";
(su_name as any).$callableName = "Name";
(su_name as any).$params = 'x';
//GENERATED end