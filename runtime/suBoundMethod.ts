import { SuValue, SuCallable } from "./suvalue";

export function isBlock(value: any): boolean {
    return typeof value === 'function' && (value as SuCallable).$callableType === 'BLOCK';
}

export class SuBoundMethod extends SuValue implements SuCallable {
    $params: string;
    $callableType: string;
    constructor(private instance: SuValue, public method: SuCallable) {
        super();
        this.$params = method.$params;
        this.$callableType = method.$callableType;
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
    equals(that: any) {
        if (!(that instanceof SuBoundMethod))
            return false;
        return this.instance.equals(that.instance) && this.method  === that.method;
    }
    compareTo(that: any): number {
        return -1;
    }
    type() {
        return "BoundMethod";
    }
}
