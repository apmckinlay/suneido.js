import { maxargs } from "../args";
import { toStr } from "../ops";
import { Pack } from "../pack";
import { SuObject } from "../suobject";
import * as util from "../utility";

export function su_pack(value: any) {
    maxargs(1, arguments.length);
    const buf = Pack.pack(value);
    let s = "";
    for (let i = 0; i < buf.length; i++) {
        s += String.fromCharCode(buf[i]);
    }
    return s;
}

export function su_unpack(x: any) {
    maxargs(1, arguments.length);
    let str = toStr(x);
    return Pack.unpack(Pack.convertStringToBuffer(str));
}

//BUILTIN Pack(value)
//GENERATED start
(su_pack as any).$call = su_pack;
(su_pack as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_pack(value);
};
(su_pack as any).$callAt = function (args: SuObject) {
    return (su_pack as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_pack as any).$callableType = "BUILTIN";
(su_pack as any).$callableName = "Pack";
(su_pack as any).$params = 'value';
//GENERATED end

//BUILTIN Unpack(value)
//GENERATED start
(su_unpack as any).$call = su_unpack;
(su_unpack as any).$callNamed = function ($named: any, value: any) {
    maxargs(2, arguments.length);
    ({ value = value } = $named);
    return su_unpack(value);
};
(su_unpack as any).$callAt = function (args: SuObject) {
    return (su_unpack as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_unpack as any).$callableType = "BUILTIN";
(su_unpack as any).$callableName = "Unpack";
(su_unpack as any).$params = 'value';
//GENERATED end