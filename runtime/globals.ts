/**
 * @file
 * Suneido globals
 */

import { defGlobal } from "./global";

import { SuObject } from "./suobject";
let Suneido = new SuObject();

// temp so BuiltDate works
import { SuDate } from "./sudate";
Suneido.put('BuiltDate', SuDate.literal('20160913'));
defGlobal('Suneido', Suneido);

import { su_display } from "./builtin/display";
defGlobal('Display', su_display);

import { su_print } from "./builtin/print";
defGlobal('Print', su_print);

import { su_type } from "./builtin/type";
defGlobal('Type', su_type);

import { su_construct } from "./builtin/construct";
defGlobal('Construct', su_construct);

import { su_object, su_objectq } from "./builtin/objects";
defGlobal('Object', su_object);
defGlobal('Object?', su_objectq);

import { su_record, su_recordq } from "./builtin/records";
defGlobal('Record', su_record);
defGlobal('Record?', su_recordq);

import { DATE_CLASS, su_dateq } from "./builtin/dates";
defGlobal('Date', DATE_CLASS);
defGlobal('Date?', su_dateq);

import { su_built } from "./builtin/built";
defGlobal('Built', su_built);

import { su_stringq } from "./builtin/strings";
defGlobal('String?', su_stringq);

import { su_numberq } from "./builtin/numbers";
defGlobal('Number?', su_numberq);

import { su_sequence } from "./builtin/susequence";
defGlobal('Sequence', su_sequence);

import { su_seq, su_seqq } from "./builtin/seq";
defGlobal('Seq', su_seq);
defGlobal('Seq?', su_seqq);

import { su_random } from "./builtin/random";
defGlobal('Random', su_random);

import { su_functionq } from "./builtin/functions";
defGlobal('Function?', su_functionq);

import { su_getCurrentDocument, su_getCurrentWindow, su_htmlElMap } from "./builtin/UI/suNode";
defGlobal('GetCurrentDocument', su_getCurrentDocument);
defGlobal('GetCurrentWindow', su_getCurrentWindow);
defGlobal('HtmlElMap', su_htmlElMap);

import { su_getCodeMirror } from "./builtin/UI/suCodeMirror";
defGlobal('GetCodeMirror', su_getCodeMirror);

import { su_unload } from "./builtin/unload";
defGlobal('Unload', su_unload);

import { su_classq, su_instanceq } from "./builtin/classq";
defGlobal("Class?", su_classq);
defGlobal('Instance?', su_instanceq);

import { su_booleanq } from "./builtin/booleanq";
defGlobal("Boolean?", su_booleanq);

import { su_webSocketClient } from "./builtin/suwebsocketclient";
defGlobal("WebSocketClient", su_webSocketClient);

/** FOR TESTING PURPOSES ONLY! */
defGlobal('Def', su_def);
function su_def(global: string, value: any): any {
    Object.freeze(value);
    defGlobal(global, value);
    return value;
}
import * as util from "./utility";
import { maxargs } from "./args";
//BUILTIN Def(name, value)
//GENERATED start
(su_def as any).$call = su_def;
(su_def as any).$callNamed = function ($named: any, name: any, value: any) {
    maxargs(3, arguments.length);
    ({ name = name, value = value } = $named);
    return su_def(name, value);
};
(su_def as any).$callAt = function (args: SuObject) {
    return (su_def as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_def as any).$params = 'name, value';
//GENERATED end
