import { VectorAdapter, UUID } from "@cap/core";
export declare class PineconeVectorStore implements VectorAdapter {
    constructor();
    upsert(_: Array<{
        id: UUID;
        content: string;
        vector?: number[];
        meta?: any;
    }>): Promise<void>;
    query(_: number[], __: number, ___?: Record<string, any>): Promise<void>;
    fetch(_: UUID[]): Promise<void>;
    clearSession(_: UUID): Promise<void>;
}
