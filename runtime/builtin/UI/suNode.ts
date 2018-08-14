import * as util from '../../utility';
import { SuObject } from '../../suobject';
import { mandatory, maxargs } from "../../args";
import { SuCallable } from "../../suvalue";
import { globalLookup } from '../../global';
import { toStr, coerceStr, toBoolean } from '../../ops';
import { SuEl, defMap } from './suEl';

export interface SuEventTarget {
    AddEventListener: (type: string, callback: SuCallable) => void;
    // RemoveEventListener: (type: string, callback: SuCallable) => void;
}

export class SuNode extends SuEl implements SuEventTarget {
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
    AddEventListener(_event: any = mandatory(), fn: SuCallable = mandatory(), _preventDefault: any = false) {
        maxargs(3, arguments.length);
        let event: string = toStr(_event);
        let preventDefault: boolean = toBoolean(_preventDefault);
        let listener = (e: Event) => {
            let ob;
            if (e instanceof MouseEvent)
                ob = {x: e.x, y: e.y, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey};
            else
                ob = {};
            fn.$callNamed(ob);
            if (preventDefault)
                e.preventDefault();
        };
        this.el.addEventListener(event, listener);
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

export class SuWindow extends SuEl {
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

export function su_getCurrentWindow(): SuWindow | false {
    maxargs(0, arguments.length);
    return window ? new SuWindow(window) : false;
}

export function su_getCurrentDocument(): SuDocument | false {
    maxargs(0, arguments.length);
    return document ? new SuDocument(document) : false;
}

if (typeof window !== 'undefined') {
    defMap(HTMLElement, SuHtmlElement);
    defMap(Element, SuElement);
    defMap(Document, SuDocument);
    defMap(Node, SuNode);
    defMap(Window, SuWindow);
}


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
(su_getCurrentDocument as any).$params = '';
//GENERATED end

//BUILTIN SuNode.AddEventListener(event, fn, preventDefault=false)
//GENERATED start
(SuNode.prototype['AddEventListener'] as any).$call = SuNode.prototype['AddEventListener'];
(SuNode.prototype['AddEventListener'] as any).$callNamed = function ($named: any, event: any, fn: any, preventDefault: any) {
    maxargs(4, arguments.length);
    ({ event = event, fn = fn, preventDefault = preventDefault } = $named);
    return SuNode.prototype['AddEventListener'].call(this, event, fn, preventDefault);
};
(SuNode.prototype['AddEventListener'] as any).$callAt = function (args: SuObject) {
    return (SuNode.prototype['AddEventListener'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuNode.prototype['AddEventListener'] as any).$params = 'event, fn, preventDefault=false';
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
(SuHtmlElement.prototype['GetStyle'] as any).$params = 'property';
//GENERATED end
