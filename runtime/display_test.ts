import { display } from "./display";
import { SuNum } from "./sunum";
import * as assert from "./assert";

function disp(x: any, expected: string) {
    assert.equal(display(x), expected);
}
disp(true, 'true');
disp(123, '123');
disp(SuNum.make(1234, -2), '12.34');
disp('hello', '"hello"');
disp('a\\b', '`a\\b`');
disp('a"b', "'a\"b'");
