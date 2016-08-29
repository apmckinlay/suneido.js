/**
 * @file
 * Suneido globals
 */

export const suglobals: any = {};

import { SuObject } from './suobject';
suglobals.Suneido = new SuObject();

import { su_print } from "./builtin/print";
suglobals.Print = su_print;

import { su_object } from "./builtin/object";
suglobals.Object = su_object;
