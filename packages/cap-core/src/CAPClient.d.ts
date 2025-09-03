import { CacheAdapter, Embedder, LLMAdapter, OrchestrateOutput, UUID, VectorAdapter } from "./types";
export interface CAPConfig {
    vector: VectorAdapter;
    embedder: Embedder;
    cache?: CacheAdapter;
    llm: LLMAdapter;
}
export declare class CAPClient {
    private cfg;
    private ctx;
    private retriever;
    private orchestrator;
    constructor(cfg: CAPConfig);
    createSession(userId?: string, labels?: Record<string, string>): import("./types").Session;
    getOrCreateSession(sessionId?: UUID, userId?: string): import("./types").Session;
    store(sessionId: UUID, content: string, meta?: Record<string, any>): Promise<import("./types").StoredItem>;
    retrieve(sessionId: UUID, query: string): Promise<import("./types").RetrievedContext>;
    orchestrate(sessionId: UUID, userQuery: string): Promise<OrchestrateOutput>;
}
