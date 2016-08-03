import { CacheMap } from "./cachemap";

export function tr(srcstr: string, from: string, to: string): string {
    var srclen: number = srcstr.length;

    if (srclen === 0 || from.length === 0)
        return srcstr;
    var allbut = from.charAt(0) === '^';
    if (allbut)
        from = from.substr(1);
    var fromset = makset(from);

    for (var si = 0; si < srclen; si++) {
        let p = fromset.indexOf(srcstr.charAt(si));
        if (allbut === (p === -1))
            break;
    }
    if (si === srclen)
        return srcstr; // no changes

    var toset = makset(to);
    var lastto = toset.length;
    var collapse = lastto > 0 && (allbut || lastto < fromset.length);
    lastto--;

    var dst = srcstr.substring(0, si);
    for (; si < srclen; si++) {
        let p = xindex(fromset, srcstr.charAt(si), allbut, lastto);
        if (collapse && p >= lastto) {
            dst += toset[lastto];
            do {
                if (++si >= srclen)
                    return dst;
                p = xindex(fromset, srcstr.charAt(si), allbut, lastto);
            } while (p >= lastto);
        }
        if (p < 0)
            dst += srcstr.charAt(si);
        else if (lastto >= 0)
            dst += toset[p];
    }
    return dst;
}

function makset(s: string): string {
    var dash = s.indexOf('-', 1),
        p: string;

    if (dash === -1 || dash === (s.length - 1))
        return s; // no ranges to expand
    if (p = makset["cache"].get(s))
        return p;
    return makset["cache"].put(s, expandRanges(s));
}

makset["cache"] = new CacheMap<string, string>(10);

function expandRanges(s: string): string {
    var dst: string = '';
    for (var i = 0; i < s.length; i++)
        if (s.charAt(i) === '-' && i > 0 && i < s.length - 1)
            for (var c = s.charCodeAt(i - 1) + 1; c < s.charCodeAt(i + 1); c++)
                dst += String.fromCharCode(c);
        else
            dst += s.charAt(i);
    return dst;
}

function xindex(fromset: string, c: string, allbut: boolean, lastto: number): number {
    var i = fromset.indexOf(c);
    if (allbut)
        return i === -1 ? lastto + 1 : -1;
    else
        return i;
}
