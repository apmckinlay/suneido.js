import { SuNum, RoundingMode } from "../sunum";
import { SuObject } from "../suobject";
import * as util from "../utility";
import { maxargs } from "../args";
import { isString } from "../ops";
import { type } from "../type";

type Num = number | SuNum;

export function su_numberq(x: any): boolean {
    return typeof x === 'number' || x instanceof SuNum;
}
//BUILTIN Number?(value)
//GENERATED start
(su_numberq as any).$call = su_numberq;
(su_numberq as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_numberq(value);
};
(su_numberq as any).$callAt = function (args: SuObject) {
    return (su_numberq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_numberq as any).$params = 'value';
//GENERATED end

export function su_number(x: any) {
    maxargs(1, arguments.length);
    if (isString(x)) {
        let s: string = x.toString();
        s = s.trim();
        if (s === '') {
            return SuNum.ZERO;
        }
        s = s.replace(/[,_]/g, '');
        try {
            if (s.startsWith('0x')) {
                let int = parseInt(s);
                if (!isNaN(int)) {
                    return int;
                }
            }
            let res = SuNum.parse(s);
            if (res !== null) {
                return res;
            }
        } catch (e) {}
    } else if (su_numberq(x)) {
        return x;
    } else if (x === false) {
        return SuNum.ZERO;
    }
    throw new Error("can't convert " + type(x) + " to number");
}
//BUILTIN Number(value)
//GENERATED start
(su_number as any).$call = su_number;
(su_number as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_number(value);
};
(su_number as any).$callAt = function (args: SuObject) {
    return (su_number as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_number as any).$params = 'value';
//GENERATED end

export function su_max(args: SuObject): any {
    return args.Max();
}

export function su_min(args: SuObject): any {
    return args.Min();
}

//BUILTIN Max(@args) 
//GENERATED start
(su_max as any).$callAt = su_max;
(su_max as any).$call = function (...args: any[]) {
    return su_max(new SuObject(args));
};
(su_max as any).$callNamed = function (named: any, ...args: any[]) {
    return su_max(new SuObject(args, util.obToMap(named)));
};
(su_max as any).$params = '@args';
//GENERATED end

//BUILTIN Min(@args)
//GENERATED start
(su_min as any).$callAt = su_min;
(su_min as any).$call = function (...args: any[]) {
    return su_min(new SuObject(args));
};
(su_min as any).$callNamed = function (named: any, ...args: any[]) {
    return su_min(new SuObject(args, util.obToMap(named)));
};
(su_min as any).$params = '@args';
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

    Log(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n : SuNum.make(n);
        return SuNum.log(n);
    }

    Pow(this: Num, num: Num): SuNum {
        maxargs(1, arguments.length);
        let n = this;
        let base = n instanceof SuNum ? n.toNumber() : n;
        let exponent = num instanceof SuNum ? num.toNumber() : num;
        return SuNum.pow(base, exponent);
    }

    Sin(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.sin(n);
    }

    ASin(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.aSin(n);
    }

    Cos(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.cos(n);
    }

    ACos(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.aCos(n);
    }

    Tan(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.tan(n);
    }

    ATan(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.aTan(n);
    }

    Exp(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.exp(n);
    }

    Sqrt(this: Num): SuNum {
        maxargs(0, arguments.length);
        let n = this;
        n = (n instanceof SuNum) ? n.toNumber() : n;
        return SuNum.sqrt(n);
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
    maxargs(1, arguments.length);
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
    maxargs(1, arguments.length);
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
    maxargs(1, arguments.length);
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
    maxargs(2, arguments.length);
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
    maxargs(1, arguments.length);
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
    maxargs(2, arguments.length);
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
    maxargs(2, arguments.length);
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
    maxargs(2, arguments.length);
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
    maxargs(1, arguments.length);
    return Numbers.prototype['Log10'].call(this);
};
(Numbers.prototype['Log10'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Log10'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Log10'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Log()
//GENERATED start
(Numbers.prototype['Log'] as any).$call = Numbers.prototype['Log'];
(Numbers.prototype['Log'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['Log'].call(this);
};
(Numbers.prototype['Log'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Log'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Log'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Pow(exponent)
//GENERATED start
(Numbers.prototype['Pow'] as any).$call = Numbers.prototype['Pow'];
(Numbers.prototype['Pow'] as any).$callNamed = function ($named: any, exponent: any) {
    maxargs(2, arguments.length);
    ({ exponent = exponent } = $named);
    return Numbers.prototype['Pow'].call(this, exponent);
};
(Numbers.prototype['Pow'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Pow'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Pow'] as any).$params = 'exponent';
//GENERATED end

//BUILTIN Numbers.Sin()
//GENERATED start
(Numbers.prototype['Sin'] as any).$call = Numbers.prototype['Sin'];
(Numbers.prototype['Sin'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['Sin'].call(this);
};
(Numbers.prototype['Sin'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Sin'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Sin'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.ASin()
//GENERATED start
(Numbers.prototype['ASin'] as any).$call = Numbers.prototype['ASin'];
(Numbers.prototype['ASin'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['ASin'].call(this);
};
(Numbers.prototype['ASin'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['ASin'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['ASin'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Cos()
//GENERATED start
(Numbers.prototype['Cos'] as any).$call = Numbers.prototype['Cos'];
(Numbers.prototype['Cos'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['Cos'].call(this);
};
(Numbers.prototype['Cos'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Cos'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Cos'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.ACos()
//GENERATED start
(Numbers.prototype['ACos'] as any).$call = Numbers.prototype['ACos'];
(Numbers.prototype['ACos'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['ACos'].call(this);
};
(Numbers.prototype['ACos'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['ACos'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['ACos'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Tan()
//GENERATED start
(Numbers.prototype['Tan'] as any).$call = Numbers.prototype['Tan'];
(Numbers.prototype['Tan'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['Tan'].call(this);
};
(Numbers.prototype['Tan'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Tan'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Tan'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.ATan()
//GENERATED start
(Numbers.prototype['ATan'] as any).$call = Numbers.prototype['ATan'];
(Numbers.prototype['ATan'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['ATan'].call(this);
};
(Numbers.prototype['ATan'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['ATan'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['ATan'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Exp()
//GENERATED start
(Numbers.prototype['Exp'] as any).$call = Numbers.prototype['Exp'];
(Numbers.prototype['Exp'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['Exp'].call(this);
};
(Numbers.prototype['Exp'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Exp'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Exp'] as any).$params = '';
//GENERATED end

//BUILTIN Numbers.Sqrt()
//GENERATED start
(Numbers.prototype['Sqrt'] as any).$call = Numbers.prototype['Sqrt'];
(Numbers.prototype['Sqrt'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Numbers.prototype['Sqrt'].call(this);
};
(Numbers.prototype['Sqrt'] as any).$callAt = function (args: SuObject) {
    return (Numbers.prototype['Sqrt'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Numbers.prototype['Sqrt'] as any).$params = '';
//GENERATED end
