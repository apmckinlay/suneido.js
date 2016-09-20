/**
 * @file
 * Generates the adapter functions/methods
 * for the Suneido calling convention.
 * 1) Reads a source file.
 * 2) Removes any old generated code.
 * 3) Inserts new generated code.
 * See builtins_test.ts for examples
 */

import * as fs from "fs";
import * as b from "./builtins2";

let i = 2;
let generate = true;
if (process.argv[2] === "-r" || process.argv[2] === "--remove") {
    generate = false;
    i++;
}
for (; i < process.argv.length; i++) {
    let filename = process.argv[i];
    let source: string = fs.readFileSync(filename, { encoding: 'utf8' });
    let result = b.update(source, generate);
    if (result !== source)
        fs.writeFileSync(filename, result);
}
process.exit();
