import { tr } from "./tr";
import * as assert from "./assert";

assert.equal(tr("", "", ""), "");
assert.equal(tr("", "abc", "ABC"), "");
assert.equal(tr("", "^abc", "x"), "");

assert.equal(tr("abc", "", ""), "abc");
assert.equal(tr("abc", "xyz", ""), "abc");
assert.equal(tr("zon", "xyz", ""), "on");
assert.equal(tr("oyn", "xyz", ""), "on");
assert.equal(tr("nox", "xyz", ""), "no");
assert.equal(tr("zyx", "xyz", ""), "");

assert.equal(tr("zon", "xyz", "XYZ"), "Zon");
assert.equal(tr("oyn", "xyz", "XYZ"), "oYn");
assert.equal(tr("nox", "xyz", "XYZ"), "noX");
assert.equal(tr("zyx", "xyz", "XYZ"), "ZYX");

assert.equal(tr("a b - c", "^abc", ""), "abc"); // allbut delete
assert.equal(tr("a b - c", "^a-z", ""), "abc"); // allbut delete
assert.equal(tr("a  b - c", "^abc", " "), "a b c"); // allbut collapse
assert.equal(tr("a  b - c", "^a-z", " "), "a b c"); // allbut collapse
assert.equal(tr("a-b-c", "-x", ""), "abc"); // literal dash
assert.equal(tr("a-b-c", "x-", ""), "abc"); // literal dash

// collapse at end
assert.equal(tr("hello \t\n\n", " \t\n", "\n"), "hello\n");

// signear range
assert.equal(tr("hello", "^\x20-\xff", ""), "hello");
assert.equal(tr("hello\x7f", "\x70-\x7f", ""), "hello");
assert.equal(tr("hello\xff", "\x7f-\xff", ""), "hello");
