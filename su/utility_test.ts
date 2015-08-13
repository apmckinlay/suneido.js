import util = require("./utility");
import assert = require("assert");

export = function testUtility(): void {
    assert.deepEqual(util.tr("", "", ""), "");
    assert.deepEqual(util.tr("", "abc", "ABC"), "");
    assert.deepEqual(util.tr("", "^abc", "x"), "");

    assert.deepEqual(util.tr("abc", "", ""), "abc");
    assert.deepEqual(util.tr("abc", "xyz", ""), "abc");
    assert.deepEqual(util.tr("zon", "xyz", ""), "on");
    assert.deepEqual(util.tr("oyn", "xyz", ""), "on");
    assert.deepEqual(util.tr("nox", "xyz", ""), "no");
    assert.deepEqual(util.tr("zyx", "xyz", ""), "");

    assert.deepEqual(util.tr("zon", "xyz", "XYZ"), "Zon");
    assert.deepEqual(util.tr("oyn", "xyz", "XYZ"), "oYn");
    assert.deepEqual(util.tr("nox", "xyz", "XYZ"), "noX");
    assert.deepEqual(util.tr("zyx", "xyz", "XYZ"), "ZYX");

    assert.deepEqual(util.tr("a b - c", "^abc", ""), "abc"); // allbut delete
    assert.deepEqual(util.tr("a b - c", "^a-z", ""), "abc"); // allbut delete
    assert.deepEqual(util.tr("a  b - c", "^abc", " "), "a b c"); // allbut collapse
    assert.deepEqual(util.tr("a  b - c", "^a-z", " "), "a b c"); // allbut collapse
    assert.deepEqual(util.tr("a-b-c", "-x", ""), "abc"); // literal dash
    assert.deepEqual(util.tr("a-b-c", "x-", ""), "abc"); // literal dash

    // collapse at end
    assert.deepEqual(util.tr("hello \t\n\n", " \t\n", "\n"), "hello\n");

    // signed char range
    assert.deepEqual(util.tr("hello", "^\x20-\xff", ""), "hello");
    assert.deepEqual(util.tr("hello\x7f", "\x70-\x7f", ""), "hello");
    assert.deepEqual(util.tr("hello\xff", "\x7f-\xff", ""), "hello");
}