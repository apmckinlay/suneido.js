import * as ss from "./stringmethods";
import * as util from "./utility";
import * as assert from "./assert";

let str1: string;
let str2: string;
let expected: string;

str1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
assert.that(ss.alphaq(str1), "check method alphaq() with all letters");
str1 = "1";
assert.that(!ss.alphaq(str1), "check method alphaq() with digit");
str1 = "_";
assert.that(!ss.alphaq(str1), "check method alphaq() with underscore");

str1 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
assert.that(ss.alphaNumq(str1), "check method alphaNumq() with all letters and numbers");
str1 = "_";
assert.that(!ss.alphaq(str1), "check method alphaNumq() with underscore");

assert.equal(ss.asc(""), 0);
assert.equal(ss.asc("abc"), 97);
assert.equal(ss.asc("#abc"), 35);

assert.equal(ss.detab(""), "");
str1 = "aaa\t\tb\r\n\tcccc\td";
assert.equal(ss.detab(str1), `aaa     b\r\n    cccc    d`);
assert.equal(ss.detab(str1), "aaa     b\r\n    cccc    d") ;

assert.equal(ss.entab(""), "");
str1 = "  \t \t  ";
assert.equal(ss.entab(str1), "");
str1 = "     \t hel lo \t\r\n   \tend ";
assert.equal(ss.entab(str1), "\t\t hel lo\r\n\tend");

str1 = "hello world";
assert.equal(ss.extract(str1, ".....$"), "world");
assert.equal(ss.extract(str1, "(\\w+) \\w+"), "hello");
assert.equal(ss.extract(str1, "(hello|howdy) (\\w+)", 2), "world");
assert.equal(ss.extract(str1, "abc"), false);
assert.equal(ss.extract(str1, "hello(d?)"), "");

assert.equal(ss.find(str1, "o"), 4);
assert.equal(ss.find(str1, "o", 5), 7);
assert.equal(ss.find(str1, "x"), 11);
assert.equal(ss.find("", "o"), 0);

str1 = "this is a test";
assert.equal(ss.findLast(str1, "is"), 5);
assert.equal(ss.findLast(str1, "is", 4), 2);
assert.equal(ss.findLast("", "o"), false);

assert.equal(ss.find1of(str1, "si"), 2);
assert.equal(ss.find1of(str1, "si", 2), 2);
assert.equal(ss.find1of(str1, "si", 4), 5);
assert.equal(ss.find1of(str1, "xy", 0), 14);

assert.equal(ss.findLast1of(str1, "si"), 12);
assert.equal(ss.findLast1of(str1, "si", 12), 12);
assert.equal(ss.findLast1of(str1, "si", 11), 6);
assert.equal(ss.findLast1of(str1, "xy", 0), false);

assert.equal(ss.findnot1of(str1, " hist"), 8);
assert.equal(ss.findnot1of(str1, " hist", 8), 8);
assert.equal(ss.findnot1of(str1, " hist", 9), 11);
assert.equal(ss.findnot1of(str1, " histea", 0), 14);

assert.equal(ss.findLastnot1of(str1, "tse"), 9);
assert.equal(ss.findLastnot1of(str1, "tse", 9), 9);
assert.equal(ss.findLastnot1of(str1, "tse", 6), 5);
assert.equal(ss.findLastnot1of(str1, " histea"), false);

assert.that(ss.hasq(str1, "this"), "check method hasq()");
assert.that(!ss.hasq(str1, "thsi"), "check method hasq()");
assert.that(ss.hasq(str1, ""), "check method hasq() with empty argument");
assert.that(!ss.hasq("", "thsi"), "check method hasq() with empty SuString");
assert.that(ss.hasq("", ""), "check method hasq() with empty SuString and empty argument");

str1 = "THIS is A test";
assert.equal(ss.lower(str1), "this is a test");

str1 = "this is a test";
assert.that(ss.lowerq(str1), "check method lowerq() with all lowercase string");
str1 = "This is a test";
assert.that(!ss.lowerq(str1), "check method lowerq() with uppercase string");
str1 = "123 %$^#%";
assert.that(!ss.lowerq(str1), "check method lowerq() with no letter string");
str1 = "";
assert.that(!ss.lowerq(str1), "check method lowerq() with empty string");

str1 = "hello world";
str2 = ss.mapN(str1, 2, function(it) { return util.capitalizeFirstLetter(it); });
assert.equal(str2, "HeLlO WoRlD");
str1 = "";
str2 = ss.mapN(str1, 2, function(it) { return util.capitalizeFirstLetter(it); });
assert.equal(str2, "");

str1 = "-123.456";
assert.that(ss.numberq(str1), "check method numberq() with a negative decimal with integer and float parts");
str1 = "123.456e12";
assert.that(ss.numberq(str1), "check method numberq() with a negative decimal with integer, float and exp parts");
str1 = "hello world";
assert.that(!ss.numberq(str1), "check method numberq() with a non-number");
str1 = "123 hello world";
assert.that(!ss.numberq(str1), "check method numberq() with a combination of number and non-number");
str1 = "10e10000000";
assert.that(ss.numberq(str1), "check method numberq() with a big number which will be treated as infinity in javascript");
str1 = "0x1f";
assert.that(!ss.numberq(str1), "check method numberq() with hex number");

assert.that(!ss.numericq(""), "check method numericq() with empty string");
assert.that(ss.numericq("123"), "check method numericq() with whole digits string");
assert.that(!ss.numericq("123abc"), "check method numericq() with a combination of digits and alphabetic");

