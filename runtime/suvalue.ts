export abstract class SuValue {
    abstract equals(x: any): boolean;
    abstract type(): string;
    display(): string {
        return this.toString();
    }
}
