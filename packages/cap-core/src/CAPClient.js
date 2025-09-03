"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAPClient = void 0;
const ContextManager_1 = require("./ContextManager");
const Retriever_1 = require("./Retriever");
const Orchestrator_1 = require("./Orchestrator");
class CAPClient {
    cfg;
    ctx = new ContextManager_1.ContextManager();
    retriever;
    orchestrator;
    constructor(cfg) {
        this.cfg = cfg;
        this.retriever = new Retriever_1.Retriever(cfg.vector, cfg.embedder, cfg.cache);
        this.orchestrator = new Orchestrator_1.Orchestrator(this.retriever, cfg.llm, this.ctx);
    }
    createSession(userId, labels) {
        return this.ctx.createSession(userId, labels);
    }
    getOrCreateSession(sessionId, userId) {
        return this.ctx.getOrCreateSession(sessionId, userId);
    }
    async store(sessionId, content, meta) {
        const item = this.ctx.store(sessionId, content, meta);
        await this.retriever.index(sessionId, [{ id: item.id, content: item.content, meta }]);
        return item;
    }
    async retrieve(sessionId, query) {
        return this.retriever.retrieve({ sessionId, query, topK: 5 });
    }
    async orchestrate(sessionId, userQuery) {
        return this.orchestrator.run({ sessionId, userQuery, includeHistory: true, guardrails: true });
    }
}
exports.CAPClient = CAPClient;
