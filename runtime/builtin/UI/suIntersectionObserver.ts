import * as util from '../../utility';
import { SuBuiltinClass } from "../subuiltinclass";
import { maxargs } from "../../args";
import { SuCallable } from "../../suvalue";
import { convertSuValue, makeSuValue } from "./suEl";
import { SuObject } from '../../suobject';

export function su_intersectionObserver(cb: SuCallable, options: any): SuBuiltinClass {
    maxargs(2, arguments.length);
    return makeSuValue(new IntersectionObserver(convertSuValue(cb), convertSuValue(options)));
}

//BUILTIN IntersectionObserver(cb, options)
//GENERATED start
(su_intersectionObserver as any).$call = su_intersectionObserver;
(su_intersectionObserver as any).$callNamed = function ($named: any, cb: any, options: any) {
    maxargs(3, arguments.length);
    ({ cb = cb, options = options } = $named);
    return su_intersectionObserver(cb, options);
};
(su_intersectionObserver as any).$callAt = function (args: SuObject) {
    return (su_intersectionObserver as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_intersectionObserver as any).$params = 'cb, options';
//GENERATED end