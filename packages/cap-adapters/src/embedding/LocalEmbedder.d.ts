import { Embedder } from "@contextawareprotocol/core";
export declare class LocalEmbedder implements Embedder {
    name: string;
    dim: number;
    embed(texts: string[]): Promise<number[][]>;
}
