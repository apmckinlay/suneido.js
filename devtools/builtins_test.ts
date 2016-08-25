import * as assert from "../runtime/assert";
import * as b from "./builtins2";

function remove(lines: string[], expected?: string[]): void {
    b.removeOld(lines);
    assert.equal(lines, expected);
}

remove([], []);
remove(['one', 'two', 'three'], ['one', 'two', 'three']);
remove([b.START, b.END], []);
remove(['one', b.START, b.END, 'three'], ['one', 'three']);
remove(['one', b.START, 'two', b.END, 'three',
    'four', b.START, 'five', b.END, 'six'],
    ['one', 'three', 'four', 'six']);
assert.throws(() => remove([b.START]), /start without end/);
assert.throws(() => remove([b.END]), /end without start/);

function update(src: string): void {
    let result = b.update(src);
    assert.equal(result.replace(/\r/g, ''), src.replace(/\r/g, ''));
}

update("");
update(`one
        two
        three`);
update(`function su_func(a, b, c) {
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
        //GENERATED end`);

update(`class Foo {
            Bar(x, y) {
            }
        }
        //BUILTIN Foo.Bar(x, y)
        //GENERATED start
        Foo.prototype.Bar.call = Foo.prototype.Bar;
        Foo.prototype.Bar.callNamed = function ($named, x, y) {
            ({ x = x, y = y } = $named);
            return Foo.Bar(x, y);
        };
        Foo.prototype.Bar.callAt = function (args) {
            return Foo.Bar.callNamed(su.toObject(args.map), ...args.vec);
        };
        //GENERATED end`);
