import { Strings, StringIter } from "./strings";
import { isString } from "../isString";
import { Except } from "./except";
import * as util from "../utility";
import * as assert from "../assert";

const sm = Strings.prototype;

let str1: string;
let str2: string;
let expected: string;

str1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
assert.that(sm['Alpha?'].call(str1), "check method alphaq() with all letters");
str1 = "1";
assert.that(!sm['Alpha?'].call(str1), "check method alphaq() with digit");
str1 = "_";
assert.that(!sm['Alpha?'].call(str1), "check method alphaq() with underscore");

str1 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
assert.that(sm['AlphaNum?'].call(str1), "check method alphaNumq() with all letters and numbers");
str1 = "_";
assert.that(!sm['AlphaNum?'].call(str1), "check method alphaNumq() with underscore");

assert.equal(sm.Asc.call(""), 0);
assert.equal(sm.Asc.call("abc"), 97);
assert.equal(sm.Asc.call("#abc"), 35);

assert.equal(sm.Detab.call(""), "");
str1 = "aaa\t\tb\r\n\tcccc\td";
assert.equal(sm.Detab.call(str1), `aaa     b\r\n    cccc    d`);
assert.equal(sm.Detab.call(str1), "aaa     b\r\n    cccc    d") ;

assert.equal(sm.Entab.call(""), "");
str1 = "  \t \t  ";
assert.equal(sm.Entab.call(str1), "");
str1 = "     \t hel lo \t\r\n   \tend ";
assert.equal(sm.Entab.call(str1), "\t\t hel lo\r\n\tend");

str1 = "hello world";
assert.equal(sm.Extract.call(str1, ".....$"), "world");
assert.equal(sm.Extract.call(str1, "(\\w+) \\w+"), "hello");
assert.equal(sm.Extract.call(str1, "(hello|howdy) (\\w+)", 2), "world");
assert.equal(sm.Extract.call(str1, "abc"), false);
assert.equal(sm.Extract.call(str1, "hello(d?)"), "");

assert.equal(sm.Find.call(str1, "o"), 4);
assert.equal(sm.Find.call(str1, "o", 5), 7);
assert.equal(sm.Find.call(str1, "x"), 11);
assert.equal(sm.Find.call("", "o"), 0);

str1 = "this is a test";
assert.equal(sm.FindLast.call(str1, "is"), 5);
assert.equal(sm.FindLast.call(str1, "is", 4), 2);
assert.equal(sm.FindLast.call("", "o"), false);

assert.equal(sm.Find1of.call(str1, "si"), 2);
assert.equal(sm.Find1of.call(str1, "si", 2), 2);
assert.equal(sm.Find1of.call(str1, "si", 4), 5);
assert.equal(sm.Find1of.call(str1, "xy", 0), 14);

assert.equal(sm.FindLast1of.call(str1, "si"), 12);
assert.equal(sm.FindLast1of.call(str1, "si", 12), 12);
assert.equal(sm.FindLast1of.call(str1, "si", 11), 6);
assert.equal(sm.FindLast1of.call(str1, "xy", 0), false);

assert.equal(sm.Findnot1of.call(str1, " hist"), 8);
assert.equal(sm.Findnot1of.call(str1, " hist", 8), 8);
assert.equal(sm.Findnot1of.call(str1, " hist", 9), 11);
assert.equal(sm.Findnot1of.call(str1, " histea", 0), 14);

assert.equal(sm.FindLastnot1of.call(str1, "tse"), 9);
assert.equal(sm.FindLastnot1of.call(str1, "tse", 9), 9);
assert.equal(sm.FindLastnot1of.call(str1, "tse", 6), 5);
assert.equal(sm.FindLastnot1of.call(str1, " histea"), false);

assert.that(sm['Has?'].call(str1, "this"), "check method hasq()");
assert.that(!sm['Has?'].call(str1, "thsi"), "check method hasq()");
assert.that(sm['Has?'].call(str1, ""), "check method hasq() with empty argument");
assert.that(!sm['Has?'].call("", "thsi"), "check method hasq() with empty SuString");
assert.that(sm['Has?'].call("", ""), "check method hasq() with empty SuString and empty argument");

