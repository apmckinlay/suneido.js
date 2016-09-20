export function update(source: string, generate = false): string {
    let lines = source.split(/\r?\n/);
    removeOld(lines);
    if (generate)
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
            let insert = generate(line).filter(s => s).map(s => indent + s);
            lines.splice(i + 1, 0, indent + START, ...insert, indent + END);
        }
    }
}

function generate(line: string): string[] {
    let [, name, params] =
        line.match(/BUILTIN (\w+(?:.\w+[?!]?)?)\((.*)\)/)!;
    return name.includes('.')
        ? params.includes('@')
            ? genAtMethod(name, params)
            : genMethod(name, params)
        : params.includes('@')
            ? genAtFunction(name, params)
            : genFunction(name, params);
}

function genAtMethod(name: string, params: string) {
    let [clas, meth] = name.split('.');
    let f = `(${clas}.prototype['${meth}'] as any)`;
    return [
        `${f}.$callAt = ${clas}.prototype['${meth}'];`,
        `${f}.$call = function (...args: any[]) {`,
        `    return ${clas}.prototype['${meth}'].call(this, new SuObject(args));`,
        `};`,
        `${f}.$callNamed = function (named: any, ...args: any[]) {`,
        `    return ${clas}.prototype['${meth}'].call(this, new SuObject(args, util.obToMap(named)));`,
        `};`,
        `${f}.$params = '${params}';`
    ];
}

function genMethod(name: string, params: string) {
    let [clas, meth] = name.split('.');
    let f = `(${clas}.prototype['${meth}'] as any)`;
    return [
        `${f}.$call = ${clas}.prototype['${meth}'];`,
        `${f}.$callNamed = function (${decls(params)}) {`,
        `${assigns(params) }`,
        `    return ${clas}.prototype['${meth}'].call(this${
                params ? ', ' + paramsMap(params, s => s) : ''});`,
        `};`,
        `${f}.$callAt = function (args: SuObject) {`,
        `    return ${f}.$callNamed.call(this, util.mapToOb(args.map), ...args.vec);`,
        `};`,
        `${f}.$params = '${params}';`
    ];
}

function genAtFunction(name: string, params: string) {
    let su_name = 'su_' + name[0].toLowerCase() + name.slice(1); // TODO trailing ?!
    let f = '(' + su_name + ' as any)';
    return [
        `${f}.$callAt = ${su_name};`,
        `${f}.$call = function (...args: any[]) {`,
        `    return ${su_name}(new SuObject(args));`,
        `};`,
        `${f}.$callNamed = function (named: any, ...args: any[]) {`,
        `    return ${su_name}(new SuObject(args, util.obToMap(named)));`,
        `};`,
        `${f}.$params = '${params}';`
    ];
}

function genFunction(name: string, params: string) {
    let su_name = 'su_' + name[0].toLowerCase() + name.slice(1).replace(/\?$/, 'q');
    let f = '(' + su_name + ' as any)';
    return [
        `${f}.$call = ${su_name};`,
        `${f}.$callNamed = function (${decls(params)}) {`,
        `${assigns(params) }`,
        `    return ${su_name}(${paramsMap(params, s => s)});`,
        `};`,
        `${f}.$callAt = function (args: SuObject) {`,
        `    return ${f}.$callNamed(util.mapToOb(args.map), ...args.vec);`,
        `};`,
        `${f}.$params = '${params}';`
    ];
}

function decls(params: string) {
    return params
        ? '$named: any, ' + paramsMap(params, p => p + ': any')
        : '_named: any';
}

function assigns(params: string) {
    if (!params)
        return '';
    let s = paramsMap(params, p => p + ' = ' + p);
    return `    ({ ${s} } = $named);`;
}

function paramsMap(params: string, f: (s: string) => string) {
    return params.split(/, ?/).map(woDef).map(f).join(', ');
}

function woDef(s: string) {
    let i = s.indexOf('=');
    return i === -1 ? s : s.slice(0, i);
}
