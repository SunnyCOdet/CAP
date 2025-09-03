import { CacheAdapter } from "./types";
export declare class NamespacedCache implements CacheAdapter {
    private base;
    private ns;
    constructor(base: CacheAdapter, ns: string);
    key(k: string): string;
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, val: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
}
