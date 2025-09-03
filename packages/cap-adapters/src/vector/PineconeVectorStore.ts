import { VectorAdapter, UUID } from "@cap/core";

// Implement with official Pinecone client if desired.
export class PineconeVectorStore implements VectorAdapter {
  constructor(/* pinecone client, index name */) {}
  async upsert(_: Array<{ id: UUID; content: string; vector?: number[]; meta?: any }>): Promise<void> { throw new Error("Not implemented"); }
  async query(_: number[], __: number, ___?: Record<string, any>): Promise<Array<{ id: UUID; score: number; content?: string; meta?: any }>> { throw new Error("Not implemented"); }
  async fetch(_: UUID[]): Promise<Array<{ id: UUID; content: string; meta?: any }>> { throw new Error("Not implemented"); }
  async clearSession(_: UUID): Promise<void> { throw new Error("Not implemented"); }
}


