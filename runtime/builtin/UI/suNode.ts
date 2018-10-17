import * as util from '../../utility';
import { SuObject } from '../../suobject';
import { SuValue } from '../../suvalue';
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
            let event: SuObject;
            if (e instanceof MouseEvent)
                event = new SuObject([], new Map<string, any>([
                    ['x', e.x],
                    ['y', e.y],
                    ['ctrlKey', e.ctrlKey],
                    ['altKey', e.altKey],
                    ['shiftKey', e.shiftKey]]));
            else if (e instanceof KeyboardEvent)
                event = new SuObject([], new Map<string, any>([
                    ['altKey', e.altKey],
                    ['ctrlKey', e.ctrlKey],
                    ['metaKey', e.metaKey],
                    ['shiftKey', e.shiftKey],
                    ['key', e.key],
                    ['code', e.code]]));
            else
                event = new SuObject();
            fn.$callNamed({ event: event });
            if (preventDefault)
                e.preventDefault();
        };
        this.el.addEventListener(event, listener);
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
    GetBoundingClientRect() {
        let rect = this.el.getBoundingClientRect();
        return new SuObject([], new Map<string, any>([
            ['left', Math.round(rect.left)],
            ['right', Math.round(rect.right)],
            ['top', Math.round(rect.top)],
            ['bottom', Math.round(rect.bottom)],
            ['width', Math.round(rect.width)],
            ['height', Math.round(rect.height)]]));
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
    GetDefault(key: any = mandatory(), def: any = mandatory()): any {
        maxargs(2, arguments.length);
        let val = this.get(key);
        if (val !== undefined)
            return val;
        return def;
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
(SuHtmlElMap.prototype['Member?'] as any).$params = 'key';
//GENERATED end

//BUILTIN SuHtmlElMap.GetDefault(key, value)
//GENERATED start
(SuHtmlElMap.prototype['GetDefault'] as any).$call = SuHtmlElMap.prototype['GetDefault'];
(SuHtmlElMap.prototype['GetDefault'] as any).$callNamed = function ($named: any, key: any, value: any) {
    maxargs(3, arguments.length);
    ({ key = key, value = value } = $named);
    return SuHtmlElMap.prototype['GetDefault'].call(this, key, value);
};
(SuHtmlElMap.prototype['GetDefault'] as any).$callAt = function (args: SuObject) {
    return (SuHtmlElMap.prototype['GetDefault'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuHtmlElMap.prototype['GetDefault'] as any).$params = 'key, value';
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
(SuNode.prototype['Window'] as any).$params = 'window';
//GENERATED end

//BUILTIN SuElement.GetBoundingClientRect()
//GENERATED start
(SuElement.prototype['GetBoundingClientRect'] as any).$call = SuElement.prototype['GetBoundingClientRect'];
(SuElement.prototype['GetBoundingClientRect'] as any).$callNamed = function (_named: any) {
    maxargs(1, arguments.length);
    return SuElement.prototype['GetBoundingClientRect'].call(this);
};
(SuElement.prototype['GetBoundingClientRect'] as any).$callAt = function (args: SuObject) {
    return (SuElement.prototype['GetBoundingClientRect'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuElement.prototype['GetBoundingClientRect'] as any).$params = '';
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
