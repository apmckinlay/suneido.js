import { SuValue, SuCallable } from "./suvalue";
import * as util from "./utility";

export function isBlock(value: any): boolean {
    return typeof value === 'function' && (value as SuCallable).$callableType === 'BLOCK';
}

export class SuBoundMethod extends SuValue implements SuCallable {
    $params: string;
    $callableType: string;
    $callableName: string;
    constructor(private instance: SuValue, public method: SuCallable) {
        super();
        this.$params = method.$params;
        this.$callableType = method.$callableType;
        this.$callableName = method.$callableName;
    }
    $call(...args: any[]) {
        return this.method.$call.apply(this.instance, args);
    }
    $callNamed(...args: any[]) {
        return this.method.$callNamed.apply(this.instance, args);
    }
    $callAt(args: any) {
        return this.method.$callAt.call(this.instance, args);
    }
    getName(): string {
        return this.$callableName || '';
    }
    display(): string {
        return this.$callableName || '';
    }
    equals(that: any) {
        if (!(that instanceof SuBoundMethod))
            return false;
        return this.instance.equals(that.instance) && this.method  === that.method;
    }
    compareTo(that: any): util.Cmp {
        return -1;
    }
    type() {
        return "BoundMethod";
    }
}

export function isFunction(value: any): boolean {
    return typeof value === 'function' && (value as SuCallable).$callableType != null ||
        value instanceof SuBoundMethod;
}
