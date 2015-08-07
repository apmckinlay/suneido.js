"use strict";

import sustring = require("./sustring");
import util = require("./utility")
import assert = require("assert");

export function testSuString(): void {
    var str1: sustring.SuString,
        str2: sustring.SuString;

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
}