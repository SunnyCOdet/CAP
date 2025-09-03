import { VectorAdapter, UUID } from "@cap/core";

function cosine(a: number[], b: number[]) {
  let dot=0, na=0, nb=0;
  for (let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

export class InMemoryVectorStore implements VectorAdapter {
  private data = new Map<UUID, { vector: number[]; content?: string; meta?: any }>();
  async upsert(items: Array<{ id: UUID; content: string; vector?: number[]; meta?: any }>): Promise<void> {
    for (const it of items) {
      if (!it.vector) throw new Error("vector required");
      this.data.set(it.id, { vector: it.vector, content: it.content, meta: it.meta });
    }
  }
  async query(vector: number[], topK: number, filter?: Record<string, any>) {
    const res: Array<{ id: UUID; score: number }> = [];
    for (const [id, v] of this.data.entries()) {
      if (filter && filter.sessionId && v.meta?.sessionId !== filter.sessionId) continue;
      res.push({ id, score: cosine(vector, v.vector) });
    }
    return res.sort((a,b)=>b.score-a.score).slice(0, topK);
  }
  async fetch(ids: UUID[]) {
    return ids.map(id => ({ id, content: this.data.get(id)?.content ?? "", meta: this.data.get(id)?.meta }));
  }
  async clearSession(sessionId: UUID) {
    for (const [id, v] of this.data.entries()) if (v.meta?.sessionId === sessionId) this.data.delete(id);
  }
}


