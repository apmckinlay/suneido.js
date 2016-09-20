export abstract class SuValue {
    abstract equals(x: any): boolean;
    abstract compareTo(x: any): number;
    abstract type(): string;
    display(): string {
        return this.toString();
    }
    get(_key: any): any {
        throw new Error(this.type + " does not support get");
    }
    put(_key: any, _val: any): void {
        throw new Error(this.type + " does not support put");
    }
}
