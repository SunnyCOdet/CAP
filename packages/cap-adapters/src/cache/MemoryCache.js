"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCache = void 0;
class MemoryCache {
    store = new Map();
    async get(key) {
        const e = this.store.get(key);
        if (!e)
            return undefined;
        if (e.exp && Date.now() > e.exp) {
            this.store.delete(key);
            return undefined;
        }
        return e.v;
    }
    async set(key, value, ttlSec) {
        const exp = ttlSec ? Date.now() + ttlSec * 1000 : undefined;
        this.store.set(key, { v: value, exp });
    }
    async del(key) { this.store.delete(key); }
}
exports.MemoryCache = MemoryCache;
