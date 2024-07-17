import { SuObject } from '../suobject';
import * as util from '../utility';
import { maxargs, mandatory } from "../args";

export function su_booleanq(_value: any = mandatory()): boolean {
    maxargs(1, arguments.length);
    return typeof _value === 'boolean';
}

//BUILTIN Boolean?(value)
//GENERATED start
(su_booleanq as any).$call = su_booleanq;
(su_booleanq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_booleanq(value);
};
(su_booleanq as any).$callAt = function (args: SuObject) {
    return (su_booleanq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_booleanq as any).$callableType = "BUILTIN";
(su_booleanq as any).$callableName = "Boolean?";
(su_booleanq as any).$params = 'value';
//GENERATED end
