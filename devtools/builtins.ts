/**
 * @file
 * Generates the adapter functions/methods
 * for the Suneido calling convention.
 * 1) Reads a source file.
 * 2) Removes any old generated code.
 * 3) Inserts new generated code.
 * See builtins_test.ts for examples
 */

//TODO -r to just remove generated
//TODO multiple files

import * as fs from "fs";
import * as b from "./builtins2";

let filename = process.argv[2];
let source: string = fs.readFileSync(filename, { encoding: 'utf8' });
let result = b.update(source);
if (result !== source)
    fs.writeFileSync(filename, result);
process.exit();
