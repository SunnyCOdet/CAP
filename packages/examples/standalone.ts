import { CAPClient } from "@contextawareprotocol/core";
import {
  InMemoryVectorStore,
  MemoryCache,
  OpenAIAdapter,
  OpenAIEmbedder,
  LocalEmbedder,
  LocalLLMAdapter
} from "@contextawareprotocol/adapters";

(async () => {
  const useOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const cap = new CAPClient({
    vector: new InMemoryVectorStore(),
    cache: new MemoryCache(),
    embedder: useOpenAI ? new OpenAIEmbedder() : new LocalEmbedder(),
    llm: useOpenAI ? new OpenAIAdapter() : new LocalLLMAdapter()
  });

  const s = cap.createSession("sunny");
  await cap.store(s.id, "MCP is a protocol to let models use tools safely.");
  await cap.store(s.id, "CAP adds RAG, caching, and session memory.");

  const res = await cap.orchestrate(s.id, "Explain MCP vs CAP in one paragraph.");
  console.log(res.answer);
})();

