import { Dynamic } from './dynamic';
import * as assert from "./assert";

assert.equal(Dynamic.getOrUndefined('test'), undefined);
assert.throws(() => Dynamic.get('test'), 'uninitialized test');

Dynamic.put('test', 1);
assert.equal(Dynamic.get('test'), 1);

Dynamic.push();
assert.equal(Dynamic.get('test'), 1);

Dynamic.put('test', 2);
Dynamic.put('newTest', 1);
assert.equal(Dynamic.get('test'), 2);
assert.equal(Dynamic.get('newTest'), 1);

Dynamic.pop();
assert.equal(Dynamic.get('test'), 1);
assert.throws(() => Dynamic.get('newTest'), 'uninitialized newTest');
