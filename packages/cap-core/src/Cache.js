"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespacedCache = void 0;
class NamespacedCache {
    base;
    ns;
    constructor(base, ns) {
        this.base = base;
        this.ns = ns;
    }
    key(k) { return `${this.ns}:${k}`; }
    async get(key) { return this.base.get(this.key(key)); }
    async set(key, val, ttl) { return this.base.set(this.key(key), val, ttl); }
    async del(key) { return this.base.del(this.key(key)); }
}
exports.NamespacedCache = NamespacedCache;
