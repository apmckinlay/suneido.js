class Slot<Key, Data> {
    constructor(
        public lru: number = null,
        public key: Key = null,
        public data: Data = null) { }
}

export default class CacheMap<Key, Data> {
    constructor(n: number) {
        this.next = 0;
        this.clock = 0;
        this.n = n;
        this.slots = [];
    }
    put(key: Key, data: Data): Data {
        var lru: number = 0,
            i: number;

        if (this.next < this.n) {
            this.slots[this.next++] = new Slot(this.clock++, key, data);
            return data;
        }
        for (i = 0; i < this.next; i++)
            if (this.slots[i].lru < this.slots[lru].lru)
                lru = i;
        this.slots[lru] = new Slot(this.clock++, key, data);
        return data;
    }
    get(key: Key): Data {
        for (var i = 0; i < this.next; i++)
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