str1 = "THIS is A test";
assert.equal(sm.Lower.call(str1), "this is a test");

str1 = "this is a test";
assert.that(sm['Lower?'].call(str1), "check method lowerq() with all lowercase string");
str1 = "This is a test";
assert.that(!sm['Lower?'].call(str1), "check method lowerq() with uppercase string");
str1 = "123 %$^#%";
assert.that(!sm['Lower?'].call(str1), "check method lowerq() with no letter string");
str1 = "";
assert.that(!sm['Lower?'].call(str1), "check method lowerq() with empty string");

function capFirst(s: string): string {
    return util.capitalize(s);
}
(capFirst as any).$call = capFirst;
str1 = "";
str2 = sm.MapN.call(str1, 2, capFirst);
assert.equal(str2, "");
str1 = "hello world";
str2 = sm.MapN.call(str1, 2, capFirst);
assert.equal(str2, "HeLlO WoRlD");

str1 = "-123.456";
assert.that(sm['Number?'].call(str1), "check method numberq() with a negative decimal with integer and float parts");
str1 = "123.456e12";
assert.that(sm['Number?'].call(str1), "check method numberq() with a negative decimal with integer, float and exp parts");
str1 = "hello world";
assert.that(!sm['Number?'].call(str1), "check method numberq() with a non-number");
str1 = "123 hello world";
assert.that(!sm['Number?'].call(str1), "check method numberq() with a combination of number and non-number");
str1 = "10e10000000";
assert.that(sm['Number?'].call(str1), "check method numberq() with a big number which will be treated as infinity in javascript");
str1 = "0x1f";
assert.that(!sm['Number?'].call(str1), "check method numberq() with hex number");

assert.that(!sm['Number?'].call(""), "check method numericq() with empty string");
assert.that(sm['Number?'].call("123"), "check method numericq() with whole digits string");
assert.that(!sm['Number?'].call("123abc"), "check method numericq() with a combination of digits and alphabetic");

str1 = "hello world";
assert.that(sm['Prefix?'].call(str1, "he"), "check method 'hello world'.prefixq('he')");
assert.that(!sm['Prefix?'].call(str1, "world"), "check method 'hello world'.prefixq('world')");
assert.that(sm['Prefix?'].call(str1, "world", 6), "check method 'hello world'.prefixq('world', 6)");
assert.that(sm['Prefix?'].call(str1, "world", -5), "check method 'hello world'.prefixq('world', -5)");
assert.that(!sm['Prefix?'].call("", "hell", 0), "check method ''.prefixq('hell', 0)");
assert.that(sm['Prefix?'].call("", "", 0), "check method ''.prefixq('', 0)");

str1 = "hello";
assert.equal(sm.Repeat.call(str1, 2), "hellohello");
assert.equal(sm.Repeat.call(str1, 2.3), "hellohello");
assert.equal(sm.Repeat.call(str1, 2.8), "hellohello");
assert.equal(sm.Repeat.call(str1, 0), "");
assert.equal(sm.Repeat.call(str1, -1), "");

str1 = "hello world";
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "haha"), "hahalo hahald");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)"), "lo ld");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "haha", 1), "hahalo world");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "haha", 0), "hello world");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "&#\\2\\1"), "hel#lelo wor#rold");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "\\=&#\\2\\1"), "&#\\2\\1lo &#\\2\\1ld");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "\\U&#\\2\\E\\1"), "HEL#Lelo WOR#Rold");
assert.equal(sm.Replace.call(str1, "[hw](.)(.)", "&#\\u\\2\\1"), "hel#Lelo wor#Rold");
assert.equal(sm.Replace.call(str1, "xxx", "haha"), "hello world");
assert.equal(sm.Replace.call(str1, "([hw])(\s?)(.)", "\\2"), "llo rld");
assert.equal(sm.Replace.call(str1, "\\w+", "\\u&"), "Hello World");
assert.equal(sm.Replace.call(str1, ".", capFirst), "HELLO WORLD");

str1 = "hello world";
assert.equal(sm.Match.call(str1, "$x"), false);
assert.equal(sm.Match.call(str1, "w(..)ld").toString(), "#(#(6, 5), #(7, 2))");
assert.equal(sm.Match.call(str1, "o", false, true).toString(), "#(#(7, 1))");
assert.equal(sm.Match.call(str1, "o", 6).toString(), "#(#(7, 1))");
assert.equal(sm.Match.call(str1, "o", 6, true).toString(), "#(#(4, 1))");

