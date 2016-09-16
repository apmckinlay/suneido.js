/**
 * @file
 * Suneido globals
 */

export const suglobals: any = {};

import { SuObject } from "./suobject";
suglobals.Suneido = new SuObject();

// temp so BuiltDate works
import { SuDate } from "./sudate";
suglobals.Suneido.put('BuiltDate', SuDate.literal('20160913'));

import { su_display } from "./builtin/display";
suglobals.Display = su_display;

import { su_print } from "./builtin/print";
suglobals.Print = su_print;

import { su_type } from "./builtin/type";
suglobals.Type = su_type;

import { su_object, su_objectq } from "./builtin/objects";
suglobals.Object = su_object;
suglobals['Object?'] = su_objectq;

import { su_date, su_dateq } from "./builtin/dates";
suglobals.Date = su_date;
suglobals['Date?'] = su_dateq;

import { su_built } from "./builtin/built";
suglobals.Built = su_built;

import { su_stringq } from "./builtin/strings";
suglobals['String?'] = su_stringq;

import { su_numberq } from "./builtin/numbers";
suglobals['Number?'] = su_numberq;

/** FOR TESTING PURPOSES ONLY! */
suglobals.Def = su_def;
function su_def(global: string, value: any): any {
    Object.freeze(value);
    suglobals[global] = value;
    return value;
}
import * as util from "./utility";
//BUILTIN Def(name, value)
//GENERATED start
(su_def as any).$call = su_def;
(su_def as any).$callNamed = function ($named: any, name: any, value: any) {
    ({ name = name, value = value } = $named);
    return su_def(name, value);
};
(su_def as any).$callAt = function (args: SuObject) {
    return (su_def as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_def as any).$params = 'name, value';
//GENERATED end
