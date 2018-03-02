import { String2, toStr } from "./strings";
import { SuObject, mkObject } from "../suobject";
import * as util from "../utility";

export class Except extends String2 {
    private message: string;
    constructor(private error: Error, message?: string) {
        super();
        this.message = message || error.message;
        Object.freeze(this);
    }

    getError() {
        return this.error;
    }

    toString(): string {
        return this.message;
    }

    // INTERFACE: SuValue
    type() {
        return "Except";
    }

    // BUILT-IN METHODS
    As(a: any): Except {
        return new Except(this.error, toStr(a));
    }

    // FIX ME: this is a simple implementation
    Callstack(): SuObject {
        let stack: string[] = [];
        let errorStack = this.error.stack;
        if (errorStack !== undefined)
            stack = errorStack.split('\n');
        return mkObject(stack);
    }
}

//BUILTIN Except.As(a)
//GENERATED start
(Except.prototype['As'] as any).$call = Except.prototype['As'];
(Except.prototype['As'] as any).$callNamed = function ($named: any, a: any) {
    ({ a = a } = $named);
    return Except.prototype['As'].call(this, a);
};
(Except.prototype['As'] as any).$callAt = function (args: SuObject) {
    return (Except.prototype['As'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Except.prototype['As'] as any).$params = 'a';
//GENERATED end

//BUILTIN Except.Callstack()
//GENERATED start
(Except.prototype['Callstack'] as any).$call = Except.prototype['Callstack'];
(Except.prototype['Callstack'] as any).$callNamed = function (_named: any) {
    return Except.prototype['Callstack'].call(this);
};
(Except.prototype['Callstack'] as any).$callAt = function (args: SuObject) {
    return (Except.prototype['Callstack'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(Except.prototype['Callstack'] as any).$params = '';
//GENERATED end
