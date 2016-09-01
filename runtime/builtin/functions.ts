import * as util from "../utility";
import { SuObject } from "../suobject";
import { maxargs } from "../args";

export class Functions {

    Params(this: any): string {
        maxargs(0, arguments.length);
        let p = this.$params;
        return p ? '(' + p + ')' : '';
    }

}

//BUILTIN Functions.Params()
//GENERATED start
(Functions.prototype['Params'] as any).$call = Functions.prototype['Params'];
(Functions.prototype['Params'] as any).$callNamed = function (_named: any) {
    return Functions.prototype['Params'].call(this);
};
(Functions.prototype['Params'] as any).$callAt = function (args: SuObject) {
    return (Functions.prototype['Params'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Functions.prototype['Params'] as any).$params = '';
//GENERATED end
