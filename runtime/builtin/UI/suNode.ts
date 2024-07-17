import * as util from '../../utility';
import { SuObject } from '../../suobject';
import { SuValue } from '../../suvalue';
import { mandatory, maxargs } from "../../args";
import { SuCallable } from "../../suvalue";
import { globalLookup } from '../../global';
import { toStr, coerceStr, toBoolean } from '../../ops';
import { SuEl, defMap, makeSuValue, convertSuValue, SuBuiltInEl } from './suEl';

abstract class SuEventTarget extends SuEl {
    AddEventListener(_event: any = mandatory(), fn: SuCallable = mandatory(),
        _useCapture: any = false) {
        maxargs(3, arguments.length);
        let event: string = toStr(_event);
        let useCapture: boolean = toBoolean(_useCapture);
        let listener = event === 'keydown' || event === 'keyup' ? (e: Event) => {
                // browser autofill
                if (!(e as KeyboardEvent).key) {
                    return;
                }
                let suValue = makeSuValue(e);
                fn.$callNamed({ event: suValue });
            } : (e: Event) => {
                let suValue = makeSuValue(e);
                fn.$callNamed({ event: suValue });
            };
        fn.$callbackWrapper = listener;
        this.el.addEventListener(event, listener, useCapture);
        return fn;
    }

    RemoveEventListener(_event: any = mandatory(), fn: SuCallable = mandatory(),
        _useCapture: any = false) {
        maxargs(3, arguments.length);
        const event: string = toStr(_event);
        const useCapture: boolean = toBoolean(_useCapture);
        if (fn.$callbackWrapper === undefined) {
            throw new Error("RemoveEventListener: missing callback wrapper");
        }
        this.el.removeEventListener(event, fn.$callbackWrapper, useCapture);
    }
}

export class SuNode extends SuEventTarget {
    constructor(public el: Node) {
        super();
    }
    type(): string {
        return 'Node';
    }
    display(): string {
        return `${this.type()}(<${this.el.nodeName}>)`;
    }
    protected lookupGlobal(method: string) {
        return globalLookup("Nodes", method) || super.lookupGlobal(method);
    }

    static DEFAULT = {};
    Control(ctrl: any = SuNode.DEFAULT): any {
        maxargs(1, arguments.length);
        if (ctrl === SuNode.DEFAULT)
            return (this.el as any).su_control;
        return (this.el as any).su_control = ctrl;
    }
    Window(win: any = SuNode.DEFAULT): any {
        maxargs(1, arguments.length);
        if (win === SuNode.DEFAULT)
            return (this.el as any).su_window;
        return (this.el as any).su_window = win;
    }
}

export class SuElement extends SuNode {
    constructor(public el: Element) {
        super(el);
    }
    type(): string {
        return 'Element';
    }
    protected lookupGlobal(method: string) {
        return globalLookup("Elements", method) || super.lookupGlobal(method);
    }
}

export class SuHtmlElement extends SuElement {
    constructor(public el: HTMLElement) {
        super(el);
    }
    type(): string {
        return 'HTMLElement';
    }
    protected lookupGlobal(method: string) {
        return globalLookup("HTMLElements", method) || super.lookupGlobal(method);
    }
    SetStyle(property: any = mandatory(), value: any = mandatory()) {
        maxargs(2, arguments.length);
        (this.el.style as any)[toStr(property)] = coerceStr(value);
    }
    GetStyle(property: any = mandatory()) {
        maxargs(1, arguments.length);
        return (this.el.style as any)[toStr(property)] || "";
    }
}

export class SuDocument extends SuNode {
    constructor(el: Document) {
        super(el);
    }
    type(): string {
        return 'Document';
    }
    protected lookupGlobal(method: string) {
        return globalLookup("Documents", method) || super.lookupGlobal(method);
    }
}

export class SuWindow extends SuEventTarget {
    constructor(public el: Window) {
        super();
    }
    type(): string {
        return 'Window';
    }
    display(): string {
        return `Window(<${this.el.location.toString()}>)`;
    }
    protected lookupGlobal(method: string) {
        return globalLookup("Windows", method) || super.lookupGlobal(method);
    }
}

export class SuHtmlElMap extends SuValue {
    constructor(public suWin: any) {
        super();
    }
    type(): string {
        return 'HtmlElMap';
    }
    display(): string {
        return this.type();
    }
    compareTo(x: any): util.Cmp {
        return -1;
    }
    equals(that: any): boolean {
        if (!(that instanceof SuHtmlElMap))
            return false;
        return this.suWin === that.suWin;
    }
    lookup(this: any, method: string): SuCallable {
        return this[method];
    }
    get(key: any): any {
        if (key instanceof SuNode)
            return (key.el as any).su_control;
        return undefined;
    }
    ['Member?'](key: any = mandatory()): boolean {
        maxargs(1, arguments.length);
        if (!(key instanceof SuNode))
            return false;
        return (key.el as any).su_window === this.suWin;
    }
}

