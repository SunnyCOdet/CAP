import { Embedder } from "@contextawareprotocol/core";
import OpenAI from "openai";

export class OpenAIEmbedder implements Embedder {
  public name = "openai-text-embedding-3-small";
  public dim = 1536;
  private client: OpenAI;
  private model: string;
  constructor(apiKey = process.env.OPENAI_API_KEY!, model = "text-embedding-3-small") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.name = `openai-${model}`;
  }
  async embed(texts: string[]): Promise<number[][]> {
    const res = await this.client.embeddings.create({ input: texts, model: this.model });
    return res.data.map(d => d.embedding as number[]);
  }
}


