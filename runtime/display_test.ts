import { display } from "./display";
import { Dnum } from "./dnum";
import * as assert from "./assert";

function disp(x: any, expected: string) {
    assert.equal(display(x), expected);
}
disp(true, 'true');
disp(123, '123');
disp(Dnum.make(1234, -2), '12.34');
disp('hello', '"hello"');
disp('a\\b', '`a\\b`');
disp('a"b', "'a\"b'");
