/**
 * Portable tests runner
 */

import * as fs from "fs";
import Lexer from "./lexer"
import { Token } from "./tokens"
import * as tokens from "./tokens"

const SKIP = true;

const dir = testdir();

export function runAll(fixtures) {
    for (let file of fs.readdirSync(dir))
        if (file.endsWith(".test"))
            runFile(fixtures, file);
}

function testdir(): string {
    let path = 'ptestdir.txt';
    for (let i = 0; ; i++) {
        try {
            return fs.readFileSync(path, 'utf8').trim();
        } catch (e) {
        }
        if (i > 8)
            throw new Error("can't find ptestdir.txt");
        path = '../' + path;
    }
}

export function runFile(file: string, fixtures): void {
    let src = fs.readFileSync(dir + file, "utf8");
    let scan = new Scanner(src);
    while (scan.token !== Token.EOF)
        run1(fixtures, file, scan);
}

function missing() {
    return true;
}

function run1(fixtures, file: string, scan: Scanner): void {
    scan.match(Token.AT);
    let name = scan.value();
    scan.match(Token.IDENTIFIER, SKIP);
    console.log(file + ": " + name + ":")
    let n = 0;
    let fixture = fixtures[name];
    if (!fixture) {
        console.log("\tMISSING FIXTURE");
        fixture = missing;
    }
    let ok = true;
    while (scan.token !== Token.EOF && scan.token !== Token.AT) {
        let args = [];
        do {
            let text: string = "";
            if (scan.token === Token.SUB) {
                text = '-';
                scan.match(Token.SUB);
            }
            text += scan.value();
            args.push(text);
            scan.next();
            if (scan.token === Token.COMMA)
                scan.next(SKIP);
        } while (scan.token !== Token.EOF && scan.token != Token.NEWLINE);
        // here's the actual test
        if (!runCase(fixture, args))
            console.log("\tFAILED: ", args)
        else
            ++n;
        scan.next(SKIP);
    }
    if (fixture !== missing)
        console.log("\t" + n + " passed");
}

function runCase(fixture, args) {
    try {
        return fixture(...args);
    } catch (e) {
        console.log('\t' + e);
        return false
    }
}

class Scanner {
    private lexer: Lexer;
    public token: Token;

    constructor(src: string) {
        this.lexer = new Lexer(src);
        this.next(SKIP);
    }

    value() {
        return this.lexer.value();
    }

    next(skip: boolean = false): void {
        do {
            this.token = this.lexer.next();
            if (this.token === Token.EOF ||
                !skip && this.token === Token.NEWLINE)
                break;
        } while (this.token === Token.NEWLINE || this.token === Token.WHITESPACE ||
            this.token === Token.COMMENT);
    }

    match(expected: Token, skip: boolean = false): void {
        if (this.token !== expected)
            throw new Error("expected " + (tokens as any).Token[expected] +
                " got " + (tokens as any).Token[this.token]);
        this.next(skip);
    }
}
