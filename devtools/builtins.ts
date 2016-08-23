/**
 * @file
 * Generates the adapter functions/methods
 * for the Suneido calling convention.
 * 1) Reads a source file.
 * 2) Removes any old generated code.
 * 3) Inserts new generated code.
 * For example:
    function su_func(a, b, c) {
    }
    //BUILTIN Func(a, b, c)
    //GENERATED start
    su_func.call = su_func;
    su_func.callNamed = function (named, a, b, c) {
        ({ a = a, b = b, c = c } = named);
        return su_func(a, b, c);
    };
    su_func.callAt = function (args) {
        return su_func.callNamed(su.toObject(args.map), ...args.vec);
    };
    //GENERATED end

    class Foo {
        Bar(x, y) {
        }
        //BUILTIN Foo.Bar(x, y)
        //GENERATED start
        Bar_callNamed($named, x, y) {
            ({ x = x, y = y } = $named);
            return Foo.Bar(x, y);
        }
        Bar_callAt(args) {
            return Foo.Bar_callNamed(su.toObject(args.map), ...args.vec);
        }
    //GENERATED end
    }
 */

import * as fs from "fs";
import * as b from "./builtins2";

let filename = process.argv[2];
let source: string = fs.readFileSync(filename, { encoding: 'utf8' });
source = b.update(source);
fs.writeFileSync(filename, source);
process.exit();
