import { SuObject } from "./suobject";
import * as su from "./su";

export interface Member {
    key: string;
    value: any;
    params?: string;
    paramNames?: string[];
}
export function makeClass(baseName: string | false, members: Member[]) {
    let $super = baseName;
    let $c = Object.create($super === false ? su.root_class : su.global($super));
    for (let member of members) {
        if (typeof member.value === 'function')
            $c.put(member.key, generateMethod(member));
        else
            $c.put(member.key, member.value);
    }
    Object.freeze($c);
    return $c;
}

function generateMethod(member: Member) {
    let $callNamed = function(named: any, ...args: any[]) {
        if (!member.paramNames)
            return member.value.call(this);
        let params = [];
        for (let i = 0; i < member.paramNames.length; i++)
            params[i] = args[i];
        for (let i = 0; i < member.paramNames.length; i++)
            if (named[member.paramNames[i]] !== undefined)
                params[i] = named[member.paramNames[i]];
        return member.value.apply(this, params);
    };
    let $f = member.value;
    $f.$callableType = "METHOD";
    $f.$call = $f;
    $f.$callNamed = $callNamed;
    $f.$callAt = function (args: SuObject) {
        return $callNamed.call(this, su.mapToOb(args.map), ...args.vec);
    };
    $f.$params = member.params;
    return $f;
}

export function makeObj(vec: any[], ...mapPairs: [any, any][]): SuObject {
    return new SuObject(vec, new Map(mapPairs));
}
