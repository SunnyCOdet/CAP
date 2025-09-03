"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIEmbedder = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIEmbedder {
    name = "openai-text-embedding-3-small";
    dim = 1536;
    client;
    model;
    constructor(apiKey = process.env.OPENAI_API_KEY, model = "text-embedding-3-small") {
        this.client = new openai_1.default({ apiKey });
        this.model = model;
        this.name = `openai-${model}`;
    }
    async embed(texts) {
        const res = await this.client.embeddings.create({ input: texts, model: this.model });
        return res.data.map(d => d.embedding);
    }
}
exports.OpenAIEmbedder = OpenAIEmbedder;
