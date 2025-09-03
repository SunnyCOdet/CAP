"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryVectorStore = void 0;
function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}
class InMemoryVectorStore {
    data = new Map();
    async upsert(items) {
        for (const it of items) {
            if (!it.vector)
                throw new Error("vector required");
            this.data.set(it.id, { vector: it.vector, content: it.content, meta: it.meta });
        }
    }
    async query(vector, topK, filter) {
        const res = [];
        for (const [id, v] of this.data.entries()) {
            if (filter && filter.sessionId && v.meta?.sessionId !== filter.sessionId)
                continue;
            res.push({ id, score: cosine(vector, v.vector) });
        }
        return res.sort((a, b) => b.score - a.score).slice(0, topK);
    }
    async fetch(ids) {
        return ids.map(id => ({ id, content: this.data.get(id)?.content ?? "", meta: this.data.get(id)?.meta }));
    }
    async clearSession(sessionId) {
        for (const [id, v] of this.data.entries())
            if (v.meta?.sessionId === sessionId)
                this.data.delete(id);
    }
}
exports.InMemoryVectorStore = InMemoryVectorStore;
