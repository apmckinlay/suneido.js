// incomplete - requires a lexical scanner

import * as fs from "fs";

runtests();
process.exit();

let fixtures = {
    "ptest": ptest
};

function runtests() {
    let dir = testdir();
    for (let file of fs.readdirSync(dir))
        if (file.endsWith(".test"))
            console.log(file)
}

function testdir(): string {
    let path = 'ptestdir.txt';
    for (let i = 0; ; i++) {
        try {
            return fs.readFileSync(path, 'utf8')
        } catch (e) {
        }
        if (i > 8)
            throw new Error("can't find ptestdir.txt");
        path = '../' + path;
    }
}

function ptest(x, y): boolean {
    return x == y;
}
