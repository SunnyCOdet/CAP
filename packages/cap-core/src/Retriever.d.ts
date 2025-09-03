import { CacheAdapter, Embedder, RetrievedContext, RetrieveQuery, VectorAdapter } from "./types";
export declare class Retriever {
    private vector;
    private embedder;
    private cache?;
    constructor(vector: VectorAdapter, embedder: Embedder, cache?: CacheAdapter | undefined);
    index(sessionId: string, docs: Array<{
        id: string;
        content: string;
        meta?: any;
    }>): Promise<void>;
    retrieve(q: RetrieveQuery): Promise<RetrievedContext>;
}
