import { CacheAdapter } from "@cap/core";
export declare class MemoryCache implements CacheAdapter {
    private store;
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttlSec?: number): Promise<void>;
    del(key: string): Promise<void>;
}
