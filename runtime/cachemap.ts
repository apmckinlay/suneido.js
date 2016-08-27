// used by tr

class Slot<Key, Data> {
    constructor(public lru: number, public key: Key, public data: Data) {
    }
}

export class CacheMap<Key, Data> {
    private slots: Slot<Key, Data>[];
    private clock: number;

    constructor(private n: number, private func: (k: Key) => Data) {
        this.clock = 0;
        this.slots = [];
    }

    /** get or calculate data */
    get(key: Key): Data {
        let lru = 0;
        // single pass both searches and finds lru
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].key === key) {
                this.slots[i].lru = this.clock++;
                return this.slots[i].data;
            }
            if (this.slots[i].lru < this.slots[lru].lru)
                lru = i;
        }
        if (this.slots.length < this.n)
            lru = this.slots.length;
        let data = this.func(key);
        this.slots[lru] = new Slot(this.clock++, key, data);
        return data;
    }
}
