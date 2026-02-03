"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalEmbedder = void 0;
class LocalEmbedder {
    name = "local-hash-embedder";
    dim = 128;
    async embed(texts) {
        return texts.map(text => {
            const vec = new Array(this.dim).fill(0);
            for (let i = 0; i < text.length; i += 1) {
                vec[i % this.dim] += text.charCodeAt(i);
            }
            const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
            return vec.map(v => v / norm);
        });
    }
}
exports.LocalEmbedder = LocalEmbedder;
