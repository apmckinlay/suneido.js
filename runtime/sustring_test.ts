import sustring = require("./sustring");
import util = require("./utility")
import assert = require("assert");

export = function testSuString(): void {
    var str1: sustring.SuString,
        str2: sustring.SuString,
        expected: string;

    str1 = sustring.makeSuString_string("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    assert(str1.alphaq(), "check method alphaq() with all letters");
    str1 = sustring.makeSuString_string("1");
    assert(!str1.alphaq(), "check method alphaq() with digit");
    str1 = sustring.makeSuString_string("_");
    assert(!str1.alphaq(), "check method alphaq() with underscore");

    str1 = sustring.makeSuString_string("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    assert(str1.alphaNumq(), "check method alphaNumq() with all letters and numbers");
    str1 = sustring.makeSuString_string("_");
    assert(!str1.alphaq(), "check method alphaNumq() with underscore");

    str1 = sustring.makeSuString_string("");
    assert.equal(str1.asc(), 0);
    str1 = sustring.makeSuString_string("abc");
    assert.equal(str1.asc(), 97);
    str1 = sustring.makeSuString_string("#abc");
    assert.equal(str1.asc(), 35);

    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.detab().s, new String(""));
    str1 = sustring.makeSuString_string("aaa\t\tb\r\n\tcccc\td");
    assert.notDeepEqual(str1.detab().s, new String("aaa\t\tb\r\n\tcccc\td"));
    assert.deepEqual(str1.detab().s, new String("aaa     b\r\n    cccc    d"));

    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.entab().s, new String(""));
    str1 = sustring.makeSuString_string("  \t \t  ");
    assert.deepEqual(str1.entab().s, new String(""));
    str1 = sustring.makeSuString_string("     \t hel lo \t\r\n   \tend ");
    assert.deepEqual(str1.entab().s, new String("\t\t hel lo\r\n\tend"));

    str1 = sustring.makeSuString_string("hello world");
    assert.deepEqual(str1.extract(".....$"), "world");
    assert.deepEqual(str1.extract("(\\w+) \\w+"), "hello");
    assert.deepEqual(str1.extract("(hello|howdy) (\\w+)", 2), "world");
    assert.deepEqual(str1.extract("abc"), null);
    assert.deepEqual(str1.extract("hello(d?)"), "");

    str1 = sustring.makeSuString_string("hello world");
    assert.deepEqual(str1.find("o"), 4);
    assert.deepEqual(str1.find("o", 5), 7);
    assert.deepEqual(str1.find("x"), 11);
    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.find("o"), 0);

    str1 = sustring.makeSuString_string("this is a test");
    assert.deepEqual(str1.findLast("is"), 5);
    assert.deepEqual(str1.findLast("is", 4), 2);
    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.findLast("o"), null);

    str1 = sustring.makeSuString_string("this is a test");
    assert.deepEqual(str1.find1of("si"), 2);
    assert.deepEqual(str1.find1of("si", 2), 2);
    assert.deepEqual(str1.find1of("si", 4), 5);
    assert.deepEqual(str1.find1of("xy", 0), 14);

    str1 = sustring.makeSuString_string("this is a test");
    assert.deepEqual(str1.findLast1of("si"), 12);
    assert.deepEqual(str1.findLast1of("si", 12), 12);
    assert.deepEqual(str1.findLast1of("si", 11), 6);
    assert.deepEqual(str1.findLast1of("xy", 0), null);

    str1 = sustring.makeSuString_string("this is a test");
    assert.deepEqual(str1.findnot1of(" hist"), 8);
    assert.deepEqual(str1.findnot1of(" hist", 8), 8);
    assert.deepEqual(str1.findnot1of(" hist", 9), 11);
    assert.deepEqual(str1.findnot1of(" histea", 0), 14);

    str1 = sustring.makeSuString_string("this is a test");
    assert.deepEqual(str1.findLastnot1of("tse"), 9);
    assert.deepEqual(str1.findLastnot1of("tse", 9), 9);
    assert.deepEqual(str1.findLastnot1of("tse", 6), 5);
    assert.deepEqual(str1.findLastnot1of(" histea"), null);

    str1 = sustring.makeSuString_string("this is a test");
    assert(str1.hasq("this"), "check method hasq()");
    assert(!str1.hasq("thsi"), "check method hasq()");
    assert(str1.hasq(""), "check method hasq() with empty argument");
    str1 = sustring.makeSuString_string("");
    assert(!str1.hasq("thsi"), "check method hasq() with empty SuString");
    assert(str1.hasq(""), "check method hasq() with empty SuString and empty argument");

    str1 = sustring.makeSuString_string("THIS is A test");
    assert.deepEqual(str1.lower().toString(), "this is a test");

    str1 = sustring.makeSuString_string("this is a test");
    assert(str1.lowerq(), "check method lowerq() with all lowercase string");
    str1 = sustring.makeSuString_string("This is a test");
    assert(!str1.lowerq(), "check method lowerq() with uppercase string");
    str1 = sustring.makeSuString_string("123 %$^#%");
    assert(!str1.lowerq(), "check method lowerq() with no letter string");
    str1 = sustring.makeSuString_string("");
    assert(!str1.lowerq(), "check method lowerq() with empty string");

    str1 = sustring.makeSuString_string("hello world");
    str2 = str1.mapN(2, function (it) { return util.capitalizeFirstLetter(it); });
    assert.deepEqual(str1.toString(), "hello world");
    assert.deepEqual(str2.toString(), "HeLlO WoRlD");
    str1 = sustring.makeSuString_string("");
    str2 = str1.mapN(2, function (it) { return util.capitalizeFirstLetter(it); });
    assert.deepEqual(str2.toString(), "");

    str1 = sustring.makeSuString_string("-123.456");
    assert(str1.numberq(), "check method numberq() with a negative decimal with integer and float parts");
    str1 = sustring.makeSuString_string("123.456e12");
    assert(str1.numberq(), "check method numberq() with a negative decimal with integer, float and exp parts");
    str1 = sustring.makeSuString_string("hello world");
    assert(!str1.numberq(), "check method numberq() with a non-number");
    str1 = sustring.makeSuString_string("123 hello world");
    assert(!str1.numberq(), "check method numberq() with a combination of number and non-number");
    str1 = sustring.makeSuString_string("10e10000000");
    assert(str1.numberq(), "check method numberq() with a big number which will be treated as infinity in javascript");
    str1 = sustring.makeSuString_string("0x1f");
    assert(!str1.numberq(), "check method numberq() with hex number");

    str1 = sustring.makeSuString_string("");
    assert(!str1.numericq(), "check method numericq() with empty string");
    str1 = sustring.makeSuString_string("123");
    assert(str1.numericq(), "check method numericq() with whole digits string");
    str1 = sustring.makeSuString_string("123abc");
    assert(!str1.numericq(), "check method numericq() with a combination of digits and alphabetic");

    str1 = sustring.makeSuString_string("hello world");
    assert(str1.prefixq("he"), "check method 'hello world'.prefixq('he')");
    assert(!str1.prefixq("world"), "check method 'hello world'.prefixq('world')");
    assert(str1.prefixq("world", 6), "check method 'hello world'.prefixq('world', 6)");
    assert(!str1.prefixq("hell", -5), "check method 'hello world'.prefixq('world', -5)");
    str1 = sustring.makeSuString_string("");
    assert(!str1.prefixq("hell", 0), "check method ''.prefixq('hell', 0)");
    assert(str1.prefixq("", 0), "check method ''.prefixq('', 0)");

    str1 = sustring.makeSuString_string("hello");
    assert.deepEqual(str1.repeat(2).toString(), "hellohello");
    assert.deepEqual(str1.repeat(2.3).toString(), "hellohello");
    assert.deepEqual(str1.repeat(2.8).toString(), "hellohello");
    assert.deepEqual(str1.repeat(0).toString(), "");
    assert.deepEqual(str1.repeat(-1).toString(), "");

    str1 = sustring.makeSuString_string("hello world");
    assert.deepEqual(str1.replace("[hw](.)(.)", "haha").toString(), "hahalo hahald");
    assert.deepEqual(str1.replace("[hw](.)(.)").toString(), "lo ld");
    assert.deepEqual(str1.replace("[hw](.)(.)", "haha", 1).toString(), "hahalo world");
    assert.deepEqual(str1.replace("[hw](.)(.)", "haha", 0).toString(), "hello world");
    assert.deepEqual(str1.replace("[hw](.)(.)", "&#\\2\\1").toString(), "hel#lelo wor#rold");
    assert.deepEqual(str1.replace("[hw](.)(.)", "\\=&#\\2\\1").toString(), "&#\\2\\1lo &#\\2\\1ld");
    assert.deepEqual(str1.replace("[hw](.)(.)", "\\U&#\\2\\E\\1").toString(), "HEL#Lelo WOR#Rold");
    assert.deepEqual(str1.replace("[hw](.)(.)", "&#\\u\\2\\1").toString(), "hel#Lelo wor#Rold");
    assert.deepEqual(str1.replace("xxx", "haha").toString(), "hello world");
    assert.deepEqual(str1.replace("([hw])(\s?)(.)", "\\2").toString(), "llo rld")
    assert.deepEqual(str1.replace("\\w+", "\\u&").toString(), "Hello World");
    assert.deepEqual(str1.replace(".", function (m) { return m.toUpperCase() }).toString(), "HELLO WORLD");

    str1 = sustring.makeSuString_string("hello world");
    assert.deepEqual(str1.size(), 11);
    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.size(), 0);

    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.split(',').toString(), '#()');
    str1 = sustring.makeSuString_string("one two three");
    assert.deepEqual(str1.split('.').toString(), '#(one two three)');
    str1 = sustring.makeSuString_string("one,two,three");
    assert.deepEqual(str1.split(',').toString(), '#(one, two, three)');
    str1 = sustring.makeSuString_string("one,two,three,");
    assert.deepEqual(str1.split(',').toString(), '#(one, two, three)');
    str1 = sustring.makeSuString_string("one,two,three,,,");
    assert.deepEqual(str1.split(',').toString(), '#(one, two, three, , )');

    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.substr(1).toString(), "");
    str1 = sustring.makeSuString_string("hello");
    assert.deepEqual(str1.substr(1).toString(), "ello");
    str1 = sustring.makeSuString_string("hello");
    assert.deepEqual(str1.substr(1, -1).toString(), "ell");
    str1 = sustring.makeSuString_string("hello");
    assert.deepEqual(str1.substr(-3, 2).toString(), "ll");
    str1 = sustring.makeSuString_string("hello");
    assert.deepEqual(str1.substr(-2).toString(), "lo");

    str1 = sustring.makeSuString_string("");
    assert(str1.suffixq(""), "check method ''.suffixq('')");
    str1 = sustring.makeSuString_string("");
    assert(!str1.suffixq("a"), "check method ''.suffixq('a')");
    str1 = sustring.makeSuString_string("hello world");
    assert(!str1.suffixq("he"), "check method 'hello world'.suffixq('he')");
    str1 = sustring.makeSuString_string("hello world");
    assert(str1.suffixq("world"), "check method 'hello world'.suffixq('world')");

    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.tr("").toString(), "");
    str1 = sustring.makeSuString_string("one two three");
    assert.deepEqual(str1.tr(" ").toString(), "onetwothree");
    str1 = sustring.makeSuString_string("one two three");
    assert.deepEqual(str1.tr("^ ").toString(), "  ");
    str1 = sustring.makeSuString_string("HELLO World");
    assert.deepEqual(str1.tr('A-Z', 'a-z').toString(), "hello world");
    str1 = sustring.makeSuString_string("a    b\\tc");
    assert.deepEqual(str1.tr(" \\t", " ").toString(), "a b c");

    str1 = sustring.makeSuString_string("");
    assert.deepEqual(str1.unescape().toString(), "");
    str1 = sustring.makeSuString_string("Hello World!");
    assert.deepEqual(str1.unescape().toString(), "Hello World!");
    str1 = sustring.makeSuString_string("Hello\\tWorld!\\r\\n");
    expected = "Hello" + String.fromCharCode(9) + "World!" +
        String.fromCharCode(13) + String.fromCharCode(10);
    assert.deepEqual(str1.unescape().toString(), expected);
    str1 = sustring.makeSuString_string("\\x41\\101\\'\\\"\\\\");
    expected = "AA" + String.fromCharCode(39) +
        String.fromCharCode(34) + String.fromCharCode(92);
    assert.deepEqual(str1.unescape().toString(), expected);

    str1 = sustring.makeSuString_string("THIS is A test");
    assert.deepEqual(str1.upper().toString(), "THIS IS A TEST");

    str1 = sustring.makeSuString_string("THIS IS A TEST");
    assert(str1.upperq(), "check method upperq() with all uppercase string");
    str1 = sustring.makeSuString_string("This is a test");
    assert(!str1.upperq(), "check method upperq() with lowercase string");
    str1 = sustring.makeSuString_string("123 %$^#%");
    assert(!str1.upperq(), "check method upperq() with no letter string");
    str1 = sustring.makeSuString_string("");
    assert(!str1.upperq(), "check method upperq() with empty string");

    str1 = sustring.makeSuString_string("123");
    assert.deepEqual(str1.integer(), 123);
    str1 = sustring.makeSuString_string("abc");
    assert(isNaN(str1.integer()), 'check method "abc".integer()');
    str1 = sustring.makeSuString_string("123abc");
    assert.deepEqual(str1.integer(), 123);
}
