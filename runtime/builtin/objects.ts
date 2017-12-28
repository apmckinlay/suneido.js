import { SuObject, ObjectIter } from '../suobject';
import * as util from '../utility';
import { mandatory, maxargs } from "../args";

export function su_object(args: SuObject) {
    return args;
}
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

//BUILTIN SuObject.Copy()
//GENERATED start
(SuObject.prototype['Copy'] as any).$call = SuObject.prototype['Copy'];
(SuObject.prototype['Copy'] as any).$callNamed = function (_named: any) {
    return SuObject.prototype['Copy'].call(this);
};
(SuObject.prototype['Copy'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Copy'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Copy'] as any).$params = '';
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

//BUILTIN SuObject.GetDefault(key, value)
//GENERATED start
(SuObject.prototype['GetDefault'] as any).$call = SuObject.prototype['GetDefault'];
(SuObject.prototype['GetDefault'] as any).$callNamed = function ($named: any, key: any, value: any) {
    ({ key = key, value = value } = $named);
    return SuObject.prototype['GetDefault'].call(this, key, value);
};
(SuObject.prototype['GetDefault'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['GetDefault'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['GetDefault'] as any).$params = 'key, value';
//GENERATED end

//BUILTIN SuObject.Find(value)
//GENERATED start
(SuObject.prototype['Find'] as any).$call = SuObject.prototype['Find'];
(SuObject.prototype['Find'] as any).$callNamed = function ($named: any, value: any) {
    ({ value = value } = $named);
    return SuObject.prototype['Find'].call(this, value);
};
(SuObject.prototype['Find'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Find'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Find'] as any).$params = 'value';
//GENERATED end

//BUILTIN SuObject.Member?(key)
//GENERATED start
(SuObject.prototype['Member?'] as any).$call = SuObject.prototype['Member?'];
(SuObject.prototype['Member?'] as any).$callNamed = function ($named: any, key: any) {
    ({ key = key } = $named);
    return SuObject.prototype['Member?'].call(this, key);
};
(SuObject.prototype['Member?'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Member?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Member?'] as any).$params = 'key';
//GENERATED end

//BUILTIN SuObject.Members(list=false, named=false)
//GENERATED start
(SuObject.prototype['Members'] as any).$call = SuObject.prototype['Members'];
(SuObject.prototype['Members'] as any).$callNamed = function ($named: any, list: any, named: any) {
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Members'].call(this, list, named);
};
(SuObject.prototype['Members'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Members'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Members'] as any).$params = 'list=false, named=false';
//GENERATED end

//BUILTIN SuObject.Delete(@args)
//GENERATED start
(SuObject.prototype['Delete'] as any).$callAt = SuObject.prototype['Delete'];
(SuObject.prototype['Delete'] as any).$call = function (...args: any[]) {
    return SuObject.prototype['Delete'].call(this, new SuObject(args));
};
(SuObject.prototype['Delete'] as any).$callNamed = function (named: any, ...args: any[]) {
    return SuObject.prototype['Delete'].call(this, new SuObject(args, util.obToMap(named)));
};
(SuObject.prototype['Delete'] as any).$params = '@args';
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

//BUILTIN SuObject.Sort!(lt)
//GENERATED start
(SuObject.prototype['Sort!'] as any).$call = SuObject.prototype['Sort!'];
(SuObject.prototype['Sort!'] as any).$callNamed = function ($named: any, lt: any) {
    ({ lt = lt } = $named);
    return SuObject.prototype['Sort!'].call(this, lt);
};
(SuObject.prototype['Sort!'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Sort!'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Sort!'] as any).$params = 'lt';
//GENERATED end

//BUILTIN SuObject.Iter()
//GENERATED start
(SuObject.prototype['Iter'] as any).$call = SuObject.prototype['Iter'];
(SuObject.prototype['Iter'] as any).$callNamed = function (_named: any) {
    return SuObject.prototype['Iter'].call(this);
};
(SuObject.prototype['Iter'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Iter'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Iter'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Join(separator="")
//GENERATED start
(SuObject.prototype['Join'] as any).$call = SuObject.prototype['Join'];
(SuObject.prototype['Join'] as any).$callNamed = function ($named: any, separator: any) {
    ({ separator = separator } = $named);
    return SuObject.prototype['Join'].call(this, separator);
};
(SuObject.prototype['Join'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Join'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Join'] as any).$params = 'separator=""';
//GENERATED end

//BUILTIN ObjectIter.Next()
//GENERATED start
(ObjectIter.prototype['Next'] as any).$call = ObjectIter.prototype['Next'];
(ObjectIter.prototype['Next'] as any).$callNamed = function (_named: any) {
    return ObjectIter.prototype['Next'].call(this);
};
(ObjectIter.prototype['Next'] as any).$callAt = function (args: SuObject) {
    return (ObjectIter.prototype['Next'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(ObjectIter.prototype['Next'] as any).$params = '';
//GENERATED end

//BUILTIN ObjectIter.Dup()
//GENERATED start
(ObjectIter.prototype['Dup'] as any).$call = ObjectIter.prototype['Dup'];
(ObjectIter.prototype['Dup'] as any).$callNamed = function (_named: any) {
    return ObjectIter.prototype['Dup'].call(this);
};
(ObjectIter.prototype['Dup'] as any).$callAt = function (args: SuObject) {
    return (ObjectIter.prototype['Dup'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(ObjectIter.prototype['Dup'] as any).$params = '';
//GENERATED end

//BUILTIN ObjectIter.Infinite?()
//GENERATED start
(ObjectIter.prototype['Infinite?'] as any).$call = ObjectIter.prototype['Infinite?'];
(ObjectIter.prototype['Infinite?'] as any).$callNamed = function (_named: any) {
    return ObjectIter.prototype['Infinite?'].call(this);
};
(ObjectIter.prototype['Infinite?'] as any).$callAt = function (args: SuObject) {
    return (ObjectIter.prototype['Infinite?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(ObjectIter.prototype['Infinite?'] as any).$params = '';
//GENERATED end
