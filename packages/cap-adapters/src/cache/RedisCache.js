"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisCache {
    client;
    constructor(client = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379")) {
        this.client = client;
    }
    async get(key) {
        const val = await this.client.get(key);
        return val ? JSON.parse(val) : undefined;
    }
    async set(key, value, ttlSec) {
        const v = JSON.stringify(value);
        if (ttlSec)
            await this.client.set(key, v, "EX", ttlSec);
        else
            await this.client.set(key, v);
    }
    async del(key) { await this.client.del(key); }
}
exports.RedisCache = RedisCache;
