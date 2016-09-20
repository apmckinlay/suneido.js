import { runFile } from "./porttests";

runFile("ptest.test", { ptest });

function ptest(x: string, y: string): boolean {
    return x === y;
}
