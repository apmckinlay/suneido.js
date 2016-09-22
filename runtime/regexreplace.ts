import { Result } from "./regex";
import * as assert from "./assert";

export class RegexReplace {
    public static append(s: string, res: Result, rep: string, obj: {str: string}): void {
        if (this.get(rep, 0) === '\\' && this.get(rep, 1) === '=') {
            obj.str += rep.substring(2);
            return;
        }
        let tr = 'E';
        for (let ri = 0; ri < rep.length; ri++) {
            let rc = rep.charAt(ri);
            if (rc === '&')
                tr = this.insert(obj, res.group(s, 0), tr);
            else if (rc === '\\' && ri + 1 < rep.length) {
                rc = this.get(rep, ++ri);
                let n = parseInt(rc);
                if (! isNaN(n))
                    tr = this.insert(obj, res.group(s, parseInt(rc)), tr);
                else if (rc === 'n')
                    obj.str += '\n';
                else if (rc === 't')
                    obj.str += '\t';
                else if (rc === '\\')
                    obj.str += '\\';
                else if (rc === '&')
                    obj.str += '&';
                else if (rc === 'u' || rc === 'l' || rc === 'U' || rc === 'L'
						|| rc === 'E')
                    tr = rc;
                else
                    obj.str += rc;
            } else {
                let resObj = this.trcase(tr, rc);
                obj.str += resObj.c;
                tr = resObj.tr;
            }
        }
    }
    private static get(s: string, i: number): string {
        return i < s.length ? s.charAt(i) : String.fromCharCode(0);
    }
    private static trcase(tr: string, rc: string): {c: string, tr: string} {
        switch (tr) {
            case 'E':
                return {c: rc, tr: 'E'};
            case 'L':
                return {c: rc.toLowerCase(), tr: 'L'};
            case 'U':
                return {c: rc.toUpperCase(), tr: 'U'};
            case 'l':
                return {c: rc.toLowerCase(), tr: 'E'};
            case 'u':
                return {c: rc.toUpperCase(), tr: 'E'};
            default:
                assert.that(false, "bad trcase");
        }
        return {c: "", tr: 'E'};
    }
    private static insert(obj: {str: string}, group: string | null, tr: string): string {
        if (group === null || group.length === 0)
            return tr;
        switch(tr) {
            case 'E':
                obj.str += group;
                return 'E';
            case 'L':
                obj.str += group.toLowerCase();
                return 'L';
            case 'U':
                obj.str += group.toUpperCase();
                return 'U';
            case 'l':
                obj.str += group.charAt(0).toLowerCase() + group.slice(1);
                return 'E';
            case 'u':
                obj.str += group.charAt(0).toUpperCase() + group.slice(1);
                return 'E';
            default:
                assert.that(false, "Invalid replace type");
        }
        return 'E';
    }
}
