import { Embedder, LLMAdapter } from "@contextawareprotocol/core";
import { OpenAIAdapter, OpenAIEmbedder } from "@contextawareprotocol/adapters";

const FALLBACK_DIM = 16;

const hashText = (text: string) => {
  const vec = new Array(FALLBACK_DIM).fill(0);
  if (!text.length) return vec;
  for (let i = 0; i < text.length; i += 1) {
    vec[i % FALLBACK_DIM] += text.charCodeAt(i);
  }
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => v / norm);
};

class LocalEmbedder implements Embedder {
  name = "local-hash-embedder";
  dim = FALLBACK_DIM;
  async embed(texts: string[]) {
    return texts.map(hashText);
  }
}

class LocalLLMAdapter implements LLMAdapter {
  name = "local-echo-llm";
  async generate(prompt: string) {
    return {
      text: `Local LLM fallback (set OPENAI_API_KEY to enable OpenAI):\n${prompt}`
    };
  }
}

export const createExampleAdapters = (): { embedder: Embedder; llm: LLMAdapter; usingOpenAI: boolean } => {
  if (process.env.OPENAI_API_KEY) {
    return {
      embedder: new OpenAIEmbedder(),
      llm: new OpenAIAdapter(),
      usingOpenAI: true
    };
  }

  return {
    embedder: new LocalEmbedder(),
    llm: new LocalLLMAdapter(),
    usingOpenAI: false
  };
};
