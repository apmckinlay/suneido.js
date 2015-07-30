import dateTime = require("./date")
import suneidoTest = require("./testing")
///<reference path="node.d.ts"/>
import assert = require("assert")

export interface SuDate {
    d: dateTime.DateTime;

    formatEn(fmt: string): string;
    plus(args: Object): SuDate;
    minusDays(d2: SuDate): number;
    minusSeconds(d2: SuDate): number;
    year(): number;
    month(): number;
    day(): number;
    hour(): number;
    minute(): number;
    second(): number;
    millisecond(): number;
    weekday(firstDay?: any): number;
}

var sudate = Object.create(null);

function SuDate(date: number, time: number): void {
    this.d = dateTime.makeDateTime_int_int(date, time);
}

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getNdigit(s: string, start: number, n: number) {
    return parseInt(s.slice(start, start + n));
}

function ampmAhead(s: string, start: number): boolean {
    var str;
    if (s[start] === ' ')
        start += 1;
    str = s.slice(start, start + 2).toLowerCase();
    return str === 'am' || str === 'pm';
}

function arrayFill(a: Array<any>, start: number, end: number, value: any): void {
    var i: number;
    for (i = start; i < end; i++) {
        a[i] = value;
    }
}

function compare(sd1: SuDate, sd2: SuDate): number {
    var res: number;
    if ((res = sd1.d.year - sd2.d.year) !== 0)
        return res;
    else if ((res = sd1.d.month - sd2.d.month) !== 0)
        return res;
    else if ((res = sd1.d.day - sd2.d.day) !== 0)
        return res;
    else if ((res = sd1.d.hour - sd2.d.hour) !== 0)
        return res;
    else if ((res = sd1.d.minute - sd2.d.minute) !== 0)
        return res;
    else if ((res = sd1.d.second - sd2.d.second) !== 0)
        return res;
    else
        return sd1.d.millisecond - sd2.d.millisecond;
}

SuDate["prev"] = makeSuDate_empty();
SuDate["timestamp"] = function (): SuDate {
    var ts: SuDate = makeSuDate_empty();
    if (compare(ts, SuDate["prev"]) <= 0)
        ts = SuDate["prev"].increment();
    else
        SuDate["prev"] = ts;
    return ts;
}

enum TokenType { YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, MILLISECOND, UUK };
var minval: Array<number> = [0, 1, 1, 0, 0, 0, 0];
var maxval: Array<number> = [3000, 12, 31, 23, 59, 59, 999]

