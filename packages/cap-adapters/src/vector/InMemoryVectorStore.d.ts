import { VectorAdapter, UUID } from "@cap/core";
export declare class InMemoryVectorStore implements VectorAdapter {
    private data;
    upsert(items: Array<{
        id: UUID;
        content: string;
        vector?: number[];
        meta?: any;
    }>): Promise<void>;
    query(vector: number[], topK: number, filter?: Record<string, any>): Promise<{
        id: UUID;
        score: number;
    }[]>;
    fetch(ids: UUID[]): Promise<{
        id: string;
        content: string;
        meta: any;
    }[]>;
    clearSession(sessionId: UUID): Promise<void>;
}
