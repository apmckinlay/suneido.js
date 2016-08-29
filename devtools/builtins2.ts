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
    let end: number | undefined;
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
            let [indent] = line.match(/^\s*/)!;
            let insert = generate(line).map(s => indent + s);
            lines.splice(i + 1, 0, indent + START, ...insert, indent + END);
        }
    }
}

function generate(line: string): string[] {
    let [, name, params] =
        line.match(/BUILTIN (\w+(?:.\w+)?[?!]?)\((.*)\)/)!;
    return name.includes('.')
        ? genMethod(name, params)
        : params.includes('@')
            ? genAtFunction(name, params)
            : genFunction(name, params);
}

function genMethod(name: string, params: string) {
    let [clas, meth] = name.split('.');
    let f = `(${clas}.prototype.${meth} as any)`;
    return [
        `${f}.\$call = ${clas}.prototype.${meth};`,
        `${f}.\$callNamed = function ($named: any, ${decls(params)}) {`,
        `    ({ ${assigns(params)} } = $named);`,
        `    return ${clas}.prototype.${meth}(${params});`,
        `};`,
        `${f}.\$callAt = function (args: SuObject) {`,
        `    return ${f}.\$callNamed(su.toObject(args.map), ...args.vec);`,
        `};`,
        `${f}.\$params = '${params}';`
    ];
}

function genAtFunction(name: string, params: string) {
    let su_name = 'su_' + name[0].toLowerCase() + name.slice(1); // TODO trailing ?!
    let f = '(' + su_name + ' as any)';
    return [
        `${f}.\$callAt = ${su_name};`,
        `${f}.\$call = function (...args: any[]) {`,
        `    return ${su_name}(new SuObject(args));`,
        `};`,
        `${f}.\$callNamed = function (named: any, ...args: any[]) {`,
        `    return ${su_name}(new SuObject(args, su.toMap(named)));`,
        `};`,
        `${f}.\$params = '${params}';`
    ];
}

function genFunction(name: string, params: string) {
    let su_name = 'su_' + name[0].toLowerCase() + name.slice(1); // TODO trailing ?!
    let f = '(' + su_name + ' as any)';
    return [
        `${f}.\$call = ${su_name};`,
        `${f}.\$callNamed = function ($named: any, ${decls(params)}) {`,
        `    ({ ${assigns(params)} } = $named);`,
        `    return ${su_name}(${params});`,
        `};`,
        `${f}.\$callAt = function (args: SuObject) {`,
        `    return ${f}.\$callNamed(su.toObject(args.map), ...args.vec);`,
        `};`,
        `${f}.\$params = '${params}';`
    ];
}

function decls(params: string) {
    return params.split(/, ?/).map(p => p + ': any').join(', ');
}

function assigns(params: string) {
    return params.split(/, ?/).map(p => p + ' = ' + p).join(', ');
}
