import * as util from '../utility';
import { SuCallable } from "../suvalue";
import { SuEl } from "./UI/suEl";
import { toStr } from '../ops';
import { mandatory, maxargs } from '../args';
import { SuObject } from '../suobject';
import { Pack } from '../pack';
import { ByteBuffer } from '../bytebuffer';

export class SuWebSocketClient extends SuEl {
    el: WebSocket;
    constructor(url: string) {
        super();
        this.el = new WebSocket(url);
    }
    type(): string {
        return 'WebSocket';
    }
    display(): string {
        return `${this.type()}(<${this.el.url}>)`;
    }
    Send(_s: any = mandatory()) {
        maxargs(1, arguments.length);
        let s = toStr(_s);
        let buf = Pack.convertStringToBuffer(s);
        this.el.send(buf.buf);
    }
    AddEventListener(_event: any = mandatory(), fn: SuCallable = mandatory()) {
        maxargs(2, arguments.length);
        let event = toStr(_event);
        let listner = (e: Event) => {
            this.parseEvent(e).then(event => fn.$callNamed({ event }));
        };
        this.el.addEventListener(event, listner);
    }
    private async parseEvent(e: Event): Promise<SuObject> {
        if (e instanceof CloseEvent) {
            return new SuObject([], new Map<string, any>([
                ['code', e.code],
                ['reason', e.reason],
                ['wasClean', e.wasClean]
            ]));
        } else if (e instanceof MessageEvent) {
            let data = e.data;
            if (e.data instanceof Blob) {
                const buffer = await new Response(e.data).arrayBuffer();
                data = Pack.unpack(new ByteBuffer(new Uint8Array(buffer)));
            }
            return new SuObject([], new Map<string, any>([
                ['data', data]
            ]));
        }
        return new SuObject();
    }
}

export function su_webSocketClient(_url: any): SuWebSocketClient {
    maxargs(1, arguments.length);
    const url = toStr(_url);
    return new SuWebSocketClient(url);
}

//BUILTIN WebSocketClient(url)
//GENERATED start
(su_webSocketClient as any).$call = su_webSocketClient;
(su_webSocketClient as any).$callNamed = function ($named: any, url: any) {
    maxargs(2, arguments.length);
    ({ url = url } = $named);
    return su_webSocketClient(url);
};
(su_webSocketClient as any).$callAt = function (args: SuObject) {
    return (su_webSocketClient as any).$callNamed(util.mapToOb(args.map), ...args.vec);
};
(su_webSocketClient as any).$params = 'url';
//GENERATED end

//BUILTIN SuWebSocketClient.Send(s)
//GENERATED start
(SuWebSocketClient.prototype['Send'] as any).$call = SuWebSocketClient.prototype['Send'];
(SuWebSocketClient.prototype['Send'] as any).$callNamed = function ($named: any, s: any) {
    maxargs(2, arguments.length);
    ({ s = s } = $named);
    return SuWebSocketClient.prototype['Send'].call(this, s);
};
(SuWebSocketClient.prototype['Send'] as any).$callAt = function (args: SuObject) {
    return (SuWebSocketClient.prototype['Send'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuWebSocketClient.prototype['Send'] as any).$params = 's';
//GENERATED end

//BUILTIN SuWebSocketClient.AddEventListener(event, fn)
//GENERATED start
(SuWebSocketClient.prototype['AddEventListener'] as any).$call = SuWebSocketClient.prototype['AddEventListener'];
(SuWebSocketClient.prototype['AddEventListener'] as any).$callNamed = function ($named: any, event: any, fn: any) {
    maxargs(3, arguments.length);
    ({ event = event, fn = fn } = $named);
    return SuWebSocketClient.prototype['AddEventListener'].call(this, event, fn);
};
(SuWebSocketClient.prototype['AddEventListener'] as any).$callAt = function (args: SuObject) {
    return (SuWebSocketClient.prototype['AddEventListener'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuWebSocketClient.prototype['AddEventListener'] as any).$params = 'event, fn';
//GENERATED end
