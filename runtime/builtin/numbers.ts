import { SuNum, RoundingMode } from "../sunum";
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
function int(n: Num, trunc: boolean = false): number {
    if (n instanceof SuNum)
        return n.toInt(trunc);
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
        return int(n, true);
    }

    Hex(this: Num): string {
        maxargs(0, arguments.length);
        return int(this).toString(16);
    }

    Format(this: Num, mask: string): string {
        maxargs(1, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n : SuNum.make(n);
        return n.format(mask);
    }

    Frac(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        if (n instanceof SuNum)
            return n.frac();
        if (Number.isSafeInteger(n))
            return SuNum.ZERO;
        throw new Error("not safe integer: " + n);
    }

    Round(this: Num, num: Num): SuNum {
        maxargs(1, arguments.length);
        return round(this, num, RoundingMode.HALF_UP);
    }

    RoundDown(this: Num, num: Num): SuNum {
        maxargs(1, arguments.length);
        return round(this, num, RoundingMode.DOWN);
    }

    RoundUp(this: Num, num: Num): SuNum {
        maxargs(1, arguments.length);
        return round(this, num, RoundingMode.UP);
    }

    Log10(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n : SuNum.make(n);
        return SuNum.log10(n);
    }
}

function round(n: Num, num: Num, mode: RoundingMode): SuNum {
    num = int(num, true);
    n = (n instanceof SuNum) ? n : SuNum.make(n);
    return n.round(num, mode);
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

//BUILTIN Numbers.Round(digits)
//GENERATED start
(Numbers.prototype['Round'] as any).$call = Numbers.prototype['Round'];
(Numbers.prototype['Round'] as any).$callNamed = function ($named: any, digits: any) {
    ({ digits = digits } = $named);
    return Numbers.prototype['Round'].call(this, digits);
};
(Numbers.prototype['Round'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Round'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Round'] as any).$params = 'digits';
//GENERATED end

//BUILTIN Numbers.RoundDown(digits)
//GENERATED start
(Numbers.prototype['RoundDown'] as any).$call = Numbers.prototype['RoundDown'];
(Numbers.prototype['RoundDown'] as any).$callNamed = function ($named: any, digits: any) {
    ({ digits = digits } = $named);
    return Numbers.prototype['RoundDown'].call(this, digits);
};
(Numbers.prototype['RoundDown'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['RoundDown'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['RoundDown'] as any).$params = 'digits';
//GENERATED end

//BUILTIN Numbers.RoundUp(digits)
//GENERATED start
(Numbers.prototype['RoundUp'] as any).$call = Numbers.prototype['RoundUp'];
(Numbers.prototype['RoundUp'] as any).$callNamed = function ($named: any, digits: any) {
    ({ digits = digits } = $named);
    return Numbers.prototype['RoundUp'].call(this, digits);
};
(Numbers.prototype['RoundUp'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['RoundUp'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['RoundUp'] as any).$params = 'digits';
//GENERATED end

//BUILTIN Numbers.Log10()
//GENERATED start
(Numbers.prototype['Log10'] as any).$call = Numbers.prototype['Log10'];
(Numbers.prototype['Log10'] as any).$callNamed = function (_named: any) {
    return Numbers.prototype['Log10'].call(this);
};
(Numbers.prototype['Log10'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Log10'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Log10'] as any).$params = '';
//GENERATED end
