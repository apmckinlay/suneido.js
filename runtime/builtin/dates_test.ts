import { SuDate } from "../sudate";
import { DATE_CLASS } from "./dates";
import * as assert from "../assert";

assert.equal(DATE_CLASS.$call('16-9-8'), SuDate.literal('20160908'));
assert.equal(DATE_CLASS.$call('16-9-8', 'ydM'), SuDate.literal('20160809'));

let d = DATE_CLASS.$call(undefined, undefined, 2000);
assert.equal(d!.Year(), 2000);