SuDate["parse"] = function (s: string, order: string): SuDate {
    const NOTSET = 9999,
        MAXTOKENS = 20;
    var dt: Object = { year: NOTSET, month: 0, day: 0, hour: NOTSET, minute: NOTSET, second: NOTSET, millisecond: 0 },
        date_patterns: Array<string> = [
            "", // set to system default
            "md",
            "dm",
            "dmy",
            "mdy",
            "ymd"
        ],
        getSyspat = function (): string {
            var i: number = 0,
                prev: string = null,
                j: number,
                tmp: string,
                syspatArray: Array<string> = [],
                syspatRes: string;
            for (j = 0; order[j] && i < 3; prev = order[j], j += 1) {
                if (order[j] !== prev && ((order[j] === 'y') || (order[j] === 'M') || (order[j] === 'd'))) {
                    syspatArray[i] = order[j].toLowerCase();
                    i += 1;
                }
            }
            if (i !== 3) {
                suneidoTest.except("invalid date format: '" + order + "'");
            }
            date_patterns[0] = syspatRes = syspatArray.join('');

            // swap month-day patterns if system setting is day first
            for (i = 0; i < 3; i += 1) {
                if (syspatArray[i] === 'm')
                    break;
                else if (syspatArray[i] === 'd') {
                    tmp = date_patterns[1];
                    date_patterns[1] = date_patterns[2];
                    date_patterns[2] = tmp;
                }
            }
            return syspatRes;
        },
        syspat: string = getSyspat(),
        types: Array<TokenType> = [],
        tokens: Array<number> = [],
        ntokens: number = 0,
        got_time: boolean = false,
        prev: string = null,
        i: number,
        j: number,
        k: number,
        n: number,
        buf: string,
        curPattern: string,
        part: TokenType,
        now: dateTime.DateTime,
        thisyr: number,
        thismo: number,
        thisd: number;
    arrayFill(types, 0, MAXTOKENS, TokenType.UUK);
    i = 0;
    while (i < s.length) {
        suneidoTest.assert(ntokens < MAXTOKENS, "Current token number is bigger than MAXTOKENS");
        if (isLetter(s[i])) {
            j = i;
            while (isLetter(s[++i]));
            buf = capitalizeFirstLetter(s.slice(j, i).toLowerCase());
            for (j = 0; j < month.length; j += 1) {
                if (month[j].indexOf(buf) !== -1)
                    break;
            }
            if (j < month.length) {
                types[ntokens] = TokenType.MONTH;
                tokens[ntokens] = j + 1;
                ntokens += 1;
            } else if (buf === "Am" || buf === "Pm") {
                if (buf.charAt(0) === 'P') {
                    if (dt["hour"] < 12)
                        dt["hour"] += 12;
                } else {
                    if (dt["hour"] === 12)
                        dt["hour"] = 0;
                    if (dt["hour"] > 12)
                        suneidoTest.except("SuDate.parse: Hour > 12 when 'AM' used."); //change to return SuFalse after SuFalse is implemented
                }
            } else {
                // ignore days of week
                for (j = 0; j < weekday.length; j += 1) {
                    if (weekday[j].indexOf(buf) !== -1)
                        break;
                }
                if (j >= weekday.length)
                    suneidoTest.except("SuDate.parse: Un-parsable partten '" + buf + "' in arguments."); //change to return SuFalse after SuFalse is implemented
            }
        } else if (isDigit(s[i])) {
            j = i;
            while (isDigit(s[++i]));
            n = getNdigit(s, j, i - j);
            suneidoTest.assert(i > j, "SuDate.parse: char index not increased after searching digits.");
            if ((i - j === 6) || (i - j === 8)) {
                if (i - j === 6) { // date with no separators with yy
                    tokens[ntokens++] = getNdigit(s, j, 2);
                    tokens[ntokens++] = getNdigit(s, j + 2, 2);
                    tokens[ntokens++] = getNdigit(s, j + 4, 2);
                } else if (i - j === 8) { // date with no separators with yyyy
                    for (k = 0; k < 3; j += syspat[k] === 'y' ? 4 : 2, k += 1)
                        tokens[ntokens++] = syspat[k] === 'y' ? getNdigit(s, j, 4) : getNdigit(s, j, 2);
                }
                if (s[i] === '.') {
                    i += 1;
                    j = i;
                    while (isDigit(s[++i]));
                    if ((i - j === 4) || (i - j === 6) || (i - j === 9)) {
                        dt["hour"] = getNdigit(s, j, 2);
                        j += 2;
                        dt["minute"] = getNdigit(s, j, 2);
                        j += 2;
                        if (i - j >= 2) {
                            dt["second"] = getNdigit(s, j, 2);
                            j += 2;
                            if (i - j === 3)
                                dt["millisecond"] = getNdigit(s, j, 3);
                        }
                    }
                }
            } else if (prev === ':' || s[i] === ':' || ampmAhead(s, i)) { //time
                got_time = true;
                if (dt["hour"] === NOTSET)
                    dt["hour"] = n;
                else if (dt["minute"] === NOTSET)
                    dt["minute"] = n;
                else if (dt["second"] === NOTSET)
                    dt["second"] = n;
                else
                    suneidoTest.except("SuDate.parse: Un-parsable value after ':' or before am/pm"); //change to return SuFalse after SuFalse is implemented
            } else { //date
                tokens[ntokens] = n;
                if (prev === '\'')
                    types[ntokens] = TokenType.YEAR;
                ntokens += 1;
            }
        } else
            prev = s[i++]; //ignore
    }
    if (dt["hour"] === NOTSET)
        dt["hour"] = 0;
    if (dt["minute"] === NOTSET)
        dt["minute"] = 0;
    if (dt["second"] === NOTSET)
        dt["second"] = 0;

    //search for data match
    for (i = 0; i < date_patterns.length; i++) {
        //try one pattern
        curPattern = date_patterns[i];
        for (j = 0; curPattern[j] && j < ntokens; j++) {
            switch (curPattern[j]) {
                case 'y':
                    part = TokenType.YEAR;
                    break;
                case 'm':
                    part = TokenType.MONTH;
                    break;
                case 'd':
                    part = TokenType.DAY;
                    break;
                default:
                    suneidoTest.unreachable();
            }
            if ((types[j] !== TokenType.UUK && types[j] !== part) ||
                tokens[j] < minval[part] || tokens[j] > maxval[part])
                break;
        }
        // stop at first match
        if (!curPattern[j] && j === ntokens)
            break;
    }

    now = dateTime.makeDateTime_empty();
    thisyr = now.year;
    thismo = now.month;
    thisd = now.day;

    if (i < date_patterns.length) {
        // use match
        curPattern = date_patterns[i];
        for (j = 0; curPattern[j]; j++) {
            switch (curPattern[j]) {
                case 'y':
                    dt["year"] = tokens[j];
                    break;
                case 'm':
                    dt["month"] = tokens[j];
                    break;
                case 'd':
                    dt["day"] = tokens[j];
                    break;
                default:
                    suneidoTest.unreachable();
            }
        }
    } else if (got_time && ntokens === 0) {
        dt["year"] = thisyr;
        dt["month"] = thismo;
        dt["day"] = thisd;
    } else // no match
        suneidoTest.except("SuDate.parse: no matched result"); //change to return SuFalse after SuFalse is implemented

    if (dt["year"] === NOTSET) {
        if (dt["month"] >= Math.max(thismo - 5, 1) &&
            dt["month"] <= Math.min(thismo + 6, 12))
            dt["year"] = thisyr;
        else if (thismo < 6)
            dt["year"] = thisyr - 1;
        else
            dt["year"] = thisyr + 1;
    } else if (dt["year"] < 100) {
        dt["year"] += thisyr - thisyr % 100;
        if (dt["year"] - thisyr > 20)
            dt["year"] -= 100;
    }
    var newDT = dateTime.makeDateTime_full(dt["year"], dt["month"], dt["day"], dt["hour"], dt["minute"], dt["second"], dt["millisecond"])
    if (!newDT.valid())
        suneidoTest.except("SuDate.parse: invalid Date"); //change to return SuFalse after SuFalse is implemented
    return makeSuDate_int_int(newDT.date(), newDT.time());
}


