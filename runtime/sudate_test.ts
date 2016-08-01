import SuDate from "./sudate";
import * as assert from "./assert";

var sud1 = SuDate.make(2003, 11, 27, 16, 37, 33, 123),
    sud2: SuDate,
    sud3 = SuDate.make(2003, 12, 3, 0, 0, 0, 0),
    sud4 = SuDate.make(2003, 12, 3, 0, 0, 12, 345),
    sud5 = SuDate.make(2003, 12, 3, 1, 2, 3, 4),
    sud6 = SuDate.make(2005, 1, 1, 16, 37, 33, 123);

assert.equal(sud1.year(), 2003);
assert.equal(sud1.month(), 11);
assert.equal(sud1.day(), 27);
assert.equal(sud1.hour(), 16);
assert.equal(sud1.minute(), 37);
assert.equal(sud1.second(), 33);
assert.equal(sud1.millisecond(), 123);

assert.equal(sud1.weekday(), 4);
assert.equal(sud1.weekday("MON"), 3);
assert.equal(sud1.weekday(4), 0);

assert.equal(sud3.minusDays(sud1), 6);
assert.equal(sud4.minusSeconds(sud3), 12.345);

sud2 = sud3.plus({ hours: 1, minutes: 2, seconds: 3, milliseconds: 4 });
assert.that(sud2.timePart() === sud5.timePart() && sud2.datePart() === sud5.datePart(),
    "Check method plus() with hms set");

sud2 = sud1.plus({ years: 1, days: 5, months: 1 });
assert.that(sud2.timePart() === sud6.timePart() && sud2.datePart() === sud6.datePart(),
    "Check method plus() with ymd set");

sud2 = sud1.plus({ years: 1, months: 1, days: 5 });
assert.that(sud2.timePart() === sud6.timePart() && sud2.datePart() === sud6.datePart(),
    "Check method plus() with ymd set in another sequence");

//assert.throws(function() { sud1.plus({ day: 1 }); });

assert.equal(sud1.formatEn("dddd, MMMM d, yyyy"), "Thursday, November 27, 2003");
assert.equal(sud1.formatEn("ddd, MMM. dd, \\'yy"), "Thu, Nov. 27, '03");
assert.equal(sud1.formatEn("MM/dd/yy"), "11/27/03");
assert.equal(sud1.formatEn("yyyyMMdd"), "20031127");
assert.equal(sud1.formatEn("h:mmaa"), "4:37pm");
assert.equal(sud1.formatEn("HH:mm:ss"), "16:37:33");
assert.equal(sud1.formatEn("yyyy-MM-dd H:mm"), "2003-11-27 16:37");
assert.equal(sud1.formatEn("dd \\de MMM"), "27 de Nov");
assert.equal(sud1.formatEn("dd 'de' MMM"), "27 de Nov");

sud2 = SuDate.parse("#20150326.122334456", "yyyyMMdd");
assert.equal(sud2.formatEn("yyyy-MM-dd H:mm:ss"), "2015-03-26 12:23:34");
sud2 = SuDate.parse("2000/3/4 8:34:56", "yyyyMMdd");
assert.equal(sud2.formatEn("yyyy-MM-dd H:mm:ss"), "2000-03-04 8:34:56");

sud2 = SuDate.literal("#19990101");
assert.equal(sud2.toString(), "#19990101.000000000");
sud2 = SuDate.literal("#19990101.010203456");
assert.equal(sud2.toString(), "#19990101.010203456");
sud2 = SuDate.literal("");
assert.that(sud2 === null, "Check method literal() with empty string");
sud2 = SuDate.literal("#19990229");
assert.that(sud2 === null, "Check method literal() with invalid date argument");
sud2 = SuDate.literal("#19990229.285959000");
assert.that(sud2 === null, "Check method literal() with invalid time argument");

sud1 = SuDate.timestamp();
sud2 = SuDate.timestamp();
sud3 = SuDate.timestamp();
if (sud1.datePart() === sud2.datePart()) {
    assert.that(sud1.timePart() < sud2.timePart(), "check function timestamp(): new timestamp bigger than old timestamp");
} else {
    assert.that(sud1.datePart() < sud2.datePart(), "check function timestamp(): new timestamp bigger than old timestamp");
}
if (sud2.datePart() === sud3.datePart()) {
    assert.that(sud2.timePart() < sud3.timePart(), "check function timestamp(): new timestamp bigger than old timestamp 1");
} else {
    assert.that(sud2.datePart() < sud3.datePart(), "check function timestamp(): new timestamp bigger than old timestamp 2");
}
