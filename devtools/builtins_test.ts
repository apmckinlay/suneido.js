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
        (su_func as any).$call = su_func;
        (su_func as any).$callNamed = function ($named: any, a: any, b: any, c: any) {
            ({ a = a, b = b, c = c } = $named);
            return su_func(a, b, c);
        };
        (su_func as any).$callAt = function (args: SuObject) {
            return (su_func as any).$callNamed(su.toObject(args.map), ...args.vec);
        };
        (su_func as any).$params = 'a, b, c';
        //GENERATED end`);
update(`function su_func(args) {
        }
        //BUILTIN Func(@args)
        //GENERATED start
        (su_func as any).$callAt = su_func;
        (su_func as any).$call = function (...args: any[]) {
            return su_func(new SuObject(args));
        };
        (su_func as any).$callNamed = function (named: any, ...args: any[]) {
            return su_func(new SuObject(args, named));
        };
        (su_func as any).$params = '@args';
        //GENERATED end`);

update(`class Foo {
            Bar(x, y) {
            }
        }
        //BUILTIN Foo.Bar(x, y)
        //GENERATED start
        (Foo.prototype.Bar as any).$call = Foo.prototype.Bar;
        (Foo.prototype.Bar as any).$callNamed = function ($named: any, x: any, y: any) {
            ({ x = x, y = y } = $named);
            return Foo.prototype.Bar(x, y);
        };
        (Foo.prototype.Bar as any).$callAt = function (args: SuObject) {
            return (Foo.prototype.Bar as any).$callNamed(su.toObject(args.map), ...args.vec);
        };
        (Foo.prototype.Bar as any).$params = 'x, y';
        //GENERATED end`);
