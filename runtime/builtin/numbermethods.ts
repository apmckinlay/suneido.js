import { Dnum } from "../dnum";
import { SuObject } from "../suobject";
import * as util from "../utility";

type Num = number | Dnum;

function int(n: Num): number {
    return n instanceof Dnum ? n.toInt() : n;
}

export class NumberMethods {

    Chr(this: Num): string {
        return String.fromCharCode(int(this));
    }

    Int(this: Num): number {
        return int(this);
    }

    Hex(this: Num): string {
        return int(this).toString(16);
    }

}

//BUILTIN NumberMethods.Chr()
//GENERATED start
(NumberMethods.prototype['Chr'] as any).$call = NumberMethods.prototype['Chr'];
(NumberMethods.prototype['Chr'] as any).$callNamed = function (_named: any) {
    return NumberMethods.prototype['Chr'].call(this);
};
(NumberMethods.prototype['Chr'] as any).$callAt = function (args: SuObject) {
    return (NumberMethods.prototype['Chr'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(NumberMethods.prototype['Chr'] as any).$params = '';
//GENERATED end

//BUILTIN NumberMethods.Int()
//GENERATED start
(NumberMethods.prototype['Int'] as any).$call = NumberMethods.prototype['Int'];
(NumberMethods.prototype['Int'] as any).$callNamed = function (_named: any) {
    return NumberMethods.prototype['Int'].call(this);
};
(NumberMethods.prototype['Int'] as any).$callAt = function (args: SuObject) {
    return (NumberMethods.prototype['Int'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(NumberMethods.prototype['Int'] as any).$params = '';
//GENERATED end

//BUILTIN NumberMethods.Hex()
//GENERATED start
(NumberMethods.prototype['Hex'] as any).$call = NumberMethods.prototype['Hex'];
(NumberMethods.prototype['Hex'] as any).$callNamed = function (_named: any) {
    return NumberMethods.prototype['Hex'].call(this);
};
(NumberMethods.prototype['Hex'] as any).$callAt = function (args: SuObject) {
    return (NumberMethods.prototype['Hex'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(NumberMethods.prototype['Hex'] as any).$params = '';
//GENERATED end
