const jreq = require('equals');

/** Asserts that the expr === true */
export function that(expr: boolean, msg?: string): void {
    if (expr !== true)
        throw new Error("assert failed" + (msg ? ": " + msg : ""));
}

/** Asserts that the two values are == */
export function equal(x: any, y: any): void {
    if (!eq(x, y))
        throw new Error("assert failed: " + x + " does not equal " + y);
}

function eq(x: any, y: any): boolean {
    if (x === y)
        return true;
    if (typeof x === "number" && typeof y === "number")
        return x.toPrecision(14) === y.toPrecision(14);
    return jreq(x, y);
}

/** Asserts that the function throws an exception */
export function throws(f: () => any, rx?: RegExp): void {
    try {
        f();
    } catch (e) {
        if (rx)
            that(rx.test(e),
                "expected an exception matching " + rx + " but got " + e);
        return;
    }
    throw new Error("assert failed: expected exception but didn't throw");
}
