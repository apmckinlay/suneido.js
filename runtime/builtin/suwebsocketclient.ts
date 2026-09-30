import * as util from '../utility';
import { SuCallable } from "../suvalue";
import { SuEl } from "./UI/suEl";
import { toStr } from '../ops';
import { mandatory, maxargs } from '../args';
import { SuObject } from '../suobject';
import { Pack } from '../pack';
import { ByteBuffer } from '../bytebuffer';
import { decompressSync } from 'fflate';

export class SuWebSocketClient extends SuEl {
    el: WebSocket;
    constructor(url: string) {
        super();
        this.el = new WebSocket(url);
        this.el.binaryType = 'arraybuffer';
    }
    type(): string {
        return 'WebSocket';
    }
    display(): string {
        return `${this.type()}(<${this.el.url}>)`;
    }
    SendPacked(_s: any = mandatory()) {
        maxargs(1, arguments.length);
        let s = toStr(_s);
        let buf = Pack.convertStringToBuffer(s);
        this.el.send(buf.buf);
    }
    AddEventListener(_event: any = mandatory(), fn: SuCallable = mandatory()) {
        maxargs(2, arguments.length);
        let event = toStr(_event);
        let listner = (e: Event) => {
            this.processEvent(e, fn);
        };
        this.el.addEventListener(event, listner);
    }
    private processEvent(event: Event, fn: SuCallable) {
        fn.$callNamed({ event: this.parseEvent(event) });
    }
    private parseEvent(e: Event): SuObject {
        if (e instanceof CloseEvent) {
            return new SuObject([], new Map<string, any>([
                ['code', e.code],
                ['reason', e.reason],
                ['wasClean', e.wasClean]
            ]));
        } else if (e instanceof MessageEvent) {
            let data = e.data;
            if (e.data instanceof ArrayBuffer) {
                const buffer = new Uint8Array(e.data);
                const decompressedBuffer = buffer.length > 0 && buffer[0] === 0xff /* Compressed. This value should not conflict with any existing Pack tags */
                    ? this.decompress(buffer.slice(1))
                    : buffer;
                data = Pack.unpack(new ByteBuffer(decompressedBuffer));
            }
            return new SuObject([], new Map<string, any>([
                ['data', data]
            ]));
        }
        return new SuObject();
    }
    private decompress(compressedBytes: Uint8Array<ArrayBuffer>) {
        return decompressSync(compressedBytes);
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
(su_webSocketClient as any).$callableType = "BUILTIN";
(su_webSocketClient as any).$callableName = "WebSocketClient";
(su_webSocketClient as any).$params = 'url';
//GENERATED end

//BUILTIN SuWebSocketClient.SendPacked(s)
//GENERATED start
(SuWebSocketClient.prototype['SendPacked'] as any).$call = SuWebSocketClient.prototype['SendPacked'];
(SuWebSocketClient.prototype['SendPacked'] as any).$callNamed = function ($named: any, s: any) {
    maxargs(2, arguments.length);
    ({ s = s } = $named);
    return SuWebSocketClient.prototype['SendPacked'].call(this, s);
};
(SuWebSocketClient.prototype['SendPacked'] as any).$callAt = function (args: SuObject) {
    return (SuWebSocketClient.prototype['SendPacked'] as any).$callNamed.call(this, util.mapToOb(args.map), ...args.vec);
};
(SuWebSocketClient.prototype['SendPacked'] as any).$callableType = "BUILTIN";
(SuWebSocketClient.prototype['SendPacked'] as any).$callableName = "SuWebSocketClient#SendPacked";
(SuWebSocketClient.prototype['SendPacked'] as any).$params = 's';
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
(SuWebSocketClient.prototype['AddEventListener'] as any).$callableType = "BUILTIN";
(SuWebSocketClient.prototype['AddEventListener'] as any).$callableName = "SuWebSocketClient#AddEventListener";
(SuWebSocketClient.prototype['AddEventListener'] as any).$params = 'event, fn';
//GENERATED end
