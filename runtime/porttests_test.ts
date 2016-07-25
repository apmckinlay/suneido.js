import { runFile } from "./porttests"

runFile("ptest.test", {"ptest": ptest});

function ptest(x, y): boolean {
    return x == y;
}
