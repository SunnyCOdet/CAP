"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIAdapter = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIAdapter {
    name = "openai-chat-completions";
    client;
    model;
    constructor(apiKey = process.env.OPENAI_API_KEY, model = "gpt-4o-mini") {
        this.client = new openai_1.default({ apiKey });
        this.model = model;
        this.name = `openai-${model}`;
    }
    async generate(prompt, opts) {
        const r = await this.client.chat.completions.create({
            model: this.model,
            temperature: opts?.temperature ?? 0.2,
            max_tokens: opts?.maxTokens ?? 800,
            messages: [
                opts?.system ? { role: "system", content: opts.system } : undefined,
                { role: "user", content: prompt }
            ].filter(Boolean)
        });
        const text = r.choices[0]?.message?.content || "";
        return { text, usage: r.usage };
    }
}
exports.OpenAIAdapter = OpenAIAdapter;
