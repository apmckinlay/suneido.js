/**
 * Implements Suneido date/times.
 * Represents them as two integers to allow fast pack/unpack.
 * The only export is the SuDate class.
 */

import * as assert from "./assert";
import * as util from "./utility";

const month = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    "Saturday"];

export class SuDate {
    private date: number;
    private time: number;

    constructor(date: number, time: number) {
        this.date = date;
        this.time = time;
        Object.freeze(this); // SuDate is immutable
    }

    static make(year: number, month: number, day: number,
        hour: number, minute: number, second: number, millisecond: number): SuDate {
        //TODO validation
        let date = (year << 9) | (month << 5) | day,
            time = (hour << 22) | (minute << 16) | (second << 10) | millisecond;
        return new SuDate(date, time);
    }

    timePart(): number {
        return this.time;
    }

    datePart(): number {
        return this.date;
    }

    /** compare compares two sudates, returning Zero, Negative or Positive */
    static compare(sd1: SuDate, sd2: SuDate): number {
        let res = sd1.date - sd2.date;
        return res !== 0 ? res : sd1.time - sd2.time;
    }

    /** @return An SuDate for the current local date & time */
    static now() {
        return SuDate.fromDate(new Date());
    }

    static prev = SuDate.now();

    /**
     * timestamp returns a unique sudate based on current time
     * @returns {Object} a sudate
     */
    static timestamp(): SuDate {
        let ts = SuDate.now();
        if (SuDate.compare(ts, SuDate.prev) <= 0)
            ts = SuDate.prev.plus({ milliseconds: 1 });
        SuDate.prev = ts;
        return ts;
    }

    /**
     * parse constructs a sudate
     * @param {string} s string
     * @param {string} order string, order pattern helps to parse date string
     * @returns {Object} a sudate, or sufalse if not a valid date
     */
    static parse(s: string, order: string): SuDate {
        enum TokenType { YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, MILLISECOND }
        const minval = [0, 1, 1, 0, 0, 0, 0];
        const maxval = [3000, 12, 31, 23, 59, 59, 999];
        const NOTSET = 9999,
            MAXTOKENS = 20;
        let dt = {
            year: NOTSET, month: 0, day: 0,
            hour: NOTSET, minute: NOTSET, second: NOTSET, millisecond: 0
        },
            date_patterns = [
                "", // set to system default
                "md",
                "dm",
                "dmy",
                "mdy",
                "ymd"
            ],
            syspat = adjustPatterns(date_patterns, order),
            types: Array<TokenType> = [],
            tokens: Array<number> = [],
            ntokens = 0,
            got_time = false,
            prev: string = null,
            curPattern: string,
            part: TokenType;
        // types.fill(TokenType.UNK);
        let i = 0;
        while (i < s.length) {
            assert.that(ntokens < MAXTOKENS,
                "Current token number is bigger than MAXTOKENS");
            if (util.isAlpha(s[i])) {
                let word = nextWord(s, i);
                i += word.length;
                let j = month.findIndex((x) => x.startsWith(word));
                if (j) {
                    types[ntokens] = TokenType.MONTH;
                    tokens[ntokens] = j + 1;
                    ntokens++;
                } else if (word === "Am" || word === "Pm") {
                    if (word[0] === 'P') {
                        if (dt.hour < 12)
                            dt.hour += 12;
                    } else {
                        if (dt.hour === 12)
                            dt.hour = 0;
                        if (dt.hour > 12)
                            return null;
                    }
                } else {
                    // ignore days of week
                    if (!weekday.find(x => x.startsWith(word)))
                        return null;
                }
            } else if (util.isDigit(s[i])) {
                let num = nextNumber(s, i);
                let len = num.length;
                i += len;
                let n = parseInt(num);
                let digits = new Digits(num);
                if ((len === 6) || (len === 8)) {
                    if (len === 6) { // date with no separators with yy
                        tokens[ntokens++] = digits.get(2);
                        tokens[ntokens++] = digits.get(2);
                        tokens[ntokens++] = digits.get(2);
                    } else if (len === 8) { // date with no separators with yyyy
                        for (let k = 0; k < 3; k++)
                            tokens[ntokens++] =
                                digits.get(syspat[k] === 'y' ? 4 : 2);
                    }
                    if (s[i] === '.') {
                        i++;
                        let num = nextNumber(s, i);
                        let len = num.length;
                        i += len;
                        if ((len === 4) || (len === 6) || (len === 9)) {
                            let digits = new Digits(num);
                            dt.hour = digits.get(2);
                            dt.minute = digits.get(2);
                            if (len >= 6) {
                                dt.second = digits.get(2);
                                if (len === 9)
                                    dt.millisecond = digits.get(3);
                            }
                        }
                    }
                } else if (prev === ':' || s[i] === ':' || ampmAhead(s, i)) { //time
                    got_time = true;
                    if (dt.hour === NOTSET)
                        dt.hour = n;
                    else if (dt.minute === NOTSET)
                        dt.minute = n;
                    else if (dt.second === NOTSET)
                        dt.second = n;
                    else
                        return null;
                } else { //date
                    tokens[ntokens] = n;
                    if (prev === '\'')
                        types[ntokens] = TokenType.YEAR;
                    ntokens++;
                }
            } else
                prev = s[i++]; //ignore
        }
        if (dt.hour === NOTSET)
            dt.hour = 0;
        if (dt.minute === NOTSET)
            dt.minute = 0;
        if (dt.second === NOTSET)
            dt.second = 0;

        //search for data match
        for (i = 0; i < date_patterns.length; i++) {
            //try one pattern
            curPattern = date_patterns[i];
            let j = 0;
            for (; curPattern[j] && j < ntokens; j++) {
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
                if ((types[j] !== undefined && types[j] !== part) ||
                    tokens[j] < minval[part] || tokens[j] > maxval[part])
                    break;
            }
            // stop at first match
            if (!curPattern[j] && j === ntokens)
                break;
        }

        let current = SuDate.now();
        let thisyr = current.year();
        let thismo = current.month();
        let thisd = current.day();

        if (i < date_patterns.length) {
            // use match
            curPattern = date_patterns[i];
            for (let j = 0; curPattern[j]; j++) {
                switch (curPattern[j]) {
                    case 'y':
                        dt.year = tokens[j];
                        break;
                    case 'm':
                        dt.month = tokens[j];
                        break;
                    case 'd':
                        dt.day = tokens[j];
                        break;
                    default:
                        throw new Error("unreachable");
                }
            }
        } else if (got_time && ntokens === 0) {
            dt.year = thisyr;
            dt.month = thismo;
            dt.day = thisd;
        } else // no match
            return null;

        if (dt.year === NOTSET) {
            if (dt.month >= Math.max(thismo - 5, 1) &&
                dt.month <= Math.min(thismo + 6, 12))
                dt.year = thisyr;
            else if (thismo < 6)
                dt.year = thisyr - 1;
            else
                dt.year = thisyr + 1;
        } else if (dt.year < 100) {
            dt.year += thisyr - thisyr % 100;
            if (dt.year - thisyr > 20)
                dt.year -= 100;
        }
        if (!valid(dt.year, dt.month, dt.day,
            dt.hour, dt.minute, dt.second, dt.millisecond))
            return null;
        return SuDate.make(dt.year, dt.month, dt.day,
            dt.hour, dt.minute, dt.second, dt.millisecond);
    }

