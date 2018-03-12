import { SuRecord } from '../surecord';
import * as util from '../utility';
import { mandatory, maxargs } from "../args";
import { SuObject } from '../suobject';

export function su_record(args: SuObject) {
    return SuRecord.mkRecord(args);
}

//BUILTIN Record(@args)
//GENERATED start
(su_record as any).$callAt = su_record;
(su_record as any).$call = function (...args: any[]) {
    return su_record(new SuObject(args));
};
(su_record as any).$callNamed = function (named: any, ...args: any[]) {
    return su_record(new SuObject(args, util.obToMap(named)));
};
(su_record as any).$params = '@args';
//GENERATED end

export function su_recordq(x: any = mandatory()): boolean {
    maxargs(1, arguments.length);
    return x instanceof SuRecord;
}

//BUILTIN Record?(x)
//GENERATED start
(su_recordq as any).$call = su_recordq;
(su_recordq as any).$callNamed = function ($named: any, x: any) {
    ({ x = x } = $named);
    return su_recordq(x);
};
(su_recordq as any).$callAt = function (args: SuObject) {
    return (su_recordq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_recordq as any).$params = 'x';
//GENERATED end

//BUILTIN SuRecord.Clear()
//GENERATED start
(SuRecord.prototype['Clear'] as any).$call = SuRecord.prototype['Clear'];
(SuRecord.prototype['Clear'] as any).$callNamed = function (_named: any) {
    return SuRecord.prototype['Clear'].call(this);
};
(SuRecord.prototype['Clear'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['Clear'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['Clear'] as any).$params = '';
//GENERATED end

//BUILTIN SuRecord.Copy()
//GENERATED start
(SuRecord.prototype['Copy'] as any).$call = SuRecord.prototype['Copy'];
(SuRecord.prototype['Copy'] as any).$callNamed = function (_named: any) {
    return SuRecord.prototype['Copy'].call(this);
};
(SuRecord.prototype['Copy'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['Copy'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['Copy'] as any).$params = '';
//GENERATED end

//BUILTIN SuRecord.Invalidate(@members)
//GENERATED start
(SuRecord.prototype['Invalidate'] as any).$callAt = SuRecord.prototype['Invalidate'];
(SuRecord.prototype['Invalidate'] as any).$call = function (...args: any[]) {
    return SuRecord.prototype['Invalidate'].call(this, new SuObject(args));
};
(SuRecord.prototype['Invalidate'] as any).$callNamed = function (named: any, ...args: any[]) {
    return SuRecord.prototype['Invalidate'].call(this, new SuObject(args, util.obToMap(named)));
};
(SuRecord.prototype['Invalidate'] as any).$params = '@members';
//GENERATED end

//BUILTIN SuRecord.New?()
//GENERATED start
(SuRecord.prototype['New?'] as any).$call = SuRecord.prototype['New?'];
(SuRecord.prototype['New?'] as any).$callNamed = function (_named: any) {
    return SuRecord.prototype['New?'].call(this);
};
(SuRecord.prototype['New?'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['New?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['New?'] as any).$params = '';
//GENERATED end

//BUILTIN SuRecord.Observer(observer)
//GENERATED start
(SuRecord.prototype['Observer'] as any).$call = SuRecord.prototype['Observer'];
(SuRecord.prototype['Observer'] as any).$callNamed = function ($named: any, observer: any) {
    ({ observer = observer } = $named);
    return SuRecord.prototype['Observer'].call(this, observer);
};
(SuRecord.prototype['Observer'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['Observer'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['Observer'] as any).$params = 'observer';
//GENERATED end

//BUILTIN SuRecord.PreSet(field, value)
//GENERATED start
(SuRecord.prototype['PreSet'] as any).$call = SuRecord.prototype['PreSet'];
(SuRecord.prototype['PreSet'] as any).$callNamed = function ($named: any, field: any, value: any) {
    ({ field = field, value = value } = $named);
    return SuRecord.prototype['PreSet'].call(this, field, value);
};
(SuRecord.prototype['PreSet'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['PreSet'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['PreSet'] as any).$params = 'field, value';
//GENERATED end

//BUILTIN SuRecord.RemoveObserver(observer)
//GENERATED start
(SuRecord.prototype['RemoveObserver'] as any).$call = SuRecord.prototype['RemoveObserver'];
(SuRecord.prototype['RemoveObserver'] as any).$callNamed = function ($named: any, observer: any) {
    ({ observer = observer } = $named);
    return SuRecord.prototype['RemoveObserver'].call(this, observer);
};
(SuRecord.prototype['RemoveObserver'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['RemoveObserver'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['RemoveObserver'] as any).$params = 'observer';
//GENERATED end

//BUILTIN SuRecord.SetDeps(field, string)
//GENERATED start
(SuRecord.prototype['SetDeps'] as any).$call = SuRecord.prototype['SetDeps'];
(SuRecord.prototype['SetDeps'] as any).$callNamed = function ($named: any, field: any, string: any) {
    ({ field = field, string = string } = $named);
    return SuRecord.prototype['SetDeps'].call(this, field, string);
};
(SuRecord.prototype['SetDeps'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['SetDeps'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['SetDeps'] as any).$params = 'field, string';
//GENERATED end

//BUILTIN SuRecord.AttachRule(field, rule)
//GENERATED start
(SuRecord.prototype['AttachRule'] as any).$call = SuRecord.prototype['AttachRule'];
(SuRecord.prototype['AttachRule'] as any).$callNamed = function ($named: any, field: any, rule: any) {
    ({ field = field, rule = rule } = $named);
    return SuRecord.prototype['AttachRule'].call(this, field, rule);
};
(SuRecord.prototype['AttachRule'] as any).$callAt = function (args: SuObject) {
    return (SuRecord.prototype['AttachRule'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuRecord.prototype['AttachRule'] as any).$params = 'field, rule';
//GENERATED end
