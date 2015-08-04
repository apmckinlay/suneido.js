"use strict"

export interface DateTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
	
    valid(): boolean;
    date(): number;
    time(): number;
    day_of_week(): number;
    add_days(days: number): void;
    plus(y: number, mo: number, d: number,
         h: number, mi: number, s: number, ms: number): void;
    minus_days(dt2: DateTime): number;
    minus_milliseconds(dt2: DateTime): number;
}

var dtime = Object.create(null);

function DateTime(y: number, mo: number, d: number,
        h: number, mi: number, s: number, ms: number): void {
    this.year = y;
    this.month = mo;
    this.day = d;
    this.hour = h;
    this.minute = mi;
    this.second = s;
    this.millisecond = ms;
}

DateTime.prototype = dtime;

export var makeDateTime_full = function(y: number, mo: number, d: number,
        h: number, mi: number, s: number, ms: number): DateTime {
	return new DateTime(y, mo, d, h, mi, s, ms);
}

export var makeDateTime_int_int = function(date: number, time: number): DateTime {
	var y = date >> 9,
		mo = (date >> 5) & 0xf,
		d = date & 0x1f,
		h = time >> 22,
		mi = (time >> 16) & 0x3f,
		s = (time >> 10) & 0x3f,
		ms = time & 0x3ff;
	return new DateTime(y, mo, d, h, mi, s, ms);
}

export var makeDateTime_empty = function (): DateTime {
    var date = new Date(),
        y = date.getFullYear(),
        mo = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        mi = date.getMinutes(),
        s = date.getSeconds(),
        ms = date.getMilliseconds();
    return new DateTime(y, mo, d, h, mi, s, ms);
}

function dateCalc_leap_year(year: number): boolean {
	var yy = Math.ceil(year / 100);
	return ((year & 0x03) === 0) && (((yy * 100) !== year) || ((yy & 0x03) === 0))
}

function convert_DateTime_to_Date(dt: DateTime): Date {
    return new Date(dt.year, dt.month - 1, dt.day,
        dt.hour, dt.minute, dt.second, dt.millisecond);
}

function convert_Date_to_DateTime(date: Date): DateTime {
    var y = date.getFullYear(),
        mo = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        mi = date.getMinutes(),
        s = date.getSeconds(),
        ms = date.getMilliseconds();
    return new DateTime(y, mo, d, h, mi, s, ms);
}

var dateCalc_Days_in_Month_ = [
    [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
]

function dateCalc_check_date(year: number, month: number, day: number) {
    if ((year >= 1) && (year <= 3000) &&
        (month >= 1) && (month <= 12) &&
        (day >= 1) && (day <= dateCalc_Days_in_Month_[dateCalc_leap_year(year) ? 1 : 0][month]))
        return true;
    return false;
}

function dateCalc_check_time(hour: number, minute: number, second: number) {
    if ((hour >= 0) && (hour < 24) &&
        (minute >= 0) && (minute < 60) &&
        (second >= 0) && (second < 60))
        return true;
    return false;
}

dtime.valid = function (): boolean {
    if (this.year === 3000 && (this.month !== 1 || this.day !== 1 || this.hour !== 0 ||
        this.minute !== 0 || this.second !== 0 || this.millisecond !== 0))
        return false;
    return dateCalc_check_date(this.year, this.month, this.day) &&
        dateCalc_check_time(this.hour, this.minute, this.second) &&
        this.millisecond >= 0 && this.millisecond <= 999;
};

dtime.set = function (date: Date): void {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    this.hour = date.getHours();
    this.minute = date.getMinutes();
    this.second = date.getSeconds();
    this.millisecond = date.getMilliseconds();
};

dtime.date = function(): number {
	return (this.year << 9) | (this.month << 5) | this.day;
};

dtime.time = function(): number {
	return (this.hour << 22) | (this.minute << 16) | (this.second << 10) | this.millisecond;
};

dtime.day_of_week = function(): number {
	return convert_DateTime_to_Date(this).getDay();
};

dtime.minus_days = function (dt2: DateTime): number {
    var timeDiff =
        convert_DateTime_to_Date(this).getTime() - convert_DateTime_to_Date(dt2).getTime();
	return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

dtime.minus_milliseconds = function(dt2: DateTime): number {
    return convert_DateTime_to_Date(this).getTime() - convert_DateTime_to_Date(dt2).getTime();
};

dtime.add_days = function (days: number): void {
    var date = convert_DateTime_to_Date(this);
    date.setDate(date.getDate() + days);
    this.set(date);
};

dtime.plus = function(y: number, mo: number, d:
        number, h: number, mi: number, s: number, ms: number): void {
    var date = convert_DateTime_to_Date(this);
    date.setFullYear(date.getFullYear() + y);	
    date.setMonth(date.getMonth() + mo);
    date.setDate(date.getDate() + d);
    date.setHours(date.getHours() + h);
    date.setMinutes(date.getMinutes() + mi);
    date.setSeconds(date.getSeconds() + s);
    date.setMilliseconds(date.getMilliseconds() + ms);
    this.set(date);
};
