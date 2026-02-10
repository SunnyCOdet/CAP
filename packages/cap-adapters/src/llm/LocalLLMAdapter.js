"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalLLMAdapter = void 0;
class LocalLLMAdapter {
    name = "local-echo";
    async generate(prompt) {
        const match = prompt.match(/User:\s*([\s\S]*?)\nAssistant:/i);
        const userQuery = (match?.[1] ?? prompt).trim();
        return {
            text: `Local LLM (no API key configured). You asked: ${userQuery}`
        };
    }
}
exports.LocalLLMAdapter = LocalLLMAdapter;
