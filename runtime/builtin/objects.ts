import { SuObject } from '../suobject';
import * as util from '../utility';
import { mandatory, maxargs } from "../args";

export function su_object(args: SuObject) {
    return args;
};
//BUILTIN Object(@args)
//GENERATED start
(su_object as any).$callAt = su_object;
(su_object as any).$call = function (...args: any[]) {
    return su_object(new SuObject(args));
};
(su_object as any).$callNamed = function (named: any, ...args: any[]) {
    return su_object(new SuObject(args, util.obToMap(named)));
};
(su_object as any).$params = '@args';
//GENERATED end

export function su_objectq(x: any = mandatory()): boolean {
    maxargs(1, arguments.length);
    return x instanceof SuObject;
}
//BUILTIN Object?(x)
//GENERATED start
(su_objectq as any).$call = su_objectq;
(su_objectq as any).$callNamed = function ($named: any, x: any) {
    ({ x = x } = $named);
    return su_objectq(x);
};
(su_objectq as any).$callAt = function (args: SuObject) {
    return (su_objectq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_objectq as any).$params = 'x';
//GENERATED end

//BUILTIN SuObject.Size(list=false, named=false)
//GENERATED start
(SuObject.prototype['Size'] as any).$call = SuObject.prototype['Size'];
(SuObject.prototype['Size'] as any).$callNamed = function ($named: any, list: any, named: any) {
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Size'].call(this, list, named);
};
(SuObject.prototype['Size'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Size'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Size'] as any).$params = 'list=false, named=false';
//GENERATED end

//BUILTIN SuObject.Add(x)
//GENERATED start
(SuObject.prototype['Add'] as any).$call = SuObject.prototype['Add'];
(SuObject.prototype['Add'] as any).$callNamed = function ($named: any, x: any) {
    ({ x = x } = $named);
    return SuObject.prototype['Add'].call(this, x);
};
(SuObject.prototype['Add'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Add'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Add'] as any).$params = 'x';
//GENERATED end

//BUILTIN SuObject.Set_readonly()
//GENERATED start
(SuObject.prototype['Set_readonly'] as any).$call = SuObject.prototype['Set_readonly'];
(SuObject.prototype['Set_readonly'] as any).$callNamed = function (_named: any) {
    return SuObject.prototype['Set_readonly'].call(this);
};
(SuObject.prototype['Set_readonly'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Set_readonly'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Set_readonly'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Set_default(value=null)
//GENERATED start
(SuObject.prototype['Set_default'] as any).$call = SuObject.prototype['Set_default'];
(SuObject.prototype['Set_default'] as any).$callNamed = function ($named: any, value: any) {
    ({ value = value } = $named);
    return SuObject.prototype['Set_default'].call(this, value);
};
(SuObject.prototype['Set_default'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Set_default'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Set_default'] as any).$params = 'value=null';
//GENERATED end

//BUILTIN SuObject.Slice(i, n=99999)
//GENERATED start
(SuObject.prototype['Slice'] as any).$call = SuObject.prototype['Slice'];
(SuObject.prototype['Slice'] as any).$callNamed = function ($named: any, i: any, n: any) {
    ({ i = i, n = n } = $named);
    return SuObject.prototype['Slice'].call(this, i, n);
};
(SuObject.prototype['Slice'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Slice'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Slice'] as any).$params = 'i, n=99999';
//GENERATED end
