"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retriever = void 0;
class Retriever {
    vector;
    embedder;
    cache;
    constructor(vector, embedder, cache) {
        this.vector = vector;
        this.embedder = embedder;
        this.cache = cache;
    }
    async index(sessionId, docs) {
        const vectors = await this.embedder.embed(docs.map(d => d.content));
        await this.vector.upsert(docs.map((d, i) => ({ id: d.id, content: d.content, vector: vectors[i], meta: { ...(d.meta || {}), sessionId } })));
    }
    async retrieve(q) {
        const key = `rc:${q.sessionId}:${this.embedder.name}:${Buffer.from(q.query).toString("base64")}`;
        if (this.cache) {
            const cached = await this.cache.get(key);
            if (cached)
                return { ...cached, source: "cache" };
        }
        const [qv] = await this.embedder.embed([q.query]);
        const hits = await this.vector.query(qv, q.topK ?? 5, { sessionId: q.sessionId, ...(q.filters || {}) });
        const fetched = await this.vector.fetch(hits.map(h => h.id));
        const items = hits.map(h => {
            const f = fetched.find(x => x.id === h.id);
            return { id: h.id, content: f?.content ?? "", score: h.score, meta: f?.meta };
        });
        const result = { items, source: "vector" };
        if (this.cache)
            await this.cache.set(key, result, 60);
        return result;
    }
}
exports.Retriever = Retriever;
