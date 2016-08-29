import { SuObject } from '../suobject';
import * as su from '../su';

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
    return su_object(new SuObject(args, su.toMap(named)));
};
(su_object as any).$params = '@args';
//GENERATED end
