import { SuObject } from '../suobject';
import * as su from '../su';

export function su_print(args: SuObject) {
    console.log(SuObject.toString2(args, '', ''));
};
//BUILTIN Print(@args)
//GENERATED start
(su_print as any).$callAt = su_print;
(su_print as any).$call = function (...args: any[]) {
    return su_print(new SuObject(args));
};
(su_print as any).$callNamed = function (named: any, ...args: any[]) {
    return su_print(new SuObject(args, su.toMap(named)));
};
(su_print as any).$params = '@args';
//GENERATED end