str1 = "";
assert.equal(sm.Size.call(""), 0);
str1 = "hello world";
assert.equal(sm.Size.call(str1), 11);

str1 = "";
assert.equal(sm.Split.call(str1, ',').toString(), '#()');
str1 = "one two three";
assert.equal(sm.Split.call(str1, '.').toString(), '#("one two three")');
str1 = "one,two,three";
assert.equal(sm.Split.call(str1, ',').toString(), '#("one", "two", "three")');
str1 = "one,two,three,";
assert.equal(sm.Split.call(str1, ',').toString(), '#("one", "two", "three")');
str1 = "one,two,three,,,";
assert.equal(sm.Split.call(str1, ',').toString(), '#("one", "two", "three", "", "")');

str1 = "";
assert.equal(sm.Substr.call(str1, 1), "");
str1 = "hello";
assert.equal(sm.Substr.call(str1, 1), "ello");
str1 = "hello";
assert.equal(sm.Substr.call(str1, 1, -1), "ell");
str1 = "hello";
assert.equal(sm.Substr.call(str1, -3, 2), "ll");
str1 = "hello";
assert.equal(sm.Substr.call(str1, -2), "lo");

assert.that(sm['Suffix?'].call("", ""), "check method ''.suffixq('')");
assert.that(!sm['Suffix?'].call("", "a"), "check method ''.suffixq('a')");
str1 = "hello world";
assert.that(!sm['Suffix?'].call(str1, "he"), "check method 'hello world'.suffixq('he')");
str1 = "hello world";
assert.that(sm['Suffix?'].call(str1, "world"), "check method 'hello world'.suffixq('world')");

assert.equal(sm.Tr.call("", ""), "");
str1 = "one two three";
assert.equal(sm.Tr.call(str1, " "), "onetwothree");
str1 = "one two three";
assert.equal(sm.Tr.call(str1, "^ "), "  ");
str1 = "HELLO World";
assert.equal(sm.Tr.call(str1, 'A-Z', 'a-z'), "hello world");
str1 = "a    b\\tc";
assert.equal(sm.Tr.call(str1, " \\t", " "), "a b c");

assert.equal(sm.Unescape.call(""), "");
str1 = "Hello World!";
assert.equal(sm.Unescape.call(str1), "Hello World!");
str1 = "Hello\\tWorld!\\r\\n";
expected = "Hello" + String.fromCharCode(9) + "World!" +
    String.fromCharCode(13) + String.fromCharCode(10);
assert.equal(sm.Unescape.call(str1), expected);
str1 = "\\x41\\101\\'\\\"\\\\";
expected = "AA" + String.fromCharCode(39) +
    String.fromCharCode(34) + String.fromCharCode(92);
assert.equal(sm.Unescape.call(str1), expected);

str1 = "THIS is A test";
assert.equal(sm.Upper.call(str1), "THIS IS A TEST");

str1 = "THIS IS A TEST";
assert.that(sm['Upper?'].call(str1), "check method upperq() with all uppercase string");
str1 = "This is a test";
assert.that(!sm['Upper?'].call(str1), "check method upperq() with lowercase string");
str1 = "123 %$^#%";
assert.that(!sm['Upper?'].call(str1), "check method upperq() with no letter string");
assert.that(!sm['Upper?'].call(""), "check method upperq() with empty string");

// Iter & ObjectIter
function iterTest(iter: StringIter, expected: string[]) {
    let temp = iter.Next();
    let i = 0;
    while (temp !== iter) {
        assert.equal(temp, expected[i]);
        temp = iter.Next();
        ++i;
    }
}
iterTest(sm.Iter.call(''), []);
iterTest(sm.Iter.call("abc 123a"), ['a', 'b', 'c', ' ', '1', '2', '3', 'a']);

// isString
assert.equal(isString(undefined), false);
assert.equal(isString(1), false);
assert.equal(isString(true), false);
assert.equal(isString(""), true);
assert.equal(isString(new Except(new Error(), 'test')), true);
