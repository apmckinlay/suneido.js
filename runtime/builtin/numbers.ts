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

// round to integer
function int(n: Num): number {
    if (n instanceof SuNum)
        return n.toInt();
    if (Number.isSafeInteger(n))
        return n;
    throw new Error("not safe integer: " + n);
}

export class Numbers {

    Chr(this: Num): string {
        maxargs(0, arguments.length);
        return String.fromCharCode(int(this));
    }

    // truncate fractional part, no rounding
    Int(this: Num): number {
        maxargs(0, arguments.length);
        let n = this; // need this to satisfy type checking with TypeScript 2.0.2
        if (n instanceof SuNum)
            return n.toInt(true); // truncate
        if (Number.isSafeInteger(n))
            return n;
        throw new Error("not safe integer: " + n);
    }

    Hex(this: Num): string {
        maxargs(0, arguments.length);
        return int(this).toString(16);
    }

    Format(this: Num, mask: string): string {
        maxargs(1, arguments.length);
        let value = this;
        let n = (value instanceof SuNum)
            ? value
            : SuNum.fromNumber(value);
        return n.format(mask);
    }

    Frac(this: Num): number {
        maxargs(0, arguments.length);
        // see: http://cwestblog.com/2014/02/26/javascript-fractional-part-of-a-number/
        let frac = function(num: Num): number {
            let regx = /(-?)(\d+(\.?)\d*)e(.+)/;
            return +(num).toExponential().replace(regx, (m: string, neg, num, dot, offset) => {
                let zeroes = Array(Math.abs(offset) + 2).join('0');
                let nums = (zeroes + num + (dot ? '' : '.') + zeroes).split('.');
                return neg + '.' + nums.join('').slice(+offset + nums[0].length);
            });
        };
        let n = this;
        if (n instanceof SuNum && n.isInt())
            return 0;
        return frac(n);
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

//BUILTIN Numbers.Format(mask)
//GENERATED start
(Numbers.prototype['Format'] as any).$call = Numbers.prototype['Format'];
(Numbers.prototype['Format'] as any).$callNamed = function ($named: any, mask: any) {
    ({ mask = mask } = $named);
    return Numbers.prototype['Format'].call(this, mask);
};
(Numbers.prototype['Format'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Format'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Format'] as any).$params = 'mask';
//GENERATED end

//BUILTIN Numbers.Frac()
//GENERATED start
(Numbers.prototype['Frac'] as any).$call = Numbers.prototype['Frac'];
(Numbers.prototype['Frac'] as any).$callNamed = function (_named: any) {
    return Numbers.prototype['Frac'].call(this);
};
(Numbers.prototype['Frac'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Frac'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Frac'] as any).$params = '';
//GENERATED end