SuDate.prototype = sudate;

export function makeSuDate_empty(): SuDate {
    var dt = dateTime.makeDateTime_empty(),
        sd = new SuDate(dt.date(), dt.time());
    return sd;
}

export function makeSuDate_int_int(d: number, t: number): SuDate {
    var sd = new SuDate(d, t);
    return sd;
}

function isLetter(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if (((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122))) {
            return true;
        }
    }
    return false;
}

function isDigit(char: string): boolean {
    var code;
    if (char && char.length === 1) {
        code = char.charCodeAt(0);
        if ((code >= 48) && (code <= 57)) {
            return true;
        }
    }
    return false;
}

function format(dt: SuDate, fmt: string): string {
    var dst: string = '',
        i:  number,
        n:  number,
        c:  string,
        yr: number,
        mo: number,
        wd: number,
        d:  number,
        hr: number,
        mi: number,
        s:  number;
    for (i = 0; i < fmt.length; i += 1) {
        n = 1;
        if (isLetter(fmt[i])) {
            for (c = fmt[i]; c === fmt[i + 1]; i += 1) {
                n += 1;
            }
        }
        switch (fmt[i]) {
            case 'y':
                yr = dt.year();
                if (n >= 4) {
                    dst += yr.toString();
                } else if (n === 3) {
                    dst += (yr % 1000).toString();
                } else if (n === 2) {
                    dst += ('0' + (yr % 100).toString()).slice(-2);
                } else {
                    dst += (yr % 100).toString();
                }
                break;
            case 'M':
                mo = dt.month() - 1;
                if (n > 3) {
                    dst += month[mo];
                } else if (n === 3) {
                    dst += month[mo].substring(0, 3);
                } else if (n === 2) {
                    dst += ('0' + (mo + 1).toString()).slice(-2);
                } else {
                    dst += (mo + 1).toString();
                }
                break;
            case 'd':
                wd = dt.weekday();
                d = dt.day();
                if (n > 3) {
                    dst += weekday[wd];
                } else if (n === 3) {
                    dst += weekday[wd].substring(0, 3);
                } else if (n === 2) {
                    dst += ('0' + d.toString()).slice(-2);
                } else {
                    dst += d.toString();
                }
                break;
            case 'h':
                hr = dt.hour() % 12;
                if (hr === 0) {
                    hr = 12;
                }
                if (n >= 2) {
                    dst += ('0' + hr.toString()).slice(-2);
                } else {
                    dst += hr.toString();
                }
                break;
            case 'H':
                hr = dt.hour();
                if (n >= 2) {
                    dst += ('0' + hr.toString()).slice(-2);
                } else {
                    dst += hr.toString();
                }
                break;
            case 'm':
                mi = dt.minute();
                if (n >= 2) {
                    dst += ('0' + mi.toString()).slice(-2);
                } else {
                    dst += mi.toString();
                }
                break;
            case 's':
                s = dt.second();
                if (n >= 2) {
                    dst += ('0' + s.toString()).slice(-2);
                } else {
                    dst += s.toString();
                }
                break;
            case 'a':
                dst += dt.hour() < 12 ? 'a' : 'p';
                if (n > 1) {
                    dst += 'm'
                }
                break;
            case 'A':
            case 't':
                dst += dt.hour() < 12 ? 'A' : 'P';
                if (n > 1) {
                    dst += 'M'
                }
                break;
            case '\'':
                i++;
                while (fmt[i] && fmt[i] !== '\'') {
                    dst += fmt[i];
                    i += 1;
                }
                break;
            case '\\':
                i += 1;
                dst += fmt[i];
                break;
            default:
                n -= 1;
                while (n >= 0) {
                    dst += fmt[i];
                    n -= 1;
                }
        }
    }
    return dst;
}

