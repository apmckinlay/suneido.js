export function isString(x: any): boolean {
    return x != undefined && typeof x.valueOf() === 'string';
}