str1 = "hello world";
assert.that(ss.prefixq(str1, "he"), "check method 'hello world'.prefixq('he')");
assert.that(!ss.prefixq(str1, "world"), "check method 'hello world'.prefixq('world')");
assert.that(ss.prefixq(str1, "world", 6), "check method 'hello world'.prefixq('world', 6)");
assert.that(!ss.prefixq(str1, "world", -5), "check method 'hello world'.prefixq('world', -5)");
assert.that(!ss.prefixq("", "hell", 0), "check method ''.prefixq('hell', 0)");
assert.that(ss.prefixq("", "", 0), "check method ''.prefixq('', 0)");

str1 = "hello";
assert.equal(ss.repeat(str1, 2), "hellohello");
assert.equal(ss.repeat(str1, 2.3), "hellohello");
assert.equal(ss.repeat(str1, 2.8), "hellohello");
assert.equal(ss.repeat(str1, 0), "");
assert.equal(ss.repeat(str1, -1), "");

str1 = "hello world";
assert.equal(ss.replace(str1, "[hw](.)(.)", "haha"), "hahalo hahald");
assert.equal(ss.replace(str1, "[hw](.)(.)"), "lo ld");
assert.equal(ss.replace(str1, "[hw](.)(.)", "haha", 1), "hahalo world");
assert.equal(ss.replace(str1, "[hw](.)(.)", "haha", 0), "hello world");
assert.equal(ss.replace(str1, "[hw](.)(.)", "&#\\2\\1"), "hel#lelo wor#rold");
assert.equal(ss.replace(str1, "[hw](.)(.)", "\\=&#\\2\\1"), "&#\\2\\1lo &#\\2\\1ld");
assert.equal(ss.replace(str1, "[hw](.)(.)", "\\U&#\\2\\E\\1"), "HEL#Lelo WOR#Rold");
assert.equal(ss.replace(str1, "[hw](.)(.)", "&#\\u\\2\\1"), "hel#Lelo wor#Rold");
assert.equal(ss.replace(str1, "xxx", "haha"), "hello world");
assert.equal(ss.replace(str1, "([hw])(\s?)(.)", "\\2"), "llo rld");
assert.equal(ss.replace(str1, "\\w+", "\\u&"), "Hello World");
assert.equal(ss.replace(str1, ".", function(m) { return m.toUpperCase(); }), "HELLO WORLD");

str1 = "hello world";
assert.equal(ss.size(str1), 11);
str1 = "";
assert.equal(ss.size(""), 0);

str1 = "";
let split = ss.split(str1, ',');
assert.equal(ss.split(str1, ',').toString(), '#()');
str1 = "one two three";
assert.equal(ss.split(str1, '.').toString(), '#(one two three)');
str1 = "one,two,three";
assert.equal(ss.split(str1, ',').toString(), '#(one, two, three)');
str1 = "one,two,three,";
assert.equal(ss.split(str1, ',').toString(), '#(one, two, three)');
str1 = "one,two,three,,,";
assert.equal(ss.split(str1, ',').toString(), '#(one, two, three, , )');

str1 = "";
assert.equal(ss.substr(str1, 1), "");
str1 = "hello";
assert.equal(ss.substr(str1, 1), "ello");
str1 = "hello";
assert.equal(ss.substr(str1, 1, -1), "ell");
str1 = "hello";
assert.equal(ss.substr(str1, -3, 2), "ll");
str1 = "hello";
assert.equal(ss.substr(str1, -2), "lo");

assert.that(ss.suffixq("", ""), "check method ''.suffixq('')");
assert.that(!ss.suffixq("", "a"), "check method ''.suffixq('a')");
str1 = "hello world";
assert.that(!ss.suffixq(str1, "he"), "check method 'hello world'.suffixq('he')");
str1 = "hello world";
assert.that(ss.suffixq(str1, "world"), "check method 'hello world'.suffixq('world')");

assert.equal(ss.tr("", ""), "");
str1 = "one two three";
assert.equal(ss.tr(str1, " "), "onetwothree");
str1 = "one two three";
assert.equal(ss.tr(str1, "^ "), "  ");
str1 = "HELLO World";
assert.equal(ss.tr(str1, 'A-Z', 'a-z'), "hello world");
str1 = "a    b\\tc";
assert.equal(ss.tr(str1, " \\t", " "), "a b c");

assert.equal(ss.unescape(""), "");
str1 = "Hello World!";
assert.equal(ss.unescape(str1), "Hello World!");
str1 = "Hello\\tWorld!\\r\\n";
expected = "Hello" + String.fromCharCode(9) + "World!" +
    String.fromCharCode(13) + String.fromCharCode(10);
assert.equal(ss.unescape(str1), expected);
str1 = "\\x41\\101\\'\\\"\\\\";
expected = "AA" + String.fromCharCode(39) +
    String.fromCharCode(34) + String.fromCharCode(92);
assert.equal(ss.unescape(str1), expected);

str1 = "THIS is A test";
assert.equal(ss.upper(str1), "THIS IS A TEST");

str1 = "THIS IS A TEST";
assert.that(ss.upperq(str1), "check method upperq() with all uppercase string");
str1 = "This is a test";
assert.that(!ss.upperq(str1), "check method upperq() with lowercase string");
str1 = "123 %$^#%";
assert.that(!ss.upperq(str1), "check method upperq() with no letter string");
assert.that(!ss.upperq(""), "check method upperq() with empty string");

str1 = "123";
assert.equal(ss.integer(str1), 123);
str1 = "abc";
assert.that(isNaN(ss.integer(str1)), 'check method "abc".integer()');
str1 = "123abc";
assert.equal(ss.integer(str1), 123);
