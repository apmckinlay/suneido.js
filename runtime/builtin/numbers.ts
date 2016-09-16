import { SuNum } from "../sunum";
import { SuObject } from "../suobject";
import * as util from "../utility";
import { maxargs } from "../args";

type Num = number | SuNum;

export function su_numberq(x: any): boolean {
    return typeof x === 'number' || x instanceof SuNum;
}
//BUILTIN Number?(value)
//GENERATED start
(su_numberq as any).$call = su_numberq;
(su_numberq as any).$callNamed = function ($named: any, value: any) {
    ({ value = value } = $named);
    return su_numberq(value);
};
(su_numberq as any).$callAt = function (args: SuObject) {
    return (su_numberq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_numberq as any).$params = 'value';
//GENERATED end
//
function int(n: Num): number {
    return n instanceof SuNum ? n.toInt() : n;
}

export class Numbers {

    Chr(this: Num): string {
        maxargs(0, arguments.length);
        return String.fromCharCode(int(this));
    }

    Int(this: Num): number {
        maxargs(0, arguments.length);
        return int(this);
    }

    Hex(this: Num): string {
        maxargs(0, arguments.length);
        return int(this).toString(16);
    }

}

//BUILTIN Numbers.Chr()
//GENERATED start
(Numbers.prototype['Chr'] as any).$call = Numbers.prototype['Chr'];
(Numbers.prototype['Chr'] as any).$callNamed = function (_named: any) {
    return Numbers.prototype['Chr'].call(this);
};
(Numbers.prototype['Chr'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Chr'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Chr'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Int()
//GENERATED start
(Numbers.prototype['Int'] as any).$call = Numbers.prototype['Int'];
(Numbers.prototype['Int'] as any).$callNamed = function (_named: any) {
    return Numbers.prototype['Int'].call(this);
};
(Numbers.prototype['Int'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Int'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Int'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Hex()
//GENERATED start
(Numbers.prototype['Hex'] as any).$call = Numbers.prototype['Hex'];
(Numbers.prototype['Hex'] as any).$callNamed = function (_named: any) {
    return Numbers.prototype['Hex'].call(this);
};
(Numbers.prototype['Hex'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Hex'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Hex'] as any).$params = '';
//GENERATED end