sudate.formatEn = function (fmt: string): string {
    if (arguments.length !== 1) {
        suneidoTest.except("usage: date.Format(format)");
    }
    return format(this, fmt);
}

SuDate["literal"] = function (s: string): SuDate {
    var i: number = 0,
        t: number,
        sn: number,
        tn: number,
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        dt: dateTime.DateTime;
    if (s[i] === '#')
        i++;
    t = s.indexOf('.', i);
    if (t !== -1) {
        sn = t - i;
        tn = s.length - t - 1;
    } else {
        sn = s.length - i;
        tn = 0;
    }
    if (sn !== 8 || (tn !== 0 && tn !== 4 && tn !== 6 && tn !== 9))
        suneidoTest.except("SuDate.literal: invalid literal argument.");  //change to return value after value is implemented

    year = getNdigit(s, i, 4);
    month = getNdigit(s, i + 4, 2);
    day = getNdigit(s, i + 6, 2);

    hour = tn >= 2 ? getNdigit(s, t + 1, 2) : 0;
    minute = tn >= 4 ? getNdigit(s, t + 3, 2) : 0;
    second = tn >= 6 ? getNdigit(s, t + 5, 2) : 0;
    millisecond = tn >= 9 ? getNdigit(s, t + 7, 3) : 0;

    dt = dateTime.makeDateTime_full(year, month, day, hour, minute, second, millisecond);
    if (!dt.valid())
        suneidoTest.except("SuDate.literal: invalid Date"); //change to return SuFalse after SuFalse is implemented
    return makeSuDate_int_int(dt.date(), dt.time());
}

