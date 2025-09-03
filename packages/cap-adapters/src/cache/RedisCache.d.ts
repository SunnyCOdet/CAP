import { CacheAdapter } from "@cap/core";
import Redis from "ioredis";
export declare class RedisCache implements CacheAdapter {
    private client;
    constructor(client?: Redis);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttlSec?: number): Promise<void>;
    del(key: string): Promise<void>;
}
