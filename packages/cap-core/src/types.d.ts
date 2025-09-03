export type UUID = string;
export interface Session {
    id: UUID;
    userId?: string;
    createdAt: number;
    updatedAt: number;
    labels?: Record<string, string>;
}
export interface StoredItem {
    id: UUID;
    sessionId: UUID;
    content: string;
    meta?: Record<string, any>;
    createdAt: number;
}
export interface RetrieveQuery {
    sessionId: UUID;
    query: string;
    topK?: number;
    filters?: Record<string, any>;
}
export interface RetrievedContext {
    items: Array<{
        id: UUID;
        content: string;
        score: number;
        meta?: any;
    }>;
    source: "cache" | "vector" | "mixed" | "empty";
}
export interface CacheAdapter {
    get<T = any>(key: string): Promise<T | undefined>;
    set<T = any>(key: string, value: T, ttlSec?: number): Promise<void>;
    del(key: string): Promise<void>;
}
export interface VectorAdapter {
    upsert(items: Array<{
        id: UUID;
        content: string;
        vector?: number[];
        meta?: any;
    }>): Promise<void>;
    query(vector: number[], topK: number, filter?: Record<string, any>): Promise<Array<{
        id: UUID;
        score: number;
        content?: string;
        meta?: any;
    }>>;
    fetch(ids: UUID[]): Promise<Array<{
        id: UUID;
        content: string;
        meta?: any;
    }>>;
    clearSession(sessionId: UUID): Promise<void>;
}
export interface Embedder {
    embed(texts: string[]): Promise<number[][]>;
    name: string;
    dim: number;
}
export interface LLMAdapter {
    generate(prompt: string, opts?: {
        temperature?: number;
        maxTokens?: number;
        system?: string;
    }): Promise<{
        text: string;
        usage?: any;
    }>;
    name: string;
}
export interface OrchestrateInput {
    sessionId: UUID;
    userQuery: string;
    topK?: number;
    includeHistory?: boolean;
    guardrails?: boolean;
}
export interface OrchestrateOutput {
    answer: string;
    contextUsed: RetrievedContext;
    promptPreview?: string;
    metadata: {
        latencyMs: number;
        cacheHit: boolean;
        tokens?: any;
    };
}