sudate.increment = function (): SuDate {
    this.d.plus(0, 0, 0, 0, 0, 0, 1);
    return this;
}

sudate.plus = function (args: Object): SuDate {
    var usage: string = "usage: Plus(years:, months:, days:, hours:, minutes:, seconds:, milliseconds:)",
        ok: boolean = false,
        years: number = (ok = true, args["years"]) | 0,
        months: number = (ok = true, args["months"]) | 0,
        days: number = (ok = true, args["days"]) | 0,
        hours: number = (ok = true, args["hours"]) | 0,
        minutes: number = (ok = true, args["minutes"]) | 0,
        seconds: number = (ok = true, args["seconds"]) | 0,
        milliseconds: number = (ok = true, args["milliseconds"]) | 0,
        dt = dateTime.makeDateTime_int_int(this.d.date(), this.d.time());

    if (!ok) {
        suneidoTest.except(usage);
    }
    dt.plus(years, months, days, hours, minutes, seconds, milliseconds);
    //date validation
    return makeSuDate_int_int(dt.date(), dt.time());
}

sudate.minusDays = function (sud2: SuDate): number {
    if (arguments.length !== 1) {
        suneidoTest.except("usage: date.Minus(date)");
    }
    return this.d.minus_days(sud2.d);
}

sudate.minusSeconds = function (sud2: SuDate): number {
    if (arguments.length !== 1) {
        suneidoTest.except("usage: date.MinusSeconds(date)");
    }
    return this.d.minus_milliseconds(sud2.d);
}

sudate.year = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Year()");
    }
    return this.d.year;
}

sudate.month = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Month()");
    }
    return this.d.month;
}

sudate.day = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Day()");
    }
    return this.d.day;
}

sudate.hour = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Hour()");
    }
    return this.d.hour;
}

sudate.minute = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Minute()");
    }
    return this.d.minute;
}

sudate.second = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Second()");
    }
    return this.d.second;
}

sudate.millisecond = function (): number {
    if (arguments.length !== 0) {
        suneidoTest.except("usage: date.Millisecond()");
    }
    return this.d.millisecond;
}

var month: Array<string> = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
var weekday: Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];

sudate.weekday = function (firstDay?: string|number): number {
    if (arguments.length !== 0 && arguments.length !== 1) {
        suneidoTest.except("usage: date.WeekDay(firstDay = 'Sun')");
    }
    var i: number = 0,
        s;
    if (arguments.length === 1) {
        if (typeof firstDay === "string") {
            s = firstDay.toLowerCase();
            for (i = 0; i < 7; i += 1) {
                if (weekday[i].toLowerCase().indexOf(s) === 0)
                    break;
            }
            if (i >= 7)
                suneidoTest.except("usage: date.WeekDay( <day of week> )");
        } else if (!isNaN(firstDay)) {
            i = firstDay;
        } else {
            suneidoTest.except("usage: date.WeekDay( <day of week> )");
        }
    }
    return (this.d.day_of_week() - i + 7) % 7;
}

sudate.toString = function (): string {
    var s: string = "#";
    s += ("0000" + this.d.year).slice(-4);
    s += ("0" + this.d.month).slice(-2);
    s += ("0" + this.d.day).slice(-2);
    s += '.';
    s += ("0" + this.d.hour).slice(-2);
    s += ("0" + this.d.minute).slice(-2);
    s += ("0" + this.d.second).slice(-2);
    s += ("000" + this.d.millisecond).slice(-3);
    return s;
}

