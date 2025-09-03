import OpenAI from "openai";
import { LLMAdapter } from "@cap/core";
export declare class OpenAIAdapter implements LLMAdapter {
    name: string;
    private client;
    private model;
    constructor(apiKey?: string, model?: string);
    generate(prompt: string, opts?: {
        temperature?: number;
        maxTokens?: number;
        system?: string;
    }): Promise<{
        text: string;
        usage: OpenAI.Completions.CompletionUsage | undefined;
    }>;
}
