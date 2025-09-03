import { CacheAdapter } from "@contextawareprotocol/core";
import Redis from "ioredis";

export class RedisCache implements CacheAdapter {
  constructor(private client = new Redis(process.env.REDIS_URL || "redis://localhost:6379")) {}
  async get<T>(key: string): Promise<T | undefined> {
    const val = await this.client.get(key);
    return val ? JSON.parse(val) as T : undefined;
  }
  async set<T>(key: string, value: T, ttlSec?: number) {
    const v = JSON.stringify(value);
    if (ttlSec) await this.client.set(key, v, "EX", ttlSec);
    else await this.client.set(key, v);
  }
  async del(key: string) { await this.client.del(key); }
}


