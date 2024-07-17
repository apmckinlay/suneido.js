import { SuObject, ObjectIter } from '../suobject';
import * as util from '../utility';
import { mandatory, maxargs } from "../args";
import { SuValue } from '../suvalue';

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
(su_object as any).$callableType = "BUILTIN";
(su_object as any).$callableName = "Object";
(su_object as any).$params = '@args';
//GENERATED end

export function su_objectq(x: any = mandatory()): boolean {
    maxargs(1, arguments.length);
    return x instanceof SuValue && x.toObject() !== null;
}
//BUILTIN Object?(x)
//GENERATED start
(su_objectq as any).$call = su_objectq;
(su_objectq as any).$callNamed = function ($named: any, x: any) {
    maxargs(2, arguments.length);
    ({ x = x } = $named);
    return su_objectq(x);
};
(su_objectq as any).$callAt = function (args: SuObject) {
    return (su_objectq as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_objectq as any).$callableType = "BUILTIN";
(su_objectq as any).$callableName = "Object?";
(su_objectq as any).$params = 'x';
//GENERATED end

//BUILTIN SuObject.Copy()
//GENERATED start
(SuObject.prototype['Copy'] as any).$call = SuObject.prototype['Copy'];
(SuObject.prototype['Copy'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Copy'].call(this);
};
(SuObject.prototype['Copy'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Copy'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Copy'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Copy'] as any).$callableName = "SuObject#Copy";
(SuObject.prototype['Copy'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Min()
//GENERATED start
(SuObject.prototype['Min'] as any).$call = SuObject.prototype['Min'];
(SuObject.prototype['Min'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Min'].call(this);
};
(SuObject.prototype['Min'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Min'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Min'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Min'] as any).$callableName = "SuObject#Min";
(SuObject.prototype['Min'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Max()
//GENERATED start
(SuObject.prototype['Max'] as any).$call = SuObject.prototype['Max'];
(SuObject.prototype['Max'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Max'].call(this);
};
(SuObject.prototype['Max'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Max'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Max'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Max'] as any).$callableName = "SuObject#Max";
(SuObject.prototype['Max'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Size(list=false, named=false)
//GENERATED start
(SuObject.prototype['Size'] as any).$call = SuObject.prototype['Size'];
(SuObject.prototype['Size'] as any).$callNamed = function ($named: any, list: any, named: any) {
    maxargs(3, arguments.length);
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Size'].call(this, list, named);
};
(SuObject.prototype['Size'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Size'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Size'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Size'] as any).$callableName = "SuObject#Size";
(SuObject.prototype['Size'] as any).$params = 'list=false, named=false';
//GENERATED end

//BUILTIN SuObject.Add(@args)
//GENERATED start
(SuObject.prototype['Add'] as any).$callAt = SuObject.prototype['Add'];
(SuObject.prototype['Add'] as any).$call = function (...args: any[]) {
    return SuObject.prototype['Add'].call(this, new SuObject(args));
};
(SuObject.prototype['Add'] as any).$callNamed = function (named: any, ...args: any[]) {
    return SuObject.prototype['Add'].call(this, new SuObject(args, util.obToMap(named)));
};
(SuObject.prototype['Add'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Add'] as any).$callableName = "SuObject#Add";
(SuObject.prototype['Add'] as any).$params = '@args';
//GENERATED end

//BUILTIN SuObject.GetDefault(key, value)
//GENERATED start
(SuObject.prototype['GetDefault'] as any).$call = SuObject.prototype['GetDefault'];
(SuObject.prototype['GetDefault'] as any).$callNamed = function ($named: any, key: any, value: any) {
    maxargs(3, arguments.length);
    ({ key = key, value = value } = $named);
    return SuObject.prototype['GetDefault'].call(this, key, value);
};
(SuObject.prototype['GetDefault'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['GetDefault'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['GetDefault'] as any).$callableType = "BUILTIN";
(SuObject.prototype['GetDefault'] as any).$callableName = "SuObject#GetDefault";
(SuObject.prototype['GetDefault'] as any).$params = 'key, value';
//GENERATED end

//BUILTIN SuObject.Find(value)
//GENERATED start
(SuObject.prototype['Find'] as any).$call = SuObject.prototype['Find'];
(SuObject.prototype['Find'] as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return SuObject.prototype['Find'].call(this, value);
};
(SuObject.prototype['Find'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Find'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Find'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Find'] as any).$callableName = "SuObject#Find";
(SuObject.prototype['Find'] as any).$params = 'value';
//GENERATED end

//BUILTIN SuObject.Member?(key)
//GENERATED start
(SuObject.prototype['Member?'] as any).$call = SuObject.prototype['Member?'];
(SuObject.prototype['Member?'] as any).$callNamed = function ($named: any, key: any) {
    maxargs(2, arguments.length);
    ({ key = key } = $named);
    return SuObject.prototype['Member?'].call(this, key);
};
(SuObject.prototype['Member?'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Member?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Member?'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Member?'] as any).$callableName = "SuObject#Member?";
(SuObject.prototype['Member?'] as any).$params = 'key';
//GENERATED end

//BUILTIN SuObject.Members(list=false, named=false)
//GENERATED start
(SuObject.prototype['Members'] as any).$call = SuObject.prototype['Members'];
(SuObject.prototype['Members'] as any).$callNamed = function ($named: any, list: any, named: any) {
    maxargs(3, arguments.length);
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Members'].call(this, list, named);
};
(SuObject.prototype['Members'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Members'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Members'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Members'] as any).$callableName = "SuObject#Members";
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
(SuObject.prototype['Delete'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Delete'] as any).$callableName = "SuObject#Delete";
(SuObject.prototype['Delete'] as any).$params = '@args';
//GENERATED end

//BUILTIN SuObject.Erase(@args)
//GENERATED start
(SuObject.prototype['Erase'] as any).$callAt = SuObject.prototype['Erase'];
(SuObject.prototype['Erase'] as any).$call = function (...args: any[]) {
    return SuObject.prototype['Erase'].call(this, new SuObject(args));
};
(SuObject.prototype['Erase'] as any).$callNamed = function (named: any, ...args: any[]) {
    return SuObject.prototype['Erase'].call(this, new SuObject(args, util.obToMap(named)));
};
(SuObject.prototype['Erase'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Erase'] as any).$callableName = "SuObject#Erase";
(SuObject.prototype['Erase'] as any).$params = '@args';
//GENERATED end

//BUILTIN SuObject.Set_readonly()
//GENERATED start
(SuObject.prototype['Set_readonly'] as any).$call = SuObject.prototype['Set_readonly'];
(SuObject.prototype['Set_readonly'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Set_readonly'].call(this);
};
(SuObject.prototype['Set_readonly'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Set_readonly'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Set_readonly'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Set_readonly'] as any).$callableName = "SuObject#Set_readonly";
(SuObject.prototype['Set_readonly'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Set_default(value=null)
//GENERATED start
(SuObject.prototype['Set_default'] as any).$call = SuObject.prototype['Set_default'];
(SuObject.prototype['Set_default'] as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return SuObject.prototype['Set_default'].call(this, value);
};
(SuObject.prototype['Set_default'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Set_default'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Set_default'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Set_default'] as any).$callableName = "SuObject#Set_default";
(SuObject.prototype['Set_default'] as any).$params = 'value=null';
//GENERATED end

//BUILTIN SuObject.Readonly?()
//GENERATED start
(SuObject.prototype['Readonly?'] as any).$call = SuObject.prototype['Readonly?'];
(SuObject.prototype['Readonly?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Readonly?'].call(this);
};
(SuObject.prototype['Readonly?'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Readonly?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Readonly?'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Readonly?'] as any).$callableName = "SuObject#Readonly?";
(SuObject.prototype['Readonly?'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Slice(i, n=99999)
//GENERATED start
(SuObject.prototype['Slice'] as any).$call = SuObject.prototype['Slice'];
(SuObject.prototype['Slice'] as any).$callNamed = function ($named: any, i: any, n: any) {
    maxargs(3, arguments.length);
    ({ i = i, n = n } = $named);
    return SuObject.prototype['Slice'].call(this, i, n);
};
(SuObject.prototype['Slice'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Slice'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Slice'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Slice'] as any).$callableName = "SuObject#Slice";
(SuObject.prototype['Slice'] as any).$params = 'i, n=99999';
//GENERATED end

//BUILTIN SuObject.Sort!(lt)
//GENERATED start
(SuObject.prototype['Sort!'] as any).$call = SuObject.prototype['Sort!'];
(SuObject.prototype['Sort!'] as any).$callNamed = function ($named: any, lt: any) {
    maxargs(2, arguments.length);
    ({ lt = lt } = $named);
    return SuObject.prototype['Sort!'].call(this, lt);
};
(SuObject.prototype['Sort!'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Sort!'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Sort!'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Sort!'] as any).$callableName = "SuObject#Sort!";
(SuObject.prototype['Sort!'] as any).$params = 'lt';
//GENERATED end

//BUILTIN SuObject.LowerBound(value, block=false)
//GENERATED start
(SuObject.prototype['LowerBound'] as any).$call = SuObject.prototype['LowerBound'];
(SuObject.prototype['LowerBound'] as any).$callNamed = function ($named: any, value: any, block: any) {
    maxargs(3, arguments.length);
    ({ value = value, block = block } = $named);
    return SuObject.prototype['LowerBound'].call(this, value, block);
};
(SuObject.prototype['LowerBound'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['LowerBound'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['LowerBound'] as any).$callableType = "BUILTIN";
(SuObject.prototype['LowerBound'] as any).$callableName = "SuObject#LowerBound";
(SuObject.prototype['LowerBound'] as any).$params = 'value, block=false';
//GENERATED end

//BUILTIN SuObject.BinarySearch(value, block=false)
//GENERATED start
(SuObject.prototype['BinarySearch'] as any).$call = SuObject.prototype['BinarySearch'];
(SuObject.prototype['BinarySearch'] as any).$callNamed = function ($named: any, value: any, block: any) {
    maxargs(3, arguments.length);
    ({ value = value, block = block } = $named);
    return SuObject.prototype['BinarySearch'].call(this, value, block);
};
(SuObject.prototype['BinarySearch'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['BinarySearch'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['BinarySearch'] as any).$callableType = "BUILTIN";
(SuObject.prototype['BinarySearch'] as any).$callableName = "SuObject#BinarySearch";
(SuObject.prototype['BinarySearch'] as any).$params = 'value, block=false';
//GENERATED end

//BUILTIN SuObject.Iter()
//GENERATED start
(SuObject.prototype['Iter'] as any).$call = SuObject.prototype['Iter'];
(SuObject.prototype['Iter'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Iter'].call(this);
};
(SuObject.prototype['Iter'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Iter'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Iter'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Iter'] as any).$callableName = "SuObject#Iter";
(SuObject.prototype['Iter'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Join(separator="")
//GENERATED start
(SuObject.prototype['Join'] as any).$call = SuObject.prototype['Join'];
(SuObject.prototype['Join'] as any).$callNamed = function ($named: any, separator: any) {
    maxargs(2, arguments.length);
    ({ separator = separator } = $named);
    return SuObject.prototype['Join'].call(this, separator);
};
(SuObject.prototype['Join'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Join'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Join'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Join'] as any).$callableName = "SuObject#Join";
(SuObject.prototype['Join'] as any).$params = 'separator=""';
//GENERATED end

//BUILTIN SuObject.Values(list=false, named=false)
//GENERATED start
(SuObject.prototype['Values'] as any).$call = SuObject.prototype['Values'];
(SuObject.prototype['Values'] as any).$callNamed = function ($named: any, list: any, named: any) {
    maxargs(3, arguments.length);
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Values'].call(this, list, named);
};
(SuObject.prototype['Values'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Values'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Values'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Values'] as any).$callableName = "SuObject#Values";
(SuObject.prototype['Values'] as any).$params = 'list=false, named=false';
//GENERATED end

//BUILTIN SuObject.Assocs(list=false, named=false)
//GENERATED start
(SuObject.prototype['Assocs'] as any).$call = SuObject.prototype['Assocs'];
(SuObject.prototype['Assocs'] as any).$callNamed = function ($named: any, list: any, named: any) {
    maxargs(3, arguments.length);
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Assocs'].call(this, list, named);
};
(SuObject.prototype['Assocs'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Assocs'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Assocs'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Assocs'] as any).$callableName = "SuObject#Assocs";
(SuObject.prototype['Assocs'] as any).$params = 'list=false, named=false';
//GENERATED end

//BUILTIN SuObject.Members(list=false, named=false)
//GENERATED start
(SuObject.prototype['Members'] as any).$call = SuObject.prototype['Members'];
(SuObject.prototype['Members'] as any).$callNamed = function ($named: any, list: any, named: any) {
    maxargs(3, arguments.length);
    ({ list = list, named = named } = $named);
    return SuObject.prototype['Members'].call(this, list, named);
};
(SuObject.prototype['Members'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Members'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Members'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Members'] as any).$callableName = "SuObject#Members";
(SuObject.prototype['Members'] as any).$params = 'list=false, named=false';
//GENERATED end

//BUILTIN SuObject.Unique!()
//GENERATED start
(SuObject.prototype['Unique!'] as any).$call = SuObject.prototype['Unique!'];
(SuObject.prototype['Unique!'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Unique!'].call(this);
};
(SuObject.prototype['Unique!'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Unique!'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Unique!'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Unique!'] as any).$callableName = "SuObject#Unique!";
(SuObject.prototype['Unique!'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Reverse!()
//GENERATED start
(SuObject.prototype['Reverse!'] as any).$call = SuObject.prototype['Reverse!'];
(SuObject.prototype['Reverse!'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuObject.prototype['Reverse!'].call(this);
};
(SuObject.prototype['Reverse!'] as any).$callAt = function (args: SuObject) {
    return (SuObject.prototype['Reverse!'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuObject.prototype['Reverse!'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Reverse!'] as any).$callableName = "SuObject#Reverse!";
(SuObject.prototype['Reverse!'] as any).$params = '';
//GENERATED end

//BUILTIN SuObject.Eval(@args)
//GENERATED start
(SuObject.prototype['Eval'] as any).$callAt = SuObject.prototype['Eval'];
(SuObject.prototype['Eval'] as any).$call = function (...args: any[]) {
    return SuObject.prototype['Eval'].call(this, new SuObject(args));
};
(SuObject.prototype['Eval'] as any).$callNamed = function (named: any, ...args: any[]) {
    return SuObject.prototype['Eval'].call(this, new SuObject(args, util.obToMap(named)));
};
(SuObject.prototype['Eval'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Eval'] as any).$callableName = "SuObject#Eval";
(SuObject.prototype['Eval'] as any).$params = '@args';
//GENERATED end

//BUILTIN SuObject.Eval2(@args)
//GENERATED start
(SuObject.prototype['Eval2'] as any).$callAt = SuObject.prototype['Eval2'];
(SuObject.prototype['Eval2'] as any).$call = function (...args: any[]) {
    return SuObject.prototype['Eval2'].call(this, new SuObject(args));
};
(SuObject.prototype['Eval2'] as any).$callNamed = function (named: any, ...args: any[]) {
    return SuObject.prototype['Eval2'].call(this, new SuObject(args, util.obToMap(named)));
};
(SuObject.prototype['Eval2'] as any).$callableType = "BUILTIN";
(SuObject.prototype['Eval2'] as any).$callableName = "SuObject#Eval2";
(SuObject.prototype['Eval2'] as any).$params = '@args';
//GENERATED end

//BUILTIN ObjectIter.Next()
//GENERATED start
(ObjectIter.prototype['Next'] as any).$call = ObjectIter.prototype['Next'];
(ObjectIter.prototype['Next'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return ObjectIter.prototype['Next'].call(this);
};
(ObjectIter.prototype['Next'] as any).$callAt = function (args: SuObject) {
    return (ObjectIter.prototype['Next'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(ObjectIter.prototype['Next'] as any).$callableType = "BUILTIN";
(ObjectIter.prototype['Next'] as any).$callableName = "ObjectIter#Next";
(ObjectIter.prototype['Next'] as any).$params = '';
//GENERATED end

//BUILTIN ObjectIter.Dup()
//GENERATED start
(ObjectIter.prototype['Dup'] as any).$call = ObjectIter.prototype['Dup'];
(ObjectIter.prototype['Dup'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return ObjectIter.prototype['Dup'].call(this);
};
(ObjectIter.prototype['Dup'] as any).$callAt = function (args: SuObject) {
    return (ObjectIter.prototype['Dup'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(ObjectIter.prototype['Dup'] as any).$callableType = "BUILTIN";
(ObjectIter.prototype['Dup'] as any).$callableName = "ObjectIter#Dup";
(ObjectIter.prototype['Dup'] as any).$params = '';
//GENERATED end

//BUILTIN ObjectIter.Infinite?()
//GENERATED start
(ObjectIter.prototype['Infinite?'] as any).$call = ObjectIter.prototype['Infinite?'];
(ObjectIter.prototype['Infinite?'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return ObjectIter.prototype['Infinite?'].call(this);
};
(ObjectIter.prototype['Infinite?'] as any).$callAt = function (args: SuObject) {
    return (ObjectIter.prototype['Infinite?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(ObjectIter.prototype['Infinite?'] as any).$callableType = "BUILTIN";
(ObjectIter.prototype['Infinite?'] as any).$callableName = "ObjectIter#Infinite?";
(ObjectIter.prototype['Infinite?'] as any).$params = '';
//GENERATED end
