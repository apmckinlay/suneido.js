import { SuCallable, SuValue } from "../suvalue";
import { Cmp } from "../utility";

export abstract class SuBuiltinClass extends SuValue {
    protected abstract newInstance(): any;
    protected abstract className: string;
    $call(this: any, ...args: any[]) {
        return this.newInstance.$call(...args);
    }
    $callAt(this: any, ...args: any[]) {
        return this.newInstance.$callAt(...args);
    }
    $callNamed(this: any, ...args: any[]) {
        return this.newInstance.$callNamed(...args);
    }
    compareTo(that: any): Cmp {
        return -1;
    }
    equals(that: any): boolean {
        return false;
    }
    lookup(this: any, method: string): SuCallable {
        return this[method];
    }
    display(): string {
        return this.className + " /* builtin class */";
    }
    type(): string {
        return "BuiltinClass";
    }
}
