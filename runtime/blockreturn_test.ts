import * as assert from "./assert";
import { blockReturnHandler, blockreturn, rethrowBlockReturn } from "./blockreturn";

function test(funcId: number) {
    try {
        try {
            throw blockreturn(1, "test");
        } catch (e) {
            rethrowBlockReturn(e);
        }
    } catch (e) {
        return blockReturnHandler(e, funcId);
    }
}
assert.equal(test(1), "test");
assert.throws(() => test(2));
