import { CharMatcher } from "./charmatcher";
import * as assert from "./assert"

let cm;

cm = CharMatcher.NONE;
assert.equal(cm.matches('a'), false);

cm = CharMatcher.is('x');
assert.that(cm.matches('x') == true);
assert.that(cm.matches('y') == false);

cm = cm.negate();
assert.that(cm.matches('x') == false);
assert.that(cm.matches('y') == true);

cm = CharMatcher.anyOf('abc');
assert.that(cm.matches('b') == true);
assert.that(cm.matches('x') == false);

cm = CharMatcher.inRange('m', 'o');
assert.that(cm.matches('l') == false);
assert.that(cm.matches('m') == true);
assert.that(cm.matches('n') == true);
assert.that(cm.matches('o') == true);
assert.that(cm.matches('p') == false);

let x = CharMatcher.is('x');
let y = CharMatcher.is('y');
cm = x.or(y);
assert.that(cm.matches('x') == true);
assert.that(cm.matches('y') == true);
assert.that(cm.matches('z') == false);

cm = CharMatcher.anyOf("aeiou");
assert.equal(cm.countIn('hello world'), 3);

assert.equal(cm.indexIn("hello world"), 1);
assert.equal(cm.indexIn("123"), -1);