export function su_htmlElMap(_suWin: any): SuHtmlElMap {
    maxargs(1, arguments.length);
    return new SuHtmlElMap(_suWin);
}

export function su_getCurrentWindow(): SuWindow | false {
    maxargs(0, arguments.length);
    return window ? new SuWindow(window) : false;
}

export function su_getCurrentDocument(): SuDocument | false {
    maxargs(0, arguments.length);
    return document ? new SuDocument(document) : false;
}

export function su_makeWebObject(args: SuObject): SuBuiltInEl {
    if (!args.vec[0]) {
        throw new Error("missing class name");
    }
    let className = toStr(args.vec[0]);
    let cls: any = window && (window as any)[className];
    if (!cls || typeof cls !== 'function') {
        throw new Error(`Cannot find ${className} on global window`);
    }
    let convertedArgs: any[] = [];
    for (let i = 1; i < args.vec.length; i++) {
        convertedArgs.push(convertSuValue(args.vec[i]));
    }
    return makeSuValue(new cls(...convertedArgs));
}

if (typeof window !== 'undefined') {
    defMap(HTMLElement, SuHtmlElement);
    defMap(Element, SuElement);
    defMap(Document, SuDocument);
    defMap(Node, SuNode);
    defMap(Window, SuWindow);
}

//BUILTIN HtmlElMap(Window)
//GENERATED start
(su_htmlElMap as any).$call = su_htmlElMap;
(su_htmlElMap as any).$callNamed = function ($named: any, Window: any) {
    maxargs(2, arguments.length);
    ({ Window = Window } = $named);
    return su_htmlElMap(Window);
};
(su_htmlElMap as any).$callAt = function (args: SuObject) {
    return (su_htmlElMap as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_htmlElMap as any).$callableType = "BUILTIN";
(su_htmlElMap as any).$callableName = "HtmlElMap";
(su_htmlElMap as any).$params = 'Window';
//GENERATED end

//BUILTIN SuHtmlElMap.Member?(key)
//GENERATED start
(SuHtmlElMap.prototype['Member?'] as any).$call = SuHtmlElMap.prototype['Member?'];
(SuHtmlElMap.prototype['Member?'] as any).$callNamed = function ($named: any, key: any) {
    maxargs(2, arguments.length);
    ({ key = key } = $named);
    return SuHtmlElMap.prototype['Member?'].call(this, key);
};
(SuHtmlElMap.prototype['Member?'] as any).$callAt = function (args: SuObject) {
    return (SuHtmlElMap.prototype['Member?'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuHtmlElMap.prototype['Member?'] as any).$callableType = "BUILTIN";
(SuHtmlElMap.prototype['Member?'] as any).$callableName = "SuHtmlElMap#Member?";
(SuHtmlElMap.prototype['Member?'] as any).$params = 'key';
//GENERATED end

//BUILTIN GetCurrentWindow()
//GENERATED start
(su_getCurrentWindow as any).$call = su_getCurrentWindow;
(su_getCurrentWindow as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return su_getCurrentWindow();
};
(su_getCurrentWindow as any).$callAt = function (args: SuObject) {
    return (su_getCurrentWindow as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_getCurrentWindow as any).$callableType = "BUILTIN";
(su_getCurrentWindow as any).$callableName = "GetCurrentWindow";
(su_getCurrentWindow as any).$params = '';
//GENERATED end

//BUILTIN GetCurrentDocument()
//GENERATED start
(su_getCurrentDocument as any).$call = su_getCurrentDocument;
(su_getCurrentDocument as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return su_getCurrentDocument();
};
(su_getCurrentDocument as any).$callAt = function (args: SuObject) {
    return (su_getCurrentDocument as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_getCurrentDocument as any).$callableType = "BUILTIN";
(su_getCurrentDocument as any).$callableName = "GetCurrentDocument";
(su_getCurrentDocument as any).$params = '';
//GENERATED end

//BUILTIN MakeWebObject(@args)
//GENERATED start
(su_makeWebObject as any).$callAt = su_makeWebObject;
(su_makeWebObject as any).$call = function (...args: any[]) {
    return su_makeWebObject(new SuObject(args));
};
(su_makeWebObject as any).$callNamed = function (named: any, ...args: any[]) {
    return su_makeWebObject(new SuObject(args, util.obToMap(named)));
};
(su_makeWebObject as any).$callableType = "BUILTIN";
(su_makeWebObject as any).$callableName = "MakeWebObject";
(su_makeWebObject as any).$params = '@args';
//GENERATED end

//BUILTIN SuEventTarget.AddEventListener(event, fn, useCapture=false)
//GENERATED start
(SuEventTarget.prototype['AddEventListener'] as any).$call = SuEventTarget.prototype['AddEventListener'];
(SuEventTarget.prototype['AddEventListener'] as any).$callNamed = function ($named: any, event: any, fn: any, useCapture: any) {
    maxargs(4, arguments.length);
    ({ event = event, fn = fn, useCapture = useCapture } = $named);
    return SuEventTarget.prototype['AddEventListener'].call(this, event, fn, useCapture);
};
(SuEventTarget.prototype['AddEventListener'] as any).$callAt = function (args: SuObject) {
    return (SuEventTarget.prototype['AddEventListener'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuEventTarget.prototype['AddEventListener'] as any).$callableType = "BUILTIN";
(SuEventTarget.prototype['AddEventListener'] as any).$callableName = "SuEventTarget#AddEventListener";
(SuEventTarget.prototype['AddEventListener'] as any).$params = 'event, fn, useCapture=false';
//GENERATED end

//BUILTIN SuEventTarget.RemoveEventListener(event, fn, useCapture=false)
//GENERATED start
(SuEventTarget.prototype['RemoveEventListener'] as any).$call = SuEventTarget.prototype['RemoveEventListener'];
(SuEventTarget.prototype['RemoveEventListener'] as any).$callNamed = function ($named: any, event: any, fn: any, useCapture: any) {
    maxargs(4, arguments.length);
    ({ event = event, fn = fn, useCapture = useCapture } = $named);
    return SuEventTarget.prototype['RemoveEventListener'].call(this, event, fn, useCapture);
};
(SuEventTarget.prototype['RemoveEventListener'] as any).$callAt = function (args: SuObject) {
    return (SuEventTarget.prototype['RemoveEventListener'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuEventTarget.prototype['RemoveEventListener'] as any).$callableType = "BUILTIN";
(SuEventTarget.prototype['RemoveEventListener'] as any).$callableName = "SuEventTarget#RemoveEventListener";
(SuEventTarget.prototype['RemoveEventListener'] as any).$params = 'event, fn, useCapture=false';
//GENERATED end

//BUILTIN SuNode.Control(control)
//GENERATED start
(SuNode.prototype['Control'] as any).$call = SuNode.prototype['Control'];
(SuNode.prototype['Control'] as any).$callNamed = function ($named: any, control: any) {
    maxargs(2, arguments.length);
    ({ control = control } = $named);
    return SuNode.prototype['Control'].call(this, control);
};
(SuNode.prototype['Control'] as any).$callAt = function (args: SuObject) {
    return (SuNode.prototype['Control'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuNode.prototype['Control'] as any).$callableType = "BUILTIN";
(SuNode.prototype['Control'] as any).$callableName = "SuNode#Control";
(SuNode.prototype['Control'] as any).$params = 'control';
//GENERATED end

//BUILTIN SuNode.Window(window)
//GENERATED start
(SuNode.prototype['Window'] as any).$call = SuNode.prototype['Window'];
(SuNode.prototype['Window'] as any).$callNamed = function ($named: any, window: any) {
    maxargs(2, arguments.length);
    ({ window = window } = $named);
    return SuNode.prototype['Window'].call(this, window);
};
(SuNode.prototype['Window'] as any).$callAt = function (args: SuObject) {
    return (SuNode.prototype['Window'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuNode.prototype['Window'] as any).$callableType = "BUILTIN";
(SuNode.prototype['Window'] as any).$callableName = "SuNode#Window";
(SuNode.prototype['Window'] as any).$params = 'window';
//GENERATED end

//BUILTIN SuHtmlElement.SetStyle(property, value)
//GENERATED start
(SuHtmlElement.prototype['SetStyle'] as any).$call = SuHtmlElement.prototype['SetStyle'];
(SuHtmlElement.prototype['SetStyle'] as any).$callNamed = function ($named: any, property: any, value: any) {
    maxargs(3, arguments.length);
    ({ property = property, value = value } = $named);
    return SuHtmlElement.prototype['SetStyle'].call(this, property, value);
};
(SuHtmlElement.prototype['SetStyle'] as any).$callAt = function (args: SuObject) {
    return (SuHtmlElement.prototype['SetStyle'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuHtmlElement.prototype['SetStyle'] as any).$callableType = "BUILTIN";
(SuHtmlElement.prototype['SetStyle'] as any).$callableName = "SuHtmlElement#SetStyle";
(SuHtmlElement.prototype['SetStyle'] as any).$params = 'property, value';
//GENERATED end

//BUILTIN SuHtmlElement.GetStyle(property)
//GENERATED start
(SuHtmlElement.prototype['GetStyle'] as any).$call = SuHtmlElement.prototype['GetStyle'];
(SuHtmlElement.prototype['GetStyle'] as any).$callNamed = function ($named: any, property: any) {
    maxargs(2, arguments.length);
    ({ property = property } = $named);
    return SuHtmlElement.prototype['GetStyle'].call(this, property);
};
(SuHtmlElement.prototype['GetStyle'] as any).$callAt = function (args: SuObject) {
    return (SuHtmlElement.prototype['GetStyle'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuHtmlElement.prototype['GetStyle'] as any).$callableType = "BUILTIN";
(SuHtmlElement.prototype['GetStyle'] as any).$callableName = "SuHtmlElement#GetStyle";
(SuHtmlElement.prototype['GetStyle'] as any).$params = 'property';
//GENERATED end
