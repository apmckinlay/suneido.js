import * as assert from "./assert";
import { Regex } from "./regex";

testCompile();
testAmatch();
testCharClass();
testCharClassRange();
testMatch();
testMatchResults();
testLastMatch();

function test(rx: string, expected: string): void {
    let compiled = Regex.compile(rx).toString().trim();
    assert.that(compiled === expected, `Expected: ${expected}\n\tget: ${compiled}`);
}
function except(rx: string, expected: string): void {
        assert.throws(() => Regex.compile(rx), expected);
}
function amatch(s: string, rx: string, len?: number): void {
    len = len === undefined ? s.length : len;
    let pat = Regex.compile(rx);
    let res = pat.amatch(s, 0);
    assert.that(res !== null && res.end[0] === len, `${rx} => ${pat} failed to match ${s}`);
}
function noamatch(s: string, rx: string): void {
    let pat = Regex.compile(rx);
    assert.that(pat.amatch(s, 0) === null, `${rx} => ${pat} shouldn't match ${s}`);
}
function matchResult(s: string, rx: string, ...exp: string[]) {
    let pat = Regex.compile(rx);
    let res = pat.firstMatch(s, 0);
    assert.that(res !== null, `${rx} => ${pat} failed to match ${s}`);
    if (res !== null)
        for (let i = 0; i < exp.length; i++) {
            assert.that(s.substring(res.pos[i], res.end[i]) === exp[i]);
        }
}
function match(s: string, rx: string): void {
    let pat = Regex.compile(rx);
    assert.that(pat.firstMatch(s, 0) !== null, `${rx} => ${pat} failed to match ${s}`);
}
function nomatch(s: string, rx: string): void {
    let pat = Regex.compile(rx);
    assert.that(pat.firstMatch(s, 0) === null, `${rx} => ${pat} shouldn't match ${s}`);
}
function lastMatch(s: string, rx: string, expected: number): void {
    let pat = Regex.compile(rx);
    let res = pat.lastMatch(s, s.length);
    if (res === null)
        assert.that(expected === -1);
    else
        assert.that(expected === res.pos[0]);
}