function testSuDate(): void {
    var d1 = dateTime.makeDateTime_full(2003, 11, 27, 16, 37, 33, 123),
        d3 = dateTime.makeDateTime_full(2003, 12, 3, 0, 0, 0, 0),
        d4 = dateTime.makeDateTime_full(2003, 12, 3, 0, 0, 12, 345),
        d5 = dateTime.makeDateTime_full(2003, 12, 3, 1, 2, 3, 4),
        d6 = dateTime.makeDateTime_full(2005, 1, 1, 16, 37, 33, 123),
        sud1 = makeSuDate_int_int(d1.date(), d1.time()),
        sud2,
        sud3 = makeSuDate_int_int(d3.date(), d3.time()),
        sud4 = makeSuDate_int_int(d4.date(), d4.time()),
        sud5 = makeSuDate_int_int(d5.date(), d5.time()),
        sud6 = makeSuDate_int_int(d6.date(), d6.time());

    assert(sud1.year() === 2003, "Check initialize year.");
    assert(sud1.month()=== 11, "Check initialize month.");
    assert(sud1.day() === 27, "Check initialize date.");
    assert(sud1.hour() === 16, "Check initialize hours.");
    assert(sud1.minute() === 37, "Check initialize minutes.");
    assert(sud1.second() === 33, "Check initialize seconds.");
    assert(sud1.millisecond() === 123, "Check initialize milliseconds.");

    assert(sud1.weekday() === 4, "Check method weekday() with no arg.");
    assert(sud1.weekday("MON") === 3, "Check method weekday() with string arg.");
    assert(sud1.weekday(4) === 0, "Check method weekday() with number arg.");

    assert(sud3.minusDays(sud1) === 6, "Check method minus_days().");
    assert(sud4.minusSeconds(sud3) === 12345, "Check method minus_milliseconds()");

    sud2 = sud3.plus({hours: 1, minutes: 2, seconds: 3, milliseconds: 4});
    assert(sud2.d.time() === sud5.d.time() && sud2.d.date() === sud5.d.date(), "Check method plus() with hms set");

    sud2 = sud1.plus({years: 1, days: 5, months: 1});
    assert(sud2.d.time() === sud6.d.time() && sud2.d.date() === sud6.d.date(), "Check method plus() with ymd set");
    sud2 = sud1.plus({years: 1, months: 1, days: 5});
    assert(sud2.d.time() === sud6.d.time() && sud2.d.date() === sud6.d.date(), "Check method plus() with ymd set in another sequence");

    assert.equal(sud1.formatEn("dddd, MMMM d, yyyy"), "Thursday, November 27, 2003");
    assert.equal(sud1.formatEn("ddd, MMM. dd, \\'yy"), "Thu, Nov. 27, '03");
    assert.equal(sud1.formatEn("MM/dd/yy"), "11/27/03");
    assert.equal(sud1.formatEn("yyyyMMdd"), "20031127");
    assert.equal(sud1.formatEn("h:mmaa"), "4:37pm");
    assert.equal(sud1.formatEn("HH:mm:ss"), "16:37:33");
    assert.equal(sud1.formatEn("yyyy-MM-dd H:mm"), "2003-11-27 16:37");
    assert.equal(sud1.formatEn("dd \\de MMM"), "27 de Nov");
    assert.equal(sud1.formatEn("dd 'de' MMM"), "27 de Nov");

    sud2 = SuDate["parse"]("#20150326.122334456", "yyyyMMdd");
    assert.equal(sud2.formatEn("yyyy-MM-dd H:mm:ss"), "2015-03-26 12:23:34");
    sud2 = SuDate["parse"]("2000/3/4 8:34:56", "yyyyMMdd");
    assert.equal(sud2.formatEn("yyyy-MM-dd H:mm:ss"), "2000-03-04 8:34:56");

    sud2 = SuDate["literal"]("#19990101");
    assert.equal(sud2.toString(), "#19990101.000000000");
    sud2 = SuDate["literal"]("#19990101.010203456");
    assert.equal(sud2.toString(), "#19990101.010203456");
}

testSuDate();
dateTime.testDateTime();