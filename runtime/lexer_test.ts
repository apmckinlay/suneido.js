import Lexer from "./lexer"
import { Token, keywords } from "./tokens"
import * as assert from "./assert"

function check(src: string, ...expected): void {
    let lexer = new Lexer(src);
    let i = 0;
    for (; ;) {
        let token = lexer.next();
        if (token === Token.EOF)
            break;
        if (token === Token.WHITESPACE)
            continue;
        //console.log(Token[token], lexer.value());
        let exp = expected[i];
        if (typeof exp == 'number')
            eqToken(token, exp);
        else if (typeof exp == "string")
            assert.equal(lexer.value(), exp);
        else if (exp instanceof Array)
            check1(lexer, token, exp[0], exp[1], exp[2])
        else
            throw "oops";
        i++;
    }
    assert.equal(i, expected.length);
}

function check1(lexer: Lexer, token: Token,
    exptok: Token, expval: string, expkw: Token): void {
    eqToken(token, exptok);
    if (expval)
        assert.equal(lexer.value(), expval);
    if (expkw)
        eqToken(lexer.keyword(), expkw);
}

function eqToken(t1: Token, t2: Token) {
    if (t1 !== t2)
        throw new Error("assert failed: " + Token[t1] + "(" + t1 + ")" +
            " does not equal " + Token[t2] + "(" + t2 + ")");
}

check("");
check(" ");
check("#", Token.HASH);
check("is", [Token.IS, "is", Token.IS]);
check("function", [Token.IDENTIFIER, "function", Token.FUNCTION]);

check("is:", Token.IDENTIFIER, Token.COLON);

check("#(),:;?@[]{}.",
    Token.HASH, Token.L_PAREN, Token.R_PAREN, Token.COMMA, Token.COLON,
    Token.SEMICOLON, Token.Q_MARK, Token.AT, Token.L_BRACKET, Token.R_BRACKET,
    Token.L_CURLY, Token.R_CURLY, Token.DOT);

check("100.Times", Token.NUMBER, Token.DOT, Token.IDENTIFIER);
check("#20090216.EndOfMonth", Token.HASH, Token.NUMBER, Token.DOT, Token.IDENTIFIER);

check("s[1 .. 2]", Token.IDENTIFIER, Token.L_BRACKET, Token.NUMBER, Token.RANGETO,
    Token.NUMBER, Token.R_BRACKET);
check("x..y", Token.IDENTIFIER, Token.RANGETO, Token.IDENTIFIER);
check("x[1..]", Token.IDENTIFIER, Token.L_BRACKET, Token.NUMBER, Token.RANGETO,
    Token.R_BRACKET);
check("x[1 ..]", Token.IDENTIFIER, Token.L_BRACKET, Token.NUMBER, Token.RANGETO,
    Token.R_BRACKET);

check("= == != =~ !~ ! ++ -- < <= > >= << >> <<= >>= | |= & &= ^ ^=" +
    "+ += - -= $ $= * *= / /= % %= && || and or xor not is isnt",
    Token.EQ, Token.IS, Token.ISNT, Token.MATCH, Token.MATCHNOT, Token.NOT,
    Token.INC, Token.DEC, Token.LT, Token.LTE, Token.GT, Token.GTE,
    Token.LSHIFT, Token.RSHIFT, Token.LSHIFTEQ, Token.RSHIFTEQ,
    Token.BITOR, Token.BITOREQ, Token.BITAND, Token.BITANDEQ, Token.BITXOR,
    Token.BITXOREQ, Token.ADD, Token.ADDEQ, Token.SUB, Token.SUBEQ, Token.CAT,
    Token.CATEQ, Token.MUL, Token.MULEQ, Token.DIV, Token.DIVEQ, Token.MOD,
    Token.MODEQ, Token.AND, Token.OR, Token.AND, Token.OR, Token.ISNT,
    Token.NOT, Token.IS, Token.ISNT);

check("@/* stuff \n */@", Token.AT, Token.COMMENT, Token.AT);
check("/* ... *", Token.COMMENT);
check("if 1<2\n/**/Print(12)",
    Token.IDENTIFIER, Token.NUMBER, Token.LT, Token.NUMBER, Token.NEWLINE,
    Token.COMMENT, Token.IDENTIFIER, Token.L_PAREN, Token.NUMBER, Token.R_PAREN);

check("@// more\n@", Token.AT, Token.COMMENT, Token.NEWLINE, Token.AT);

function checkValues(token, ...values): void {
    let src = values.join(' ');
    let expected = values.map(v => [token, v]);
    check(src, ...expected);
}
checkValues(Token.NUMBER,
    "0", "1", "01", "123", "0x0", "0x1f", "0x1F",
    "1e2", "1E-2", "123e+456", ".1", "1.1", "123.456", ".12e3");
checkValues(Token.IDENTIFIER,
    "a", "A", "_x", "abc_123", "Abc?", "abc!");

function checkKeywords(src: string) {
    let expected = src.split(' ').map(t =>
        [Token.IDENTIFIER, t, Token[t.toUpperCase()] || "BAD"])
    check(src, ...expected);
}
checkKeywords("break case catch continue class callback default " +
    "dll do else for forever function if new " +
    "switch struct super return throw try while true false");

function checkStrings(...cases) {
    let src = cases.map(c => c[0]).join(' ');
    let expected = cases.map(c => [Token.STRING, c[1]]);
    check(src, ...expected);
}
checkStrings(
    ["''", ""],
    ["\"\"", ""],
    ["'abc'", "abc"],
    ["\"abc\"", "abc"],
    ["'\"'", "\""],
    ["\"'\"", "'"],
    ["'\\''", "'"],
    ["\"\\\"\"", "\""],
    ["'\\n'", "\n"],
    ["'\\r'", "\r"],
    ["'\\t'", "\t"],
    ["'\\015'", "\r"],
    ["'\\x0a'", "\n"],
    ["`\\`", "\\"])

console.log("finished");
process.exit();
