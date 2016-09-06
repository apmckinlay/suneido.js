import { cmp } from "./cmp";
import { Dnum } from "./dnum";
import { SuDate } from "./sudate";
import { SuObject } from "./suobject";
import * as assert from "./assert";

let n1 = Dnum.fromNumber(-1e99);
let n2 = Dnum.parse('.5');
let n3 = Dnum.fromNumber(1e99);

let d1 = SuDate.literal('17000101');
let d2 = SuDate.literal('20160906');
let d3 = SuDate.literal('20160906.1347');
let d4 = SuDate.literal('30000101');

let o1 = new SuObject();
let o2 = new SuObject().Add(123);
let o3 = new SuObject().Add("foo");
let o4 = new SuObject().Add("foo").Add("bar");

let data = [false, true,    // boolean
    n1, -1, 0, n2, 1, n3,   // number
    "", "a", "b", "bc",     // string
    d1, d2, d3, d4,         // date
    o1, o2, o3, o4,         // object
];

for (let i = 0; i < data.length; i++) {
    // should be greater than earlier values
    for (let j = 0; j < i; j++)
        c(data[i], data[j], +1);
    // should be less than later values
    for (let j = i + 1; j < data.length; j++)
        c(data[i], data[j], -1);
}

function c(x: any, y: any, expected: number): void {
    assert.equal(cmp(x, y), expected);
}
