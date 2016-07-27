/**
 * Character matchers based loosely on Guava CharMatcher for Guava
 * Used by regular expression code.
 */

type Char = string;

export abstract class CharMatcher {
    static NONE;

    abstract matches(c: Char): boolean;

    static is(c: Char): CharMatcher {
        return new Is(c);
    }
    static anyOf(s: string): CharMatcher {
        return new AnyOf(s);
    }
    static inRange(from: Char, to: Char): CharMatcher {
        return new InRange(from, to);
    }

    negate(): CharMatcher {
        return new Negate(this);
    }
    or(cm: CharMatcher): CharMatcher {
        return new Or(this, cm);
    }
    countIn(s: string): number {
        let n = 0;
        for (let c of s) {
            if (this.matches(c))
                n++;
        }
        return n;
    }
    indexIn(s: string): number {
        let i = 0
        for (let c of s) {
            if (this.matches(c))
                return i;
            i++;
        }
        return -1;
    }
}

class None extends CharMatcher {
    matches(c: string): boolean {
        return false;
    }
}

CharMatcher.NONE = new None();

class Is extends CharMatcher {
    constructor(private c: Char) {
        super();
    }
    matches(c: Char): boolean {
        return c == this.c;
    }
}

class AnyOf extends CharMatcher {
    constructor(private chars: string) {
        super();
    }
    matches(c: Char): boolean {
        return this.chars.includes(c);
    }
}

class InRange extends CharMatcher {
    constructor(private from: Char, private to: Char) {
        super();
    }
    matches(c: Char): boolean {
        return this.from <= c && c <= this.to;
    }
}

class Negate extends CharMatcher {
    constructor(private cm: CharMatcher) {
        super();
    }
    matches(c: Char): boolean {
        return !this.cm.matches(c);
    }
}

class Or extends CharMatcher {
    constructor(private cm1: CharMatcher, private cm2: CharMatcher) {
        super();
    }
    matches(c: Char): boolean {
        return this.cm1.matches(c) || this.cm2.matches(c);
    }
}
