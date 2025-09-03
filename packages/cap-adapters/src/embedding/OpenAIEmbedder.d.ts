import { Embedder } from "@cap/core";
export declare class OpenAIEmbedder implements Embedder {
    name: string;
    dim: number;
    private client;
    private model;
    constructor(apiKey?: string, model?: string);
    embed(texts: string[]): Promise<number[][]>;
}
