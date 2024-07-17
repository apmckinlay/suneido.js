import { maxargs } from "../args";
import { RootClass } from "../rootclass";
import { SuObject } from "../suobject";
import * as util from "../utility";

export function su_classq(_value: any): boolean {
    maxargs(1, arguments.length);
    return _value instanceof RootClass && _value.isClass();
}

export function su_instanceq(_value: any): boolean {
    maxargs(1, arguments.length);
    return _value instanceof RootClass && !_value.isClass();
}

//BUILTIN Class?(value)
//GENERATED start
(su_classq as any).$call = su_classq;
(su_classq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_classq(value);
};
(su_classq as any).$callAt = function (args: SuObject) {
    return (su_classq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_classq as any).$callableType = "BUILTIN";
(su_classq as any).$callableName = "Class?";
(su_classq as any).$params = 'value';
//GENERATED end

//BUILTIN Instance?(value)
//GENERATED start
(su_instanceq as any).$call = su_instanceq;
(su_instanceq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_instanceq(value);
};
(su_instanceq as any).$callAt = function (args: SuObject) {
    return (su_instanceq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_instanceq as any).$callableType = "BUILTIN";
(su_instanceq as any).$callableName = "Instance?";
(su_instanceq as any).$params = 'value';
//GENERATED end
