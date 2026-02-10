import { LLMAdapter } from "@contextawareprotocol/core";

export class LocalLLMAdapter implements LLMAdapter {
  name = "local-echo";

  async generate(prompt: string): Promise<{ text: string; usage?: any }> {
    const match = prompt.match(/User:\s*([\s\S]*?)\nAssistant:/i);
    const userQuery = (match?.[1] ?? prompt).trim();
    return {
      text: `Local LLM (no API key configured). You asked: ${userQuery}`
    };
  }
}
