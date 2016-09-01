export function mandatory(): never {
    throw new Error("missing argument");
}

export function maxargs(max: number, len: number): void {
    if (len > max)
        throw new Error("too many arguments");
}
