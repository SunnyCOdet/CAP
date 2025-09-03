import { CacheAdapter } from "./types";

export class NamespacedCache implements CacheAdapter {
  constructor(private base: CacheAdapter, private ns: string) {}
  key(k: string) { return `${this.ns}:${k}`; }
  async get<T>(key: string) { return this.base.get<T>(this.key(key)); }
  async set<T>(key: string, val: T, ttl?: number) { return this.base.set<T>(this.key(key), val, ttl); }
  async del(key: string) { return this.base.del(this.key(key)); }
}


