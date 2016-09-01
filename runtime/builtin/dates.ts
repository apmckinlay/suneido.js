import { SuDate } from "../sudate";
import * as util from "../utility";
import { SuObject } from "../suobject";
import { mandatory, maxargs } from "../args";

export function su_dateq(x: any = mandatory()): boolean {
    maxargs(1, arguments.length);
    return x instanceof SuDate;
}
//BUILTIN Date?(x)
//GENERATED start
(su_dateq as any).$call = su_dateq;
(su_dateq as any).$callNamed = function ($named: any, x: any) {
    ({ x = x } = $named);
    return su_dateq(x);
};
(su_dateq as any).$callAt = function (args: SuObject) {
    return (su_dateq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_dateq as any).$params = 'x';
//GENERATED end

//TODO constructor args
export function su_date() {
    return SuDate.now();
}
(su_date as any).Begin = su_begin;
(su_date as any).End = su_end;

//BUILTIN Date()
//GENERATED start
(su_date as any).$call = su_date;
(su_date as any).$callNamed = function (_named: any) {
    return su_date();
};
(su_date as any).$callAt = function (args: SuObject) {
    return (su_date as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_date as any).$params = '';
//GENERATED end

const BEGIN = SuDate.literal('17000101')!;
const END = SuDate.literal('30000101')!;

function su_begin(): SuDate {
    maxargs(1, arguments.length);
    return BEGIN;
}
//BUILTIN Begin()
//GENERATED start
(su_begin as any).$call = su_begin;
(su_begin as any).$callNamed = function (_named: any) {
    return su_begin();
};
(su_begin as any).$callAt = function (args: SuObject) {
    return (su_begin as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_begin as any).$params = '';
//GENERATED end

function su_end(): SuDate {
    maxargs(1, arguments.length);
    return END;
}
//BUILTIN End()
//GENERATED start
(su_end as any).$call = su_end;
(su_end as any).$callNamed = function (_named: any) {
    return su_end();
};
(su_end as any).$callAt = function (args: SuObject) {
    return (su_end as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_end as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Year()
//GENERATED start
(SuDate.prototype['Year'] as any).$call = SuDate.prototype['Year'];
(SuDate.prototype['Year'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Year'].call(this);
};
(SuDate.prototype['Year'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Year'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Year'] as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Month()
//GENERATED start
(SuDate.prototype['Month'] as any).$call = SuDate.prototype['Month'];
(SuDate.prototype['Month'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Month'].call(this);
};
(SuDate.prototype['Month'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Month'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Month'] as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Day()
//GENERATED start
(SuDate.prototype['Day'] as any).$call = SuDate.prototype['Day'];
(SuDate.prototype['Day'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Day'].call(this);
};
(SuDate.prototype['Day'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Day'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Day'] as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Hour()
//GENERATED start
(SuDate.prototype['Hour'] as any).$call = SuDate.prototype['Hour'];
(SuDate.prototype['Hour'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Hour'].call(this);
};
(SuDate.prototype['Hour'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Hour'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Hour'] as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Minute()
//GENERATED start
(SuDate.prototype['Minute'] as any).$call = SuDate.prototype['Minute'];
(SuDate.prototype['Minute'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Minute'].call(this);
};
(SuDate.prototype['Minute'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Minute'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Minute'] as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Second()
//GENERATED start
(SuDate.prototype['Second'] as any).$call = SuDate.prototype['Second'];
(SuDate.prototype['Second'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Second'].call(this);
};
(SuDate.prototype['Second'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Second'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Second'] as any).$params = '';
//GENERATED end

//BUILTIN SuDate.Millisecond()
//GENERATED start
(SuDate.prototype['Millisecond'] as any).$call = SuDate.prototype['Millisecond'];
(SuDate.prototype['Millisecond'] as any).$callNamed = function (_named: any) {
    return SuDate.prototype['Millisecond'].call(this);
};
(SuDate.prototype['Millisecond'] as any).$callAt = function (args: SuObject) {
    return (SuDate.prototype['Millisecond'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuDate.prototype['Millisecond'] as any).$params = '';
//GENERATED end