    /**
     * literal constructs a sudate
     * @param {string} s string
     * @returns {Object} a sudate, or sufalse if not a valid date
     */
    static literal(s: string): SuDate {
        if (s.startsWith('#'))
            s = s.substr(1);
        let sn = s.indexOf('.');
        let tn = 0;
        if (sn !== -1)
            tn = s.length - sn - 1;
        else
            sn = s.length;
        if (sn !== 8 || (tn !== 0 && tn !== 4 && tn !== 6 && tn !== 9))
            return null;

        let year = nsub(s, 0, 4);
        let month = nsub(s, 4, 2);
        let day = nsub(s, 6, 2);

        let hour = nsub(s, 9, 2);
        let minute = nsub(s, 11, 2);
        let second = nsub(s, 13, 2);
        let millisecond = nsub(s, 15, 3);
        if (!valid(year, month, day, hour, minute, second, millisecond))
            return null;
        return SuDate.make(year, month, day, hour, minute, second, millisecond);
    }

    /**
     * formatEn converts sudate into string based on given format
     * @param {string} fmt
     * @returns {string} a date and time string in given format
     */
    formatEn(fmt: string): string {
        assert.that(arguments.length === 1, "usage: date.Format(format)");
        return format(this, fmt);
    }

    /**
     * plus creates a copy of the sudate with the specified units added.
     * @param args {Object} a group of unit and offset pairs
     * @returns {object} a copy of sudate
     */
    plus({ years = 0, months = 0, days = 0,
        hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }): SuDate {
        years += this.year();
        months += this.month();
        days += this.day();
        hours += this.hour();
        minutes += this.minute();
        seconds += this.second();
        milliseconds += this.millisecond();
        return normalize(years, months, days, hours, minutes, seconds, milliseconds);
    }

    private timeAsMs(): number {
        return this.millisecond() +
            1000 * (this.second() +
                60 * (this.minute() +
                    60 * this.hour()));
    }

