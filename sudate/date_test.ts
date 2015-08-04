"use strict";

import date = require("./date");
import assert = require("assert");

function testDateTime(): void {
    var dt = date.makeDateTime_full(2003, 11, 27, 16, 37, 33, 123);
    var dt2 = date.makeDateTime_int_int(dt.date(), dt.time());

    assert(dt2.year === 2003, "Check initialize year.");
    assert(dt2.month === 11, "Check initialize month.");
    assert(dt2.day === 27, "Check initialize date.");
    assert(dt2.hour === 16, "Check initialize hours.");
    assert(dt2.minute === 37, "Check initialize minutes.");
    assert(dt2.second === 33, "Check initialize seconds.");
    assert(dt2.millisecond === 123, "Check initialize milliseconds.");

    assert(dt2.day_of_week() === 4, "Check method day_of_week().");

    var dt3 = date.makeDateTime_full(2003, 12, 3, 0, 0, 0, 0);
    assert(dt3.minus_days(dt) === 6, "Check method minus_days().");

    var dt4 = date.makeDateTime_full(2003, 12, 3, 0, 0, 12, 345);
    assert(dt4.minus_milliseconds(dt3) === 12345,
        "Check method minus_milliseconds()");

    dt3.plus(0, 0, 0, 1, 2, 3, 4);
    var dt5 = date.makeDateTime_full(2003, 12, 3, 1, 2, 3, 4);
    assert(dt3.date() === dt5.date() && dt3.time() === dt5.time(),
        "Check method plus() with hms set");

    dt.plus(0, 0, 6, 0, 0, 0, 0);
    var dt6 = date.makeDateTime_full(2003, 12, 3, 16, 37, 33, 123);
    assert(dt.time() === dt6.time() && dt.date() === dt6.date(),
        "Check method plus() with d set");

    var dt7 = date.makeDateTime_full(2003, 12, 3, 16, 37, 33, 123);
    assert(dt7.valid(), "Check method valid() with true");
    dt7 = date.makeDateTime_full(2003, 13, 3, 16, 37, 33, 123);
    assert(!dt7.valid(), "Check method valid() with false");
    dt7 = date.makeDateTime_full(2004, 2, 29, 16, 37, 33, 123);
    assert(dt7.valid(), "Check method valid() with leap year");
}

testDateTime();
