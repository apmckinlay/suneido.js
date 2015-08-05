"use strict";

import assert = require("assert")
import dateTime = require("./date")

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
    toString(): string;
}

var sudate = Object.create(null);

function SuDate(date: number, time: number): void {
    this.d = dateTime.makeDateTime_int_int(date, time);
}

SuDate.prototype = sudate;

/**
 * makeSuDate_empty constructs a sudate
 * @returns {Object} a sudate
 */
export function makeSuDate_empty(): SuDate {
    var dt = dateTime.makeDateTime_empty();
    return new SuDate(dt.date(), dt.time());
}

/**
 * makeSuDate_int_int constructs a sudate
 * @param {number} d integer, year = d[..9], month = d[8..5], date = d[4..0]
 * @param {number} t integer, hour = t[..22], minute = t[21..16], second = t[15, 10], millisecond = [9..0]
 * @returns {Object} a sudate
 */
export function makeSuDate_int_int(d: number, t: number): SuDate {
    return new SuDate(d, t);
}

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// extract n chars from the position start of string s and translate into integer 
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

// compare compares two sudates, returning 0, -1, or +1
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

// static functions ------------------------------------------------------------

/**
 * timestamp returns a unique sudate based on current time
 * @returns {Object} a sudate
 */
SuDate["prev"] = makeSuDate_empty();
export function timestamp(): SuDate {
    var ts: SuDate = makeSuDate_empty();
    if (compare(ts, SuDate["prev"]) <= 0)
        ts = SuDate["prev"].increment();
    else
        SuDate["prev"] = ts;
    return ts;
}

enum TokenType { YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, MILLISECOND, UUK }
var minval: Array<number> = [0, 1, 1, 0, 0, 0, 0];
var maxval: Array<number> = [3000, 12, 31, 23, 59, 59, 999];

/**
 * parse constructs a sudate
 * @param {string} s string 
 * @param {string} order string, order pattern helps to parse date string
 * @returns {Object} a sudate, or sufalse if not a valid date
 */
export function parse(s: string, order: string): SuDate|boolean {
    var NOTSET = 9999,
        MAXTOKENS = 20;
    var dt: Object = { year: NOTSET, month: 0, day: 0,
            hour: NOTSET, minute: NOTSET, second: NOTSET, millisecond: 0 },
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
                if (order[j] !== prev &&
                    ((order[j] === 'y') || (order[j] === 'M') || (order[j] === 'd'))) {
                    syspatArray[i] = order[j].toLowerCase();
                    i += 1;
                }
            }
            if (i !== 3) {
                throw new Error("invalid date format: '" + order + "'");
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
        assert(ntokens < MAXTOKENS, "Current token number is bigger than MAXTOKENS");
        if (isLetter(s[i])) {
            j = i;
            while (isLetter(s[++i])) {
            }
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
                        return false;
                }
            } else {
                // ignore days of week
                for (j = 0; j < weekday.length; j += 1) {
                    if (weekday[j].indexOf(buf) !== -1)
                        break;
                }
                if (j >= weekday.length)
                    return false;
            }
        } else if (isDigit(s[i])) {
            j = i;
            while (isDigit(s[++i])) {
            }
            n = getNdigit(s, j, i - j);
            assert(i > j, "SuDate.parse: char index not increased after searching digits.");
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
                    while (isDigit(s[++i])) {
                    }
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
                    return false;
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
                    throw new Error("unreachable");
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
                    throw new Error("unreachable");
            }
        }
    } else if (got_time && ntokens === 0) {
        dt["year"] = thisyr;
        dt["month"] = thismo;
        dt["day"] = thisd;
    } else // no match
        return false;

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
    var newDT = dateTime.makeDateTime_full(dt["year"], dt["month"], dt["day"],
        dt["hour"], dt["minute"], dt["second"], dt["millisecond"]);
    if (!newDT.valid())
        return false;
    return makeSuDate_int_int(newDT.date(), newDT.time());
}

/**
 * literal constructs a sudate
 * @param {string} s string
 * @returns {Object} a sudate, or sufalse if not a valid date
 */
