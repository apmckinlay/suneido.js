import * as assert from "./assert";
import { blockReturnHandler, blockreturn } from "./blockreturn";

function test(funcId: number) {
    try {
        throw blockreturn(1, "test");
    } catch (e) {
        return blockReturnHandler(e, funcId);
    }
}
assert.equal(test(1), "test");
assert.throws(() => test(2));
