// used by tr

class Slot<Key, Data> {
    constructor(public lru: number, public key: Key, public data: Data) {
    }
}

export class CacheMap<Key, Data> {
    constructor(n: number) {
        this.next = 0;
        this.clock = 0;
        this.n = n;
        this.slots = [];
    }
    put(key: Key, data: Data): Data {
        let slot: number;
        if (this.next < this.n) {
            slot = this.next++;
        } else {
            slot = 0;
            for (let i = 0; i < this.next; i++)
                if (this.slots[i].lru < this.slots[slot].lru)
                    slot = i;
        }
        this.slots[slot] = new Slot(this.clock++, key, data);
        return data;
    }
    get(key: Key): Data | null {
        for (let i = 0; i < this.next; i++)
            if (this.slots[i].key === key) {
                this.slots[i].lru = this.clock++;
                return this.slots[i].data;
            }
        return null;
    }

    private next: number;
    private clock: number;
    private n: number;
    private slots: Slot<Key, Data>[];
}