export function literal(s: string): SuDate {
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
        return null;

    year = getNdigit(s, i, 4);
    month = getNdigit(s, i + 4, 2);
    day = getNdigit(s, i + 6, 2);

    hour = tn >= 2 ? getNdigit(s, t + 1, 2) : 0;
    minute = tn >= 4 ? getNdigit(s, t + 3, 2) : 0;
    second = tn >= 6 ? getNdigit(s, t + 5, 2) : 0;
    millisecond = tn >= 9 ? getNdigit(s, t + 7, 3) : 0;

    dt = dateTime.makeDateTime_full(year, month, day, hour, minute, second, millisecond);
    if (!dt.valid())
        return null;
    return makeSuDate_int_int(dt.date(), dt.time());
}

// methods ---------------------------------------------------------------------

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

/**
 * formatEn converts sudate into string based on given format
 * @param {string} fmt
 * @returns {string} a date and time string in given format
 */
sudate.formatEn = function (fmt: string): string {
    if (arguments.length !== 1) {
        throw new Error("usage: date.Format(format)");
    }
    return format(this, fmt);
};

/**
 * increment increments self by one millisecond
 * @returns {object} self sudate
 */
sudate.increment = function (): SuDate {
    this.d.plus(0, 0, 0, 0, 0, 0, 1);
    return this;
};

/**
 * plus creates a copy of the sudate with the specified units added.
 * @param args {Object} a group of unit and offset pairs
 * @returns {object} a copy of sudate
 */
sudate.plus = function (args: Object): SuDate {
    var usage = "usage: Plus(years:, months:, days:, " +
        "hours:, minutes:, seconds:, milliseconds:)";
    var years = args["years"],
        months = args["months"],
        days = args["days"],
        hours = args["hours"],
        minutes = args["minutes"],
        seconds = args["seconds"],
        milliseconds = args["milliseconds"];
    if (! (years || months || days || hours || minutes || seconds || milliseconds)) {
         throw new Error(usage);
    }
    var dt = dateTime.makeDateTime_int_int(this.d.date(), this.d.time());
    dt.plus(years || 0, months || 0, days || 0,
        hours || 0, minutes || 0, seconds || 0, milliseconds || 0);
    //TODO validation
    return makeSuDate_int_int(dt.date(), dt.time());
};

/**
 * minusDays returns the number of days between two dates
 * @param sud2 {Object}  another sudate
 * @returns {number}
 */
sudate.minusDays = function (sud2: SuDate): number {
    if (arguments.length !== 1) {
        throw new Error("usage: date.Minus(date)");
    }
    return this.d.minus_days(sud2.d);
};

/**
 * minusSeconds returns the number of seconds between two dates
 * @param sud2 {Object}  another sudate
 * @returns {number}
 */
sudate.minusSeconds = function (sud2: SuDate): number {
    if (arguments.length !== 1) {
        throw new Error("usage: date.MinusSeconds(date)");
    }
    return this.d.minus_milliseconds(sud2.d) / 1000;
};

/**
 * @returns {number} year portion of the date
 */
sudate.year = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Year()");
    }
    return this.d.year;
};

/**
 * @returns {number} month portion of the date
 */
sudate.month = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Month()");
    }
    return this.d.month;
};

/**
 * @returns {number} day portion of the date
 */
sudate.day = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Day()");
    }
    return this.d.day;
};

/**
 * @returns {number} hour portion of the date
 */
sudate.hour = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Hour()");
    }
    return this.d.hour;
};

/**
 * @returns {number} minute portion of the date
 */
sudate.minute = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Minute()");
    }
    return this.d.minute;
};

/**
 * @returns {number} second portion of the date
 */
sudate.second = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Second()");
    }
    return this.d.second;
};

/**
 * @returns {number} millisecond portion of the date
 */
sudate.millisecond = function (): number {
    if (arguments.length !== 0) {
        throw new Error("usage: date.Millisecond()");
    }
    return this.d.millisecond;
};

var month: Array<string> = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
var weekday: Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];

/**
 * weekday returns the day of the week in the range 0 to 6
 * @param {string|number}  firstDay to start count
 * @returns {number}
 */
sudate.weekday = function (firstDay?: string|number): number {
    if (arguments.length !== 0 && arguments.length !== 1) {
        throw new Error("usage: date.WeekDay(firstDay = 'Sun')");
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
                throw new Error("usage: date.WeekDay( <day of week> )");
        } else if (!isNaN(firstDay)) {
            i = firstDay;
        } else {
            throw new Error("usage: date.WeekDay( <day of week> )");
        }
    }
    return (this.d.day_of_week() - i + 7) % 7;
};

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
};