    // WARNING: doing this around daylight savings changes may be problematic
    minusMilliseconds(sud2: SuDate): number {
        if (this.date === sud2.date)
            return this.timeAsMs() - sud2.timeAsMs();
        else
            return this.toDate().getTime() - sud2.toDate().getTime();
    }

    /**
     * minusDays returns the number of days between two dates
     * @param sud2 {Object}  another sudate
     * @returns {number}
     */
    minusDays(sud2: SuDate): number {
        assert.that(arguments.length === 1, "usage: date.Minus(date)");
        let timeDiff = this.toDate().getTime() - sud2.toDate().getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    /**
     * minusSeconds returns the number of seconds between two dates
     * @param sud2 {Object}  another sudate
     * @returns {number}
     */
    minusSeconds(sud2: SuDate): number {
        assert.that(arguments.length === 1, "usage: date.MinusSeconds(date)");
        let timeDiff = this.toDate().getTime() - sud2.toDate().getTime();
        return timeDiff / 1000;
    }

    /**
     * @returns {number} year portion of the date
     */
    year(): number {
        assert.that(arguments.length === 0, "usage: date.Year()");
        return this.date >> 9;
    }

    /**
     * @returns {number} month portion of the date
     */
    month(): number {
        assert.that(arguments.length === 0, "usage: date.Month()");
        return (this.date >> 5) & 0xf;
    }

    /**
     * @returns {number} day portion of the date
     */
    day(): number {
        assert.that(arguments.length === 0, "usage: date.Day()");
        return this.date & 0x1f;
    }

    /**
     * @returns {number} hour portion of the date
     */
    hour(): number {
        assert.that(arguments.length === 0, "usage: date.Hour()");
        return this.time >> 22;
    }

    /**
     * @returns {number} minute portion of the date
     */
    minute(): number {
        assert.that(arguments.length === 0, "usage: date.Minute()");
        return (this.time >> 16) & 0x3f;
    }

    /**
     * @returns {number} second portion of the date
     */
    second(): number {
        assert.that(arguments.length === 0, "usage: date.Second()");
        return (this.time >> 10) & 0x3f;
    }

    /**
     * @returns {number} millisecond portion of the date
     */
    millisecond(): number {
        assert.that(arguments.length === 0, "usage: date.Millisecond()");
        return this.time & 0x3ff;
    }

    /**
     * weekday returns the day of the week in the range 0 to 6
     * @param {string|number}  firstDay to start count
     * @returns {number}
     */
    weekday(firstDay?: string | number): number {
        assert.that(arguments.length === 0 || arguments.length === 1,
            "usage: date.WeekDay(firstDay = 'Sun')");
        let i = 0;
        if (arguments.length === 1) {
            if (typeof firstDay === "string") {
                let s = util.capitalizeFirstLetter(firstDay.toLowerCase());
                i = weekday.findIndex(x => x.startsWith(s));
                assert.that(i !== undefined, "usage: date.WeekDay( <day of week> )");
            } else if (!isNaN(firstDay)) {
                i = firstDay;
            } else {
                assert.that(false, "usage: date.WeekDay( <day of week> )");
            }
        }
        return (this.toDate().getDay() - i + 7) % 7;
    }

    // methods for type conversion

    toString(): string {
        return "#" +
            ("0000" + this.year()).slice(-4) +
            ("0" + this.month()).slice(-2) +
            ("0" + this.day()).slice(-2) +
            '.' +
            ("0" + this.hour()).slice(-2) +
            ("0" + this.minute()).slice(-2) +
            ("0" + this.second()).slice(-2) +
            ("000" + this.millisecond()).slice(-3);
    }

    /** Convert to a JavaScript Date */
    toDate(): Date {
        return new Date(this.year(), this.month() - 1, this.day(),
            this.hour(), this.minute(), this.second(), this.millisecond());
    }

    static fromDate(d: Date): SuDate {
        return SuDate.make(d.getFullYear(), d.getMonth(), d.getDate(),
            d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }

} // end of class --------------------------------------------------------------

/** validation */
function valid(year: number, month: number, day: number,
    hour: number, minute: number, second: number, millisecond: number): boolean {
    if (year === 3000 && (month !== 1 || day !== 1 || hour !== 0 ||
        minute !== 0 || second !== 0 || millisecond !== 0))
        return false;
    return check_date(year, month, day) &&
        check_time(hour, minute, second) &&
        0 <= millisecond && millisecond <= 999;
}

function check_time(hour: number, minute: number, second: number): boolean {
    return 0 <= hour && hour < 24 &&
        0 <= minute && minute < 60 &&
        0 <= second && second < 60;
}

function check_date(year: number, month: number, day: number): boolean {
    return 1 <= year && year <= 3000 &&
        1 <= month && month <= 12 &&
        1 <= day && day <= days_in_month(year, month);
}

function days_in_month(year: number, month: number): number {
    function leap_year(year: number): boolean {
        if ((year % 4) !== 0)
            return false;
        else if ((year % 100) !== 0)
            return true;
        else if ((year % 400) !== 0)
            return false;
        else
            return true;
    }
    const days_in_month = [
        [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    ];
    return days_in_month[leap_year(year) ? 1 : 0][month];
}

function normalize(year: number, month: number, day: number,
    hour: number, minute: number, second: number, millisecond: number): SuDate {
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
        let d = new Date(year, month - 1, day);
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

    return SuDate.make(year, month, day, hour, minute, second, millisecond);
}

/** extract n chars from the position start of string s and translate into integer */
function getNumber(s: string, start: number, n: number): number {
    return parseInt(s.slice(start, start + n));
}

function ampmAhead(s: string, i: number): boolean {
    if (s[i] === ' ')
        i++;
    let str = s.slice(i, i + 2).toLowerCase();
    return str === 'am' || str === 'pm';
}

function format(dt: SuDate, fmt: string): string {
    let dst = '';
    for (let i = 0; i < fmt.length; i++) {
        let n = 1;
        if (util.isAlpha(fmt[i])) {
            for (let c = fmt[i]; c === fmt[i + 1]; i++)
                n++;
        }
        switch (fmt[i]) {
            case 'y':
                let yr = dt.year();
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
                let mo = dt.month() - 1;
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
                let wd = dt.weekday();
                let d = dt.day();
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
                let hr = dt.hour() % 12;
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
                let h = dt.hour();
                if (n >= 2) {
                    dst += ('0' + h.toString()).slice(-2);
                } else {
                    dst += h.toString();
                }
                break;
            case 'm':
                let mi = dt.minute();
                if (n >= 2) {
                    dst += ('0' + mi.toString()).slice(-2);
                } else {
                    dst += mi.toString();
                }
                break;
            case 's':
                let s = dt.second();
                if (n >= 2) {
                    dst += ('0' + s.toString()).slice(-2);
                } else {
                    dst += s.toString();
                }
                break;
            case 'a':
                dst += dt.hour() < 12 ? 'a' : 'p';
                if (n > 1) {
                    dst += 'm';
                }
                break;
            case 'A':
            case 't':
                dst += dt.hour() < 12 ? 'A' : 'P';
                if (n > 1) {
                    dst += 'M';
                }
                break;
            case '\'':
                i++;
                while (fmt[i] && fmt[i] !== '\'') {
                    dst += fmt[i];
                    i++;
                }
                break;
            case '\\':
                i++;
                dst += fmt[i];
                break;
            default:
                n--;
                while (n >= 0) {
                    dst += fmt[i];
                    n--;
                }
        }
    }
    return dst;
}

function adjustPatterns(date_patterns: Array<string>, order: string): string {
    let i: number = 0,
        prev: string = null,
        syspatArray: Array<string> = [];
    for (let j = 0; order[j] && i < 3; prev = order[j], j++) {
        if (order[j] !== prev &&
            ((order[j] === 'y') || (order[j] === 'M') || (order[j] === 'd'))) {
            syspatArray[i] = order[j].toLowerCase();
            i++;
        }
    }
    assert.that(i === 3, "invalid date format: '" + order + "'");
    date_patterns[0] = syspatArray.join('');

    // swap month-day patterns if system setting is day first
    for (let i = 0; i < 3; i++) {
        if (syspatArray[i] === 'm')
            break;
        else if (syspatArray[i] === 'd') {
            let tmp = date_patterns[1];
            date_patterns[1] = date_patterns[2];
            date_patterns[2] = tmp;
        }
    }
    return date_patterns[0];
}

function nextWord(s: string, i: number): string {
    let j = i;
    for (; util.isAlpha(s[i]); i++) {
    }
    return util.capitalizeFirstLetter(s.slice(j, i).toLowerCase());
}

function nextNumber(s: string, i: number): string {
    let j = i;
    while (util.isDigit(s[i]))
        i++;
    return s.slice(j, i);
}

class Digits {
    constructor(private s: string, private i = 0) {
    }
    get(n: number): number {
        this.i += n;
        return Number.parseInt(this.s.substr(this.i - n, n));
    }
}

function nsub(s: string, i: number, n: number): number {
    if (i + n > s.length)
        return 0;
    return Number.parseInt(s.substr(i, n));
}
