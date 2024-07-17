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
    private eventQueue: [Event, SuCallable][] = [];
    private isProcessingEvent: boolean = false;
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
            this.enqueueEvent(e, fn);
        };
        this.el.addEventListener(event, listner);
    }
    private enqueueEvent(event: Event, fn: SuCallable) {
        this.eventQueue.push([event, fn]);
        if (!this.isProcessingEvent) {
            this.processEventQueue();
        }
    }
    private async processEventQueue() {
        if (this.eventQueue.length === 0) {
            return;
        }

        this.isProcessingEvent = true;

        // Process events sequentially
        while (this.eventQueue.length > 0) {
            const eventOb = this.eventQueue.shift(); // Get the next event from the queue
            if (!!eventOb) {
                await this.parseEvent(eventOb[0]).then(event => eventOb[1].$callNamed({ event })); // Process the event
            }
        }
        this.isProcessingEvent = false;
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
                const buffer = new Uint8Array(await new Response(e.data).arrayBuffer());
                const decompressedBuffer = buffer.length > 0 && buffer[0] === 0xff /* Compressed. This value should not conflict with any existing Pack tags */
                    ? await this.decompress(buffer.slice(1))
                    : buffer;
                data = Pack.unpack(new ByteBuffer(decompressedBuffer));
            }
            return new SuObject([], new Map<string, any>([
                ['data', data]
            ]));
        }
        return new SuObject();
    }
    private async decompress(compressedBytes: Uint8Array) {
        const stream = new Blob([compressedBytes]).stream();
        const decompressedStream = stream.pipeThrough(new DecompressionStream("deflate"));
        const chunks = [];
        const reader = decompressedStream.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        return await this.concatUint8Arrays(chunks);
    }

    private async concatUint8Arrays(uint8arrays: Uint8Array[]) {
        const blob = new Blob(uint8arrays);
        const buffer = await blob.arrayBuffer();
        return new Uint8Array(buffer);
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
