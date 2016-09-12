import { SuDate } from "../sudate";
import { su_date } from "./dates";
import * as assert from "../assert";

assert.equal(su_date('16-9-8'), SuDate.literal('20160908'));
assert.equal(su_date('16-9-8', 'ydM'), SuDate.literal('20160809'));

let d = su_date(undefined, undefined, 2000);
assert.equal(d!.Year(), 2000);
