/**
 * @file
 * Suneido globals
 */

export const suglobals: any = {};

import { SuObject } from "./suobject";
suglobals.Suneido = new SuObject();

import { su_display } from "./builtin/display";
suglobals.Display = su_display;

import { su_print } from "./builtin/print";
suglobals.Print = su_print;

import { su_type } from "./builtin/type";
suglobals.Type = su_type;

import { su_object } from "./builtin/objects";
suglobals.Object = su_object;

import { su_date, su_dateq } from "./builtin/dates";
suglobals.Date = su_date;
suglobals['Date?'] = su_dateq;
