import { SuValue } from "./suvalue";

interface SuCallable extends SuValue {
    $params: string;
    $call: (...args: any[]) => any;
    $callAt: (...args: any[]) => any;
    $callNamed: (...args: any[]) => any;
}

export class SuBoundMethod extends SuValue implements SuCallable {
    $params: string;
    constructor(private instance: SuValue, private method: SuCallable) {
        super();
        this.$params = method.$params;
    }
    $call() {
        return this.method.$call.apply(this.instance, arguments);
    }
    $callNamed() {
        return this.method.$callNamed.apply(this.instance, arguments);
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
