import * as util from "./utility";
import * as assert from "./assert";

assert.equal(util.tr("", "", ""), "");
assert.equal(util.tr("", "abc", "ABC"), "");
assert.equal(util.tr("", "^abc", "x"), "");

assert.equal(util.tr("abc", "", ""), "abc");
assert.equal(util.tr("abc", "xyz", ""), "abc");
assert.equal(util.tr("zon", "xyz", ""), "on");
assert.equal(util.tr("oyn", "xyz", ""), "on");
assert.equal(util.tr("nox", "xyz", ""), "no");
assert.equal(util.tr("zyx", "xyz", ""), "");

assert.equal(util.tr("zon", "xyz", "XYZ"), "Zon");
assert.equal(util.tr("oyn", "xyz", "XYZ"), "oYn");
assert.equal(util.tr("nox", "xyz", "XYZ"), "noX");
assert.equal(util.tr("zyx", "xyz", "XYZ"), "ZYX");

assert.equal(util.tr("a b - c", "^abc", ""), "abc"); // allbut delete
assert.equal(util.tr("a b - c", "^a-z", ""), "abc"); // allbut delete
assert.equal(util.tr("a  b - c", "^abc", " "), "a b c"); // allbut collapse
assert.equal(util.tr("a  b - c", "^a-z", " "), "a b c"); // allbut collapse
assert.equal(util.tr("a-b-c", "-x", ""), "abc"); // literal dash
assert.equal(util.tr("a-b-c", "x-", ""), "abc"); // literal dash

// collapse at end
assert.equal(util.tr("hello \t\n\n", " \t\n", "\n"), "hello\n");

// signear range
assert.equal(util.tr("hello", "^\x20-\xff", ""), "hello");
assert.equal(util.tr("hello\x7f", "\x70-\x7f", ""), "hello");
assert.equal(util.tr("hello\xff", "\x7f-\xff", ""), "hello");
