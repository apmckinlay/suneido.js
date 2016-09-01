import * as util from "../utility";
import { SuObject } from "../suobject";
import { maxargs } from "../args";

export class FunctionMethods {

    Params(this: any): string {
        maxargs(0, arguments.length);
        let p = this.$params;
        return p ? '(' + p + ')' : '';
    }

}

//BUILTIN FunctionMethods.Params()
//GENERATED start
(FunctionMethods.prototype['Params'] as any).$call = FunctionMethods.prototype['Params'];
(FunctionMethods.prototype['Params'] as any).$callNamed = function (_named: any) {
    return FunctionMethods.prototype['Params'].call(this);
};
(FunctionMethods.prototype['Params'] as any).$callAt = function (args: SuObject) {
    return (FunctionMethods.prototype['Params'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(FunctionMethods.prototype['Params'] as any).$params = '';
//GENERATED end
