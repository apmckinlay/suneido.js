import { CacheMap } from "./cachemap";

export function tr(srcstr: string, from: string, to: string): string {
    let srclen: number = srcstr.length;

    if (srclen === 0 || from.length === 0)
        return srcstr;
    let allbut = from[0] === '^';
    if (allbut)
        from = from.substr(1);
    let fromset = makset(from);

    let si = 0;
    for (; si < srclen; si++) {
        let p = fromset.indexOf(srcstr[si]);
        if (allbut === (p === -1))
            break;
    }
    if (si === srclen)
        return srcstr; // no changes

    let toset = makset(to);
    let lastto = toset.length;
    let collapse = lastto > 0 && (allbut || lastto < fromset.length);
    lastto--;

    let dst = srcstr.substring(0, si);
    for (; si < srclen; si++) {
        let p = xindex(fromset, srcstr[si], allbut, lastto);
        if (collapse && p >= lastto) {
            dst += toset[lastto];
            do {
                if (++si >= srclen)
                    return dst;
                p = xindex(fromset, srcstr[si], allbut, lastto);
            } while (p >= lastto);
        }
        if (p < 0)
            dst += srcstr[si];
        else if (lastto >= 0)
            dst += toset[p];
    }
    return dst;
}

function makset(s: string): string {
    let dash = s.indexOf('-', 1);
    let p: string;

    if (dash === -1 || dash === (s.length - 1))
        return s; // no ranges to expand
    if (p = cache.get(s))
        return p;
    return cache.put(s, expandRanges(s));
}

let cache = new CacheMap<string, string>(10); // static

function expandRanges(s: string): string {
    let dst: string = '';
    for (let i = 0; i < s.length; i++)
        if (s[i] === '-' && i > 0 && i < s.length - 1)
            for (let c = s.charCodeAt(i - 1) + 1; c < s.charCodeAt(i + 1); c++)
                dst += String.fromCharCode(c);
        else
            dst += s[i];
    return dst;
}

function xindex(fromset: string, c: string, allbut: boolean, lastto: number): number {
    let i = fromset.indexOf(c);
    if (allbut)
        return i === -1 ? lastto + 1 : -1;
    else
        return i;
}
