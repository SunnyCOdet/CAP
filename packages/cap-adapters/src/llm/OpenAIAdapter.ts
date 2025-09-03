import OpenAI from "openai";
import { LLMAdapter } from "@cap/core";

export class OpenAIAdapter implements LLMAdapter {
  public name = "openai-chat-completions";
  private client: OpenAI;
  private model: string;
  constructor(apiKey = process.env.OPENAI_API_KEY!, model = "gpt-4o-mini") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.name = `openai-${model}`;
  }
  async generate(prompt: string, opts?: { temperature?: number; maxTokens?: number; system?: string }) {
    const r = await this.client.chat.completions.create({
      model: this.model,
      temperature: opts?.temperature ?? 0.2,
      max_tokens: opts?.maxTokens ?? 800,
      messages: [
        opts?.system ? { role: "system", content: opts.system } : undefined,
        { role: "user", content: prompt }
      ].filter(Boolean) as any[]
    });
    const text = r.choices[0]?.message?.content || "";
    return { text, usage: r.usage };
  }
}


