import { clear, clearAll } from "../global";
import { maxargs } from "../args";
import { toStr } from "../Ops";
import { SuObject } from "../suobject";
import * as util from "../utility";

export function su_unload(_name: any = false) {
    maxargs(1, arguments.length);
    if (_name === false)
        clearAll();
    else
        clear(toStr(_name));
    return null;
}

//BUILTIN Unload(s=false)
//GENERATED start
(su_unload as any).$call = su_unload;
(su_unload as any).$callNamed = function ($named: any, s: any) {
    maxargs(2, arguments.length);
    ({ s = s } = $named);
    return su_unload(s);
};
(su_unload as any).$callAt = function (args: SuObject) {
    return (su_unload as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_unload as any).$params = 's=false';
//GENERATED end


