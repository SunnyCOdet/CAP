"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
class Orchestrator {
    retriever;
    llm;
    ctx;
    constructor(retriever, llm, ctx) {
        this.retriever = retriever;
        this.llm = llm;
        this.ctx = ctx;
    }
    buildPrompt(userQuery, context, history) {
        const ctxBlock = context.length ? `# Context\n${context.map((c, i) => `[${i + 1}] ${c}`).join("\n")}` : "";
        const histBlock = history?.length ? `# Recent History\n${history.join("\n")}` : "";
        return `${ctxBlock}\n${histBlock}\n# Task\nRespond to the user query with accuracy and brevity.\nUser: ${userQuery}\nAssistant:`;
    }
    async run(input) {
        const t0 = Date.now();
        const retrieved = await this.retriever.retrieve({ sessionId: input.sessionId, query: input.userQuery, topK: input.topK ?? 5 });
        const historyItems = input.includeHistory ? this.ctx.history(input.sessionId, 8).map(it => it.content) : [];
        const prompt = this.buildPrompt(input.userQuery, retrieved.items.map(i => i.content), historyItems);
        const gen = await this.llm.generate(prompt, { temperature: 0.2, maxTokens: 800, system: "You are a helpful, precise assistant." });
        const latency = Date.now() - t0;
        return {
            answer: gen.text.trim(),
            contextUsed: retrieved,
            promptPreview: prompt.slice(0, 800),
            metadata: { latencyMs: latency, cacheHit: retrieved.source === "cache", tokens: gen.usage }
        };
    }
}
exports.Orchestrator = Orchestrator;
