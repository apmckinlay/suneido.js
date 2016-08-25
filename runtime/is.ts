import { SuValue } from "./suvalue";

export default function is(x: any, y: any): boolean {
    if (x === y)
        return true;
    if (x instanceof SuValue)
        return x.equals(y);
    if (y instanceof SuValue)
        return y.equals(x);
    return false;
}
