export abstract class SuValue {
    abstract equals(x: any): boolean;
    abstract compareTo(x: any): number;
    abstract type(): string;
    display(): string {
        return this.toString();
    }
}
