import { CacheAdapter, Embedder, LLMAdapter, OrchestrateOutput, UUID, VectorAdapter } from "./types";
import { ContextManager } from "./ContextManager";
import { Retriever } from "./Retriever";
import { Orchestrator } from "./Orchestrator";

export interface CAPConfig {
  vector: VectorAdapter;
  embedder: Embedder;
  cache?: CacheAdapter;
  llm: LLMAdapter;
}

export class CAPClient {
  private ctx = new ContextManager();
  private retriever: Retriever;
  private orchestrator: Orchestrator;

  constructor(private cfg: CAPConfig) {
    this.retriever = new Retriever(cfg.vector, cfg.embedder, cfg.cache);
    this.orchestrator = new Orchestrator(this.retriever, cfg.llm, this.ctx);
  }

  createSession(userId?: string, labels?: Record<string,string>) {
    return this.ctx.createSession(userId, labels);
  }

  getOrCreateSession(sessionId?: UUID, userId?: string) {
    return this.ctx.getOrCreateSession(sessionId, userId);
  }

  async store(sessionId: UUID, content: string, meta?: Record<string, any>) {
    const item = this.ctx.store(sessionId, content, meta);
    await this.retriever.index(sessionId, [{ id: item.id, content: item.content, meta }]);
    return item;
  }

  async retrieve(sessionId: UUID, query: string) {
    return this.retriever.retrieve({ sessionId, query, topK: 5 });
  }

  async orchestrate(sessionId: UUID, userQuery: string): Promise<OrchestrateOutput> {
    return this.orchestrator.run({ sessionId, userQuery, includeHistory: true, guardrails: true });
  }
}


