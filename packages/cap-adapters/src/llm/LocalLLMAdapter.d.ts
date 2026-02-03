import { LLMAdapter } from "@contextawareprotocol/core";
export declare class LocalLLMAdapter implements LLMAdapter {
    name: string;
    generate(prompt: string): Promise<{
        text: string;
        usage?: any;
    }>;
}
