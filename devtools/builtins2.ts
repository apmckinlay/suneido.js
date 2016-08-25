export function update(source: string): string {
    let lines = source.split(/\r?\n/);
    removeOld(lines);
    insertNew(lines);
    return lines.join('\r\n');
}

export const START = "//GENERATED start";
export const END = "//GENERATED end";
const BUILTIN = "//BUILTIN";

export function removeOld(lines: string[]): void {
    let end: number;
    // process in reverse so removals don't change indexes
    for (let i = lines.length - 1; i >= 0; i--) {
        let line = lines[i].trim();
        if (line === END)
            end = i;
        else if (line === START) {
            if (!end)
                throw new Error("start without end");
            lines.splice(i, end - i + 1);
            end = undefined;
        }
    }
    if (end !== undefined)
        throw new Error("end without start");
}

function insertNew(lines: string[]): void {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim().startsWith(BUILTIN)) {
            let [indent] = line.match(/^\s*/);
            let insert = generate(line).map(s => indent + s);
            lines.splice(i + 1, 0, indent + START, ...insert, indent + END);
        }
    }
}

function generate(line: string): string[] {
    let [, name, params] =
        line.match(/BUILTIN (\w+(?:.\w+)?[?!]?)\((.*)\)/);
    return name.includes('.')
        ? genMethod(name, params)
        : genFunction(name, params);
}

function genMethod(name: string, params: string) {
    let [clas, meth] = name.split('.');
    return [
        `${clas}.prototype.${meth}.call = ${clas}.prototype.${meth};`,
        `${clas}.prototype.${meth}.callNamed = function ($named, ${params}) {`,
        `    ({ ${assigns(params)} } = $named);`,
        `    return ${clas}.${meth}(${params});`,
        `};`,
        `${clas}.prototype.${meth}.callAt = function (args) {`,
        `    return ${clas}.${meth}.callNamed(su.toObject(args.map), ...args.vec);`,
        `};`,
    ];
}

function genFunction(name: string, params: string) {
    let su_name = 'su_' + name[0].toLowerCase() + name.slice(1); // TODO trailing ?!
    return [
        `${su_name}.call = ${su_name};`,
        `${su_name}.callNamed = function (named, ${params}) {`,
        `    ({ ${assigns(params)} } = named);`,
        `    return ${su_name}(${params});`,
        `};`,
        `${su_name}.callAt = function (args) {`,
        `    return ${su_name}.callNamed(su.toObject(args.map), ...args.vec);`,
        `};`,
    ];
}

function assigns(params: string) {
    return params.split(/, ?/).map(p => p + ' = ' + p).join(', ');
}
