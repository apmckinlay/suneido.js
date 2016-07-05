import assert = require("assert")
import * as util from "./utility"

export interface SuDate {
    date: number;
    time: number;

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

    toDate(): Date;
    toString(): string;
    increment(): SuDate;
}

var sudate = Object.create(null);

function SuDate(date: number, time: number): void {
    this.date = date;
    this.time = time;
}

SuDate.prototype = sudate;

//constructors ------------------------------------------------------------

/**
 * makeSuDate_int_int constructs a sudate with specified date and time
 * @param {number} d integer, year = d[..9], month = d[8..5], date = d[4..0]
 * @param {number} t integer, hour = t[..22], minute = t[21..16], second = t[15, 10], millisecond = [9..0]
 * @returns {Object} a sudate
 */
export function makeSuDate_int_int(d: number, t: number): SuDate {
    return new SuDate(d, t);
}

/**
 * makeSuDate_full constructs a sudate with specified year, month, etc
 * @param {number} year integer
 * @param {number} month integer
 * @param {number} day integer
 * @param {number} hour integer
 * @param {number} minute integer
 * @param {number} second integer
 * @param {number} millisecond integer
 * @returns {Object} a sudate
 */
export function makeSuDate_full(year: number, month: number, day: number,
    hour: number, minute: number, second: number, millisecond: number): SuDate {
    //TODO validation
    var date = (year << 9) | (month << 5) | day,
        time = (hour << 22) | (minute << 16) | (second << 10) | millisecond;
    return new SuDate(date, time);
}

// local utility functions ------------------------------------------------------------

/** extract n chars from the position start of string s and translate into integer */
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

/** compare compares two sudates, returning Zero, Negative or Positive */
function compare(sd1: SuDate, sd2: SuDate): number {
    var res: number;
    if ((res = sd1.date - sd2.date) !== 0)
        return res;
    else
        return sd1.time - sd2.time;
}

