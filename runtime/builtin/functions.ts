import * as util from "../utility";
import { SuObject } from "../suobject";
import { maxargs, mandatory } from "../args";
import { isFunction } from "../suBoundMethod";

export class Functions {
    Params(this: any): string {
        maxargs(0, arguments.length);
        let p = this.$params;
        return p ? '(' + p + ')' : '';
    }

}

export function su_functionq(value: any = mandatory()): boolean {
    maxargs(1, arguments.length);
    return isFunction(value);
}

//BUILTIN Functions.Params()
//GENERATED start
(Functions.prototype['Params'] as any).$call = Functions.prototype['Params'];
(Functions.prototype['Params'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Functions.prototype['Params'].call(this);
};
(Functions.prototype['Params'] as any).$callAt = function (args: SuObject) {
    return (Functions.prototype['Params'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Functions.prototype['Params'] as any).$params = '';
//GENERATED end

//BUILTIN Function?(value)
//GENERATED start
(su_functionq as any).$call = su_functionq;
(su_functionq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_functionq(value);
};
(su_functionq as any).$callAt = function (args: SuObject) {
    return (su_functionq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_functionq as any).$params = 'value';
//GENERATED end
