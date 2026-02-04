import { CAPClient } from "@contextawareprotocol/core";
import { InMemoryVectorStore, MemoryCache } from "@contextawareprotocol/adapters";
import { createExampleAdapters } from "./localAdapters";

(async () => {
  const { embedder, llm, usingOpenAI } = createExampleAdapters();
  if (!usingOpenAI) {
    console.warn("OPENAI_API_KEY not set; using local fallback adapters.");
  }
  const cap = new CAPClient({
    vector: new InMemoryVectorStore(),
    cache: new MemoryCache(),
    embedder,
    llm
  });

  const s = cap.createSession("sunny");
  await cap.store(s.id, "MCP is a protocol to let models use tools safely.");
  await cap.store(s.id, "CAP adds RAG, caching, and session memory.");

  const res = await cap.orchestrate(s.id, "Explain MCP vs CAP in one paragraph.");
  console.log(res.answer);
})();

