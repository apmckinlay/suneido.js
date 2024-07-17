import { Cmp } from "./utility";
import { PackStack, Encoder } from "./packbase";

export abstract class SuValue {
    abstract equals(x: any): boolean;
    abstract compareTo(x: any): Cmp;
    abstract type(): string;
    display(): string {
        return this.toString();
    }
    get(_key: any): any {
        throw new Error(this.type() + " does not support get");
    }
    put(_key: any, _val: any): void {
        throw new Error(this.type() + " does not support put");
    }
    lookup(this: any, method: string): SuCallable {
        throw new Error(`method not found: ${this.type()}.${method}(${this.display()})`);
    }
    toObject(): any {
        return null;
    }

    packSize(): number {
        throw new Error("can't pack " + this.type());
    }

    packSize2(stack: PackStack): number {
        throw new Error("can't pack " + this.type());
    }

    pack(buf: Encoder) {
        throw new Error("can't pack " + this.type());
    }

    getName() {
        return '';
    }
}

export abstract class SuIterable extends SuValue {
    abstract Next(): any;
    abstract Dup(): SuIterable;
    abstract ["Infinite?"]?(): boolean;
    compareTo(that: any): Cmp {
        return -1;
    }
    equals(that: any): boolean {
        return false;
    }
    lookup(this: any, method: string): SuCallable {
        return this[method];
    }
}

export interface SuCallable extends SuValue {
    $params: string;
    $callableType: string;
    $callableName: string;
    $blockThis?: any;
    $call: (...args: any[]) => any;
    $callAt: (...args: any[]) => any;
    $callNamed: (...args: any[]) => any;
    $callbackWrapper?: (...args: any[]) => any;
}
