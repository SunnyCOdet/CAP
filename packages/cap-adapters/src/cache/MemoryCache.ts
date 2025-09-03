import { CacheAdapter } from "@cap/core";

export class MemoryCache implements CacheAdapter {
  private store = new Map<string, { v: any; exp?: number }>();
  async get<T>(key: string): Promise<T | undefined> {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (e.exp && Date.now() > e.exp) { this.store.delete(key); return undefined; }
    return e.v as T;
  }
  async set<T>(key: string, value: T, ttlSec?: number) {
    const exp = ttlSec ? Date.now() + ttlSec * 1000 : undefined;
    this.store.set(key, { v: value, exp });
  }
  async del(key: string) { this.store.delete(key); }
}


