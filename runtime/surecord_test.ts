import { SuRecord } from "./surecord";
import { SuObject } from "./suobject";
import { type } from "./type";
import { display } from "./display";
import * as assert from "./assert";

let r = SuRecord.mkRecord(new SuObject([1, 2]));
assert.equal(type(r), "Record");
assert.equal(display(r), "[1, 2]");
assert.that(r["New?"]());


