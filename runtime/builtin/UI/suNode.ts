import * as util from '../../utility';
import { SuObject } from '../../suobject';
import { mandatory, maxargs } from "../../args";
import { SuCallable } from "../../suvalue";
import { globalLookup } from '../../global';
import { toStr, coerceStr } from '../../ops';
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
    AddEventListener(event: string = mandatory(), fn: SuCallable = mandatory()) {
        maxargs(2, arguments.length);
        let listener = (e: Event) => {
            let ob;
            if (e instanceof MouseEvent)
                ob = {x: e.x, y: e.y, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey};
            else
                ob = {};
            fn.$callNamed(ob);
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
    return su_getCurrentDocument();
};
(su_getCurrentDocument as any).$callAt = function (args: SuObject) {
    return (su_getCurrentDocument as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_getCurrentDocument as any).$params = '';
//GENERATED end

//BUILTIN SuNode.AddEventListener(event, fn)
//GENERATED start
(SuNode.prototype['AddEventListener'] as any).$call = SuNode.prototype['AddEventListener'];
(SuNode.prototype['AddEventListener'] as any).$callNamed = function ($named: any, event: any, fn: any) {
    ({ event = event, fn = fn } = $named);
    return SuNode.prototype['AddEventListener'].call(this, event, fn);
};
(SuNode.prototype['AddEventListener'] as any).$callAt = function (args: SuObject) {
    return (SuNode.prototype['AddEventListener'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuNode.prototype['AddEventListener'] as any).$params = 'event, fn';
//GENERATED end

//BUILTIN SuHtmlElement.SetStyle(property, value)
//GENERATED start
(SuHtmlElement.prototype['SetStyle'] as any).$call = SuHtmlElement.prototype['SetStyle'];
(SuHtmlElement.prototype['SetStyle'] as any).$callNamed = function ($named: any, property: any, value: any) {
    ({ property = property, value = value } = $named);
    return SuHtmlElement.prototype['SetStyle'].call(this, property, value);
};
(SuHtmlElement.prototype['SetStyle'] as any).$callAt = function (args: SuObject) {
    return (SuHtmlElement.prototype['SetStyle'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuHtmlElement.prototype['SetStyle'] as any).$params = 'property, value';
//GENERATED end

//BUILTIN SuHtmlElement.SetStyle(property)
//GENERATED start
(SuHtmlElement.prototype['SetStyle'] as any).$call = SuHtmlElement.prototype['SetStyle'];
(SuHtmlElement.prototype['SetStyle'] as any).$callNamed = function ($named: any, property: any) {
    ({ property = property } = $named);
    return SuHtmlElement.prototype['SetStyle'].call(this, property);
};
(SuHtmlElement.prototype['SetStyle'] as any).$callAt = function (args: SuObject) {
    return (SuHtmlElement.prototype['SetStyle'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuHtmlElement.prototype['SetStyle'] as any).$params = 'property';
//GENERATED end
