import { toStr } from "../ops";
import { SuObject } from "../suobject";
import { globalLookup } from "../global";
import { Strings } from "./strings";
const sm: any = Strings.prototype;
import * as util from "../utility";
import { SuCallable } from "../suvalue";
import { maxargs } from "../args";

export class Except extends String {
    private error: Error;
    constructor(error: any, message?: string) {
        if (!(error instanceof Error)) {
            error = new Error(String(error) + ' (' + (typeof error) + ')');
        }
        super(message || error.message);
        this.error = error;
        Object.freeze(this);
    }

    getError() {
        return this.error;
    }

    type() {
        return "Except";
    }

    lookup(this: any, method: string): SuCallable {
        return this[method] || sm[method] || globalLookup('Strings', method);
    }

    // BUILT-IN METHODS
    As(a: any): Except {
        maxargs(1, arguments.length);
        return new Except(this.error, toStr(a));
    }

    // FIX ME: this is a simple implementation
    Callstack(): SuObject {
        maxargs(0, arguments.length);
        let stack: string[] = [];
        let errorStack = this.error.stack;
        if (errorStack !== undefined)
            stack = errorStack.split('\n');
        return new SuObject(stack);
    }
}

//BUILTIN Except.As(a)
//GENERATED start
(Except.prototype['As'] as any).$call = Except.prototype['As'];
(Except.prototype['As'] as any).$callNamed = function ($named: any, a: any) {
    maxargs(2, arguments.length);
    ({ a = a } = $named);
    return Except.prototype['As'].call(this, a);
};
(Except.prototype['As'] as any).$callAt = function (args: SuObject) {
    return (Except.prototype['As'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Except.prototype['As'] as any).$callableType = "BUILTIN";
(Except.prototype['As'] as any).$callableName = "Except#As";
(Except.prototype['As'] as any).$params = 'a';
//GENERATED end

//BUILTIN Except.Callstack()
//GENERATED start
(Except.prototype['Callstack'] as any).$call = Except.prototype['Callstack'];
(Except.prototype['Callstack'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return Except.prototype['Callstack'].call(this);
};
(Except.prototype['Callstack'] as any).$callAt = function (args: SuObject) {
    return (Except.prototype['Callstack'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Except.prototype['Callstack'] as any).$callableType = "BUILTIN";
(Except.prototype['Callstack'] as any).$callableName = "Except#Callstack";
(Except.prototype['Callstack'] as any).$params = '';
//GENERATED end
