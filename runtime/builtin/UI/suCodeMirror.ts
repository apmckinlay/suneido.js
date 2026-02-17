import * as util from '../../utility';
import { SuObject } from '../../suobject';
import { SuBuiltInEl, SuEl, defMap } from './suEl';
import { mandatory, maxargs } from '../../args';

export class SuCodeMirror extends SuEl {
    constructor(public el: any) {
        super();
    }
    type(): string {
        return 'CodeMirror';
    }
    display(): string {
        return `${this.type()}`;
    }
    GetMode(cm: SuEl = mandatory()) {
        maxargs(1, arguments.length);
        return new SuBuiltInEl(cm.el.getMode());
    }
}

export function su_getCodeMirror() {
    let codeMirror: any = window && (window as any)['CodeMirror'];
    if (!codeMirror)
        throw new Error("CodeMirror is not available");
    return new SuCodeMirror(codeMirror);
}

if (typeof window !== 'undefined') {
    defMap((window as any)['CodeMirror'], SuCodeMirror);
}

//BUILTIN GetCodeMirror()
//GENERATED start
(su_getCodeMirror as any).$call = su_getCodeMirror;
(su_getCodeMirror as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return su_getCodeMirror();
};
(su_getCodeMirror as any).$callAt = function (args: SuObject) {
    return (su_getCodeMirror as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_getCodeMirror as any).$callableType = "BUILTIN";
(su_getCodeMirror as any).$callableName = "GetCodeMirror";
(su_getCodeMirror as any).$params = '';
//GENERATED end

//BUILTIN SuCodeMirror.GetMode(cm)
//GENERATED start
(SuCodeMirror.prototype['GetMode'] as any).$call = SuCodeMirror.prototype['GetMode'];
(SuCodeMirror.prototype['GetMode'] as any).$callNamed = function ($named: any, cm: any) {
    maxargs(2, arguments.length);
    ({ cm = cm } = $named);
    return SuCodeMirror.prototype['GetMode'].call(this, cm);
};
(SuCodeMirror.prototype['GetMode'] as any).$callAt = function (args: SuObject) {
    return (SuCodeMirror.prototype['GetMode'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuCodeMirror.prototype['GetMode'] as any).$callableType = "BUILTIN";
(SuCodeMirror.prototype['GetMode'] as any).$callableName = "SuCodeMirror#GetMode";
(SuCodeMirror.prototype['GetMode'] as any).$params = 'cm';
//GENERATED end