function testCompile(): void {
    test("", "");
    test(".", ".");
    test("a", "'a'");
    test("abc", "'abc'");
    test("^xyz", "^ 'xyz'");
    test("abc$", "'abc' $");
    test("^xyz$", "^ 'xyz' $");
    test("?ab", "'?ab'");
    test("*ab", "'*ab'");
    test("+ab", "'+ab'");
    test("a?", "Branch(1, 2) 'a'");
    test("abc?de", "'ab' Branch(1, 2) 'c' 'de'");
    test("abc+de", "'ab' 'c' Branch(-1, 1) 'de'");
    test("abc*de", "'ab' Branch(1, 3) 'c' Branch(-1, 1) 'de'");
    test("ab\\.?cd", "'ab' Branch(1, 2) '.' 'cd'");
    test("(ab+c)+x",
        "Left1 'a' 'b' Branch(-1, 1) 'c' Right1 Branch(-6, 1) 'x'");
    test("ab|cd", "Branch(1, 3) 'ab' Jump(2) 'cd'");
    test("ab|cd|ef",
        "Branch(1, 3) 'ab' Jump(3) Branch(1, 3) 'cd' Jump(2) 'ef'");
    test("abc\\Z", "'abc' \\Z");
    test("[a]", "'a'");
    test("[\\a]", "'a'");
    test("(?i)x.y(?-i)z", "i'x' . i'y' 'z'");

    test("(?q).*(?-q)def", "'.*def'");

    test("\\<Foo\\>", "\\< 'Foo' \\>");

    test("a(bc)d", "'a' Left1 'bc' Right1 'd'");

    test(".\\5.", ". \\5 .");
    test("(?i)\\5", "i\\5");

    test("a[.]b", "'a.b'");

    test("a(?q).(?-q).c(?q).(?-q).", "'a.' . 'c.' .");

    test("(?i)ABC", "i'abc'");

    test("\\", "'\\'");

    except("(abc", "missing ')'");
    except("abc)def", "closing ) without opening (");
}
function testAmatch(): void {
    amatch("", "");
    amatch("abc", "a", 1);
    noamatch("abc", "x");
    noamatch("ab", "abc");
    amatch("abc", "abc");
    amatch("abc", "^a", 1);
    amatch("abc", "^abc");
    amatch("abc", "^abc$");
    noamatch("abc", "^a$");
    noamatch("abc", "^abcd$");

    amatch("abc", "^...$");
    noamatch("ab\n", "...");

    noamatch("abde", "abc+de");
    amatch("abcde", "abc+de");
    amatch("abccde", "abc+de");
    noamatch("abccd", "abc+de");

    amatch("abde", "abc?de");
    amatch("abcde", "abc?de");
    noamatch("abccde", "abc?de");

    noamatch("abe", "ab(cd)*ef");
    amatch("abef", "ab(cd)*ef");
    amatch("abcdef", "ab(cd)*ef");
    amatch("abcdcdcdef", "ab(cd)*ef");
    noamatch("abcdcdcde", "ab(cd)*ef");

    amatch("abcx", "(ab*c)*x");
    amatch("abbc", "(ab*c)*");
    amatch("abcabc", "(ab*c)*");
    amatch("acabbbc", "(ab*c)*");
    amatch("abbbcac", "(ab*c)*");
    amatch("acabcabbcx", "(ab*c)*x");

    amatch("a", "a|b");
    amatch("b", "a|b");
    noamatch("x", "a|b");
    noamatch("", "a|b");

    amatch("a", "a|b|c");
    amatch("b", "a|b|c");
    amatch("c", "a|b|c");
    noamatch("x", "a|b|c");
    noamatch("", "a|b|c");

    amatch("a", "a?", 1);
    amatch("a", "a??", 0);
    amatch("ab", "a?b");
    amatch("ab", "a??b");

    amatch("aaab", "a*", 3);
    amatch("aaab", "a*?", 0);
    amatch("aaab", "a+?", 1);
    amatch("aaab", "a*b");
    amatch("aaab", "a*?b");
    amatch("aaab", "a+?b");

    amatch("AbbA", "(.)(.)\\2\\1");
    amatch("AbBa", "(.)(.)(?i)\\2\\1");
}
function testCharClass(): void {
    amatch("a", "[abc]");
    amatch("b", "[abc]");
    amatch("c", "[abc]");
    noamatch("b", "[^abc]");
    amatch("x", "[^abc]");

    amatch("c", "\\w");
    amatch(" ", "\\W");
    noamatch(" ", "\\w");
    amatch(" ", "\\s");
    amatch("c", "\\S");
    noamatch("c", "\\s");

    amatch("c", "[\\w]");
    amatch(" ", "[\\W]");
    noamatch(" ", "[\\w]");
    amatch(" ", "[\\s]");
    amatch("c", "[\\S]");
    noamatch("c", "[\\s]");

    amatch("b", "[[:alpha:]]");
    amatch("b", "[[:alnum:]]");
    amatch("b", "[[:print:]]");
    amatch("b", "[[:graph:]]");
    amatch("b", "[[:lower:]]");
    noamatch("b", "[[:upper:]]");
    amatch("B", "[[:upper:]]");
    amatch("5", "[[:digit:]]");
    amatch("5", "[[:alnum:]]");
    noamatch("5", "[[:alpha:]]");
    noamatch("5", "[[:lower:]]");
    noamatch("5", "[[:upper:]]");

    amatch("aBc", "[aBc]+");
    amatch("aBc", "(?i)[ABC]+");
    amatch("ABC", "(?i)ABC");
    amatch("ABC", "(?i)abc");
    amatch("abc", "(?i)ABC");
    amatch("abc", "(?i)abc");
    noamatch("abc", "(?i)ark");

    amatch("axb", "[\u0000-\u00ff]+");
}
function testCharClassRange(): void {
    match("m", "[a-z]");
    match("-", "[-z]");
    nomatch("m", "[-z]");
    match("-", "[a-]");
    nomatch("m", "[a-]");
}
function testMatch(): void {
    match("hello\nworld", "^he");
    match("hello\nworld", "^wo");
    match("hello\n\nworld", "^wo");
    match("\nworld", "^wo");
    match("hello\nworld", "\\Ahe");
    nomatch("hello\nworld", "\\Awo");

    match("hello\nworld world", "ld$");
    match("hello\nworld", "lo$");
    match("hello\n", "lo$");
    match("hello\n\nworld", "lo$");
    match("hello\nworld", "ld\\Z");
    nomatch("hello\nworld", "lo\\Z");

    nomatch("(+*)", "^(+*)$");
    match("(+*)", "^(?q)(+*)(?-q)$");

    nomatch("hello", "eLL");
    match("hello", "(?i)eLL");
    nomatch("hello", "(?i)eL(?-i)L");

    match("foobar", "\\<foo");
    nomatch("foobar", "\\<foo\\>");
    match("foo bar", "\\<foo\\>");
    match("foobar", "bar\\>");
    nomatch("foobar", "\\<bar\\>");
    match("foo bar", "\\<bar\\>");
    amatch("foobar", "\\<foobar\\>");
    match("foo bar", "(?i)bar");
    match("foo Bar", "(?i)bar");
    match("123x", "(?i)[a-z]");
    match("123X", "(?i)[a-z]");

    amatch("hello", "hello");
    amatch("hello", "^hello$");

    match("hello\nworld", "^hello$");
    match("hello\nworld", "\\Ahello");
    nomatch("hello\nworld", "\\Aworld");
    match("hello\nworld", "world\\Z");
    nomatch("hello\nworld", "hello\\Z");

    match("hello\r\nworld", "^hello$");
    match("hello\r\nworld", "\\Ahello");
    nomatch("hello\r\nworld", "\\Aworld");
    match("hello\r\nworld", "world\\Z");
    nomatch("hello\r\nworld", "hello\\Z");

    match("one_1 two_2\nthree_3", "\\<one_1\\>");
    match("one_1 two_2\nthree_3", "\\<two_2\\>");
    match("one_1 two_2\nthree_3", "\\<three_3\\>");
    match("one_1 two_2\r\nthree_3", "\\<two_2\\>");
    match("one_1 two_2\r\nthree_3", "\\<three_3\\>");
    nomatch("one_1 two_2\nthree_3", "\\<one\\>");
    nomatch("one_1 two_2\nthree_3", "\\<two\\>");

    nomatch("hello", "fred");
    amatch("hello", "h.*o");
    amatch("hello", "[a-z]ello");
    amatch("hello", "[^0-9]ello");
    match("hello", "ell");
    nomatch("hello", "^ell");
    nomatch("hello", "ell$");
    amatch("heeeeeeeello", "^he+llo$");
    amatch("heeeeeeeello", "^he*llo*");
    amatch("hllo", "^he*llo$");
    amatch("hllo", "^he?llo$");
    amatch("hello", "^he?llo$");
    nomatch("heello", "^he?llo$");
    amatch("+123.456", "^[+-][0-9]+[.][0123456789]*$");

    amatch("0123456789", "^\\d+$");
    nomatch("0123456789", "\\D");
    amatch("hello_123", "^\\w+$");
    nomatch("hello_123", "\\W");
    amatch("hello \t\r\nworld", "^\\w+\\s+\\w+$");
    amatch("!@#@!# \r\t{},()[];", "^\\W+$");
    amatch("123adjf!@#", "^\\S+$");
    nomatch("123adjf!@#", "\\s");

    amatch("()[]", "^\\(\\)\\[\\]$");
    amatch("hello world", "^(hello|howdy) (\\w+)$");
    amatch("ab", "(a|ab)b"); // alternation backtrack
    match("abc", "x*c");
    match("abc", "x*$");
    match("abc", "x?$");
    match("abc", "^x?");
    match("abc", "^x*");
    nomatch("aBcD", "abcd");
    amatch("aBcD", "(?i)abcd");
    amatch("aBCd", "a(?i)bc(?-i)d");
    amatch("aBCD", "a(?i)bc(?-i)D");
    nomatch("ABCD", "a(?i)bc(?-i)d");
    amatch("abc", "a.c");
    match("a.c", "(?q)a.c");
    nomatch("abc", "(?q)a.c");
    match("a.cd", "(?q)a.c(?-q).");
    nomatch("abcd", "(?q)a.c(?-q).");
    nomatch("abc", "(?q)(");
    match("ABC", "(?i)[A-Z]");
    match("ABC", "(?i)[a-z]");
    match("abc", "(?i)[A-Z]");
    match("abc", "(?i)[a-z]");
}
function testMatchResults(): void {
    matchResult("foo123", "([a-z]+)([0-9]+)", "foo123", "foo", "123");
    matchResult("hello there world", "(\\w+ )+", "hello there ", "there ");
    matchResult("hello world", "hello(x?)", "hello");
}
function testLastMatch(): void {
    lastMatch("hello", "\\w", 4);
    lastMatch("hello world", "o", 7);
    lastMatch("hello world", "\\<\\w+", 6);
}

// porttests -------------------------------------------------------------------

import { runFile } from "./porttests";

runFile("regex.test", { regex_match });

function regex_match(...args: string[]): boolean {
    let s = args[0];
    let rx = args[1];
    function tryTest(block: any): boolean {
        try {
            block();
            return true;
        } catch (e) {
            return false;
        }
    }
    if (arguments.length === 2) {
        return tryTest(() => match(s, rx));
    } else if (arguments.length === 3 && args[2] === "false") {
        return tryTest(() => nomatch(s, rx));
    } else {
        return tryTest(() => matchResult(s, rx, ...args.slice(2)));
    }
}
