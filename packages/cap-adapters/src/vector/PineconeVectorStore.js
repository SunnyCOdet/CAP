"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PineconeVectorStore = void 0;
// Implement with official Pinecone client if desired.
class PineconeVectorStore {
    constructor( /* pinecone client, index name */) { }
    async upsert(_) { throw new Error("Not implemented"); }
    async query(_, __, ___) { throw new Error("Not implemented"); }
    async fetch(_) { throw new Error("Not implemented"); }
    async clearSession(_) { throw new Error("Not implemented"); }
}
exports.PineconeVectorStore = PineconeVectorStore;
