import * as fs from "fs";

let filename = process.argv[2];
let source: string = fs.readFileSync(filename, { encoding: 'utf8' });
let d = new Date();
let now = d.toDateString() + " " + d.toTimeString();
now = now.replace(/ GMT.*/, "");
let result = source.replace(/    return '.*/, "    return '" + now + " (suneido.js)';");
fs.writeFileSync(filename, result);
process.exit();
