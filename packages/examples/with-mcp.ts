import { CAPClient } from "@contextawareprotocol/core";
import {
  InMemoryVectorStore,
  MemoryCache,
  OpenAIAdapter,
  OpenAIEmbedder,
  LocalEmbedder,
  LocalLLMAdapter
} from "@contextawareprotocol/adapters";
import { MCPBridge } from "@contextawareprotocol/bridge-mcp";

// Hypothetical MCP host app; replace with your MCP server framework wiring.
class FakeMCPHost {
  private handlers = new Map<string, Function>();
  register(method: string, fn: Function) { this.handlers.set(method, fn); }
  async call(method: string, params: any) { const fn = this.handlers.get(method)!; return fn(params); }
}

(async () => {
  const useOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const cap = new CAPClient({
    vector: new InMemoryVectorStore(),
    cache: new MemoryCache(),
    embedder: useOpenAI ? new OpenAIEmbedder() : new LocalEmbedder(),
    llm: useOpenAI ? new OpenAIAdapter() : new LocalLLMAdapter()
  });

  const bridge = new MCPBridge(cap);
  const mcp = new FakeMCPHost();

  mcp.register("cap.create_session", bridge.create_session.bind(bridge));
  mcp.register("cap.store", bridge.store.bind(bridge));
  mcp.register("cap.retrieve", bridge.retrieve.bind(bridge));
  mcp.register("cap.orchestrate", bridge.orchestrate.bind(bridge));

  const s = await mcp.call("cap.create_session", { user_id: "sunny" });
  await mcp.call("cap.store", { session_id: s.session_id, content: "MCP is tool protocol." });
  await mcp.call("cap.store", { session_id: s.session_id, content: "CAP = context layer with RAG + cache." });
  const out = await mcp.call("cap.orchestrate", { session_id: s.session_id, query: "contrast mcp and cap" });
  console.log(out.answer);
})();