var dateCalc_Days_in_Month_ = [
    [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

function dateCalc_leap_year(year: number): boolean {
    var yy = Math.ceil(year / 100);
    return ((year & 0x03) === 0) && (((yy * 100) !== year) || ((yy & 0x03) === 0))
}

function dateCalc_check_date(year: number, month: number, day: number) {
    return (year >= 1) && (year <= 3000) &&
        (month >= 1) && (month <= 12) &&
        (day >= 1) &&
        (day <= dateCalc_Days_in_Month_[dateCalc_leap_year(year) ? 1 : 0][month]);
}

function dateCalc_check_time(hour: number, minute: number, second: number) {
    return (hour >= 0) && (hour < 24) &&
        (minute >= 0) && (minute < 60) &&
        (second >= 0) && (second < 60);
}

function format(dt: SuDate, fmt: string): string {
    var dst: string = '',
        i: number,
        n: number,
        c: string,
        yr: number,
        mo: number,
        wd: number,
        d: number,
        hr: number,
        mi: number,
        s: number;
    for (i = 0; i < fmt.length; i += 1) {
        n = 1;
        if (util.isAlpha(fmt[i])) {
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

// static functions ------------------------------------------------------------

/** @return An SuDate for the current local date & time */
export function now() {
    var date = new Date();
    return fromDate(date);
}

/** validation */
export function valid(year: number, month: number, day: number,
    hour: number, minute: number, second: number, millisecond: number) {
    if (year === 3000 && (month !== 1 || day !== 1 || hour !== 0 ||
        minute !== 0 || second !== 0 || millisecond !== 0))
        return false;
    return dateCalc_check_date(year, month, day) &&
        dateCalc_check_time(hour, minute, second) &&
        millisecond >= 0 && millisecond <= 999;
}

export function normalize(year: number, month: number, day: number,
    hour: number, minute: number, second: number, millisecond: number) {
    // adjust to bring back into range
    while (millisecond < 0) {
        --second;
        millisecond += 1000;
    }
    while (millisecond >= 1000) {
        ++second;
        millisecond -= 1000;
    }

    while (second < 0) {
        --minute;
        second += 60;
    }
    while (second >= 60) {
        ++minute;
        second -= 60;
    }

    while (minute < 0) {
        --hour;
        minute += 60;
    }
    while (minute >= 60) {
        ++hour;
        minute -= 60;
    }

    while (hour < 0) {
        --day;
        hour += 24;
    }
    while (hour >= 24) {
        ++day;
        hour -= 24;
    }

    //use Date for days to handle leap years etc.
    if (day < 1 || day > 28) {
        var d = new Date(year, month - 1, day);
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
    }

    while (month < 1) {
        --year;
        month += 12;
    }
    while (month > 12) {
        ++year;
        month -= 12;
    }

    return makeSuDate_full(year, month, day, hour, minute, second, millisecond);
};

/**
 * timestamp returns a unique sudate based on current time
 * @returns {Object} a sudate
 */
SuDate["prev"] = now();
export function timestamp(): SuDate {
    var ts: SuDate = now();
    if (compare(ts, SuDate["prev"]) <= 0) {
        SuDate["prev"].increment();
        ts = new SuDate(SuDate["prev"].date, SuDate["prev"].time);
    } else
        SuDate["prev"] = new SuDate(ts.date, ts.time);
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
export function parse(s: string, order: string): SuDate {
    var NOTSET = 9999,
        MAXTOKENS = 20;
    var dt: Object = {
        year: NOTSET, month: 0, day: 0,
        hour: NOTSET, minute: NOTSET, second: NOTSET, millisecond: 0
    },
        date_patterns: Array<string> = [
            "", // set to system default
            "md",
            "dm",
            "dmy",
            "mdy",
            "ymd"
        ],
        getSyspat = function(): string {
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
            assert(i === 3, "invalid date format: '" + order + "'")
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
        current: SuDate,
        thisyr: number,
        thismo: number,
        thisd: number;
    arrayFill(types, 0, MAXTOKENS, TokenType.UUK);
    i = 0;
    while (i < s.length) {
        assert(ntokens < MAXTOKENS, "Current token number is bigger than MAXTOKENS");
        if (util.isAlpha(s[i])) {
            j = i;
            while (util.isAlpha(s[++i])) {
            }
            buf = util.capitalizeFirstLetter(s.slice(j, i).toLowerCase());
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
                        return null;
                }
            } else {
                // ignore days of week
                for (j = 0; j < weekday.length; j += 1) {
                    if (weekday[j].indexOf(buf) !== -1)
                        break;
                }
                if (j >= weekday.length)
                    return null;
            }
        } else if (util.isDigit(s[i])) {
            j = i;
            while (util.isDigit(s[++i])) {
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
                    while (util.isDigit(s[++i])) {
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
                    return null;
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

    current = now();
    thisyr = current.year();
    thismo = current.month();
    thisd = current.day();

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
        return null;

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
    if (!valid(dt["year"], dt["month"], dt["day"],
        dt["hour"], dt["minute"], dt["second"], dt["millisecond"]))
        return null;
    return makeSuDate_full(dt["year"], dt["month"], dt["day"],
        dt["hour"], dt["minute"], dt["second"], dt["millisecond"]);
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
        dt: SuDate;
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
    if (!valid(year, month, day, hour, minute, second, millisecond))
        return null;
    return makeSuDate_full(year, month, day, hour, minute, second, millisecond);
}

// methods ---------------------------------------------------------------------

/**
 * formatEn converts sudate into string based on given format
 * @param {string} fmt
 * @returns {string} a date and time string in given format
 */
sudate.formatEn = function(fmt: string): string {
    assert(arguments.length === 1, "usage: date.Format(format)");
    return format(this, fmt);
};

/**
 * increment increments self by one millisecond
 * @returns {object} self sudate
 */
sudate.increment = function(): SuDate {
    var d = this.plus({ milliseconds: 1 });
    this.date = d.date;
    this.time = d.time;
    return this;
};

/**
 * plus creates a copy of the sudate with the specified units added.
 * @param args {Object} a group of unit and offset pairs
 * @returns {object} a copy of sudate
 */
sudate.plus = function(args: Object): SuDate {
    var usage = "usage: Plus(years:, months:, days:, " +
        "hours:, minutes:, seconds:, milliseconds:)";
    var years = (args["years"] | 0) + this.year(),
        months = (args["months"] | 0) + this.month(),
        days = (args["days"] | 0) + this.day(),
        hours = (args["hours"] | 0) + this.hour(),
        minutes = (args["minutes"] | 0) + this.minute(),
        seconds = (args["seconds"] | 0) + this.second(),
        milliseconds = (args["milliseconds"] | 0) + this.millisecond();
    assert(!(isNaN(args["years"]) && isNaN(args["months"]) && isNaN(args["days"]) &&
        isNaN(args["hours"]) && isNaN(args["minutes"]) && isNaN(args["seconds"]) &&
        isNaN(args["milliseconds"])), usage);
    return normalize(years, months, days, hours, minutes, seconds, milliseconds);
};

function timeAsMs(sud: SuDate): number {
    return sud.millisecond() + 1000 * (sud.second() + 60 * (sud.minute() + 60 * sud.hour()));
};

// WARNING: doing this around daylight savings changes may be problematic
sudate.minusMilliseconds = function(sud2: SuDate): number {
    if (this.date == sud2.date)
        return timeAsMs(this) - timeAsMs(sud2);
    else
        return this.toDate().getTime() - sud2.toDate().getTime();
};

/**
 * minusDays returns the number of days between two dates
 * @param sud2 {Object}  another sudate
 * @returns {number}
 */
sudate.minusDays = function(sud2: SuDate): number {
    var timeDiff = this.toDate().getTime() - sud2.toDate().getTime();
    assert(arguments.length === 1, "usage: date.Minus(date)");
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * minusSeconds returns the number of seconds between two dates
 * @param sud2 {Object}  another sudate
 * @returns {number}
 */
sudate.minusSeconds = function(sud2: SuDate): number {
    var timeDiff = this.toDate().getTime() - sud2.toDate().getTime();
    assert(arguments.length === 1, "usage: date.MinusSeconds(date)");
    return timeDiff / 1000;
};

/**
 * @returns {number} year portion of the date
 */
sudate.year = function(): number {
    assert(arguments.length === 0, "usage: date.Year()");
    return this.date >> 9;
};

/**
 * @returns {number} month portion of the date
 */
sudate.month = function(): number {
    assert(arguments.length === 0, "usage: date.Month()");
    return (this.date >> 5) & 0xf;
};

/**
 * @returns {number} day portion of the date
 */
sudate.day = function(): number {
    assert(arguments.length === 0, "usage: date.Day()");
    return this.date & 0x1f;
};

/**
 * @returns {number} hour portion of the date
 */
sudate.hour = function(): number {
    assert(arguments.length === 0, "usage: date.Hour()");
    return this.time >> 22;
};

/**
 * @returns {number} minute portion of the date
 */
sudate.minute = function(): number {
    assert(arguments.length === 0, "usage: date.Minute()");
    return (this.time >> 16) & 0x3f;
};

/**
 * @returns {number} second portion of the date
 */
sudate.second = function(): number {
    assert(arguments.length === 0, "usage: date.Second()");
    return (this.time >> 10) & 0x3f;
};

/**
 * @returns {number} millisecond portion of the date
 */
sudate.millisecond = function(): number {
    assert(arguments.length === 0, "usage: date.Millisecond()");
    return this.time & 0x3ff;
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
sudate.weekday = function(firstDay?: string | number): number {
    assert(arguments.length === 0 || arguments.length === 1,
        "usage: date.WeekDay(firstDay = 'Sun')");
    var i: number = 0,
        s;
    if (arguments.length === 1) {
        if (typeof firstDay === "string") {
            s = firstDay.toLowerCase();
            for (i = 0; i < 7; i += 1) {
                if (weekday[i].toLowerCase().indexOf(s) === 0)
                    break;
            }
            assert(i < 7, "usage: date.WeekDay( <day of week> )");
        } else if (!isNaN(firstDay)) {
            i = firstDay;
        } else {
            assert(false, "usage: date.WeekDay( <day of week> )");
        }
    }
    return (this.toDate().getDay() - i + 7) % 7;
};

// methods for type conversion

sudate.toString = function(): string {
    var s: string = "#";
    s += ("0000" + this.year()).slice(-4);
    s += ("0" + this.month()).slice(-2);
    s += ("0" + this.day()).slice(-2);
    s += '.';
    s += ("0" + this.hour()).slice(-2);
    s += ("0" + this.minute()).slice(-2);
    s += ("0" + this.second()).slice(-2);
    s += ("000" + this.millisecond()).slice(-3);
    return s;
};

sudate.toDate = function(): Date {
    return new Date(this.year(), this.month() - 1, this.day(),
        this.hour(), this.minute(), this.second(), this.millisecond());
}

function fromDate(d: Date): SuDate {
    return new SuDate(toDateValue(d), toTimeValue(d));
}

function toDateValue(d: Date): number {
    return (d.getFullYear() << 9) | (d.getMonth() << 5) | d.getDate();
}

function toTimeValue(d: Date): number {
    return (d.getHours() << 22) | (d.getMinutes() << 16) | (d.getSeconds() << 10) |
        d.getMilliseconds();
}
