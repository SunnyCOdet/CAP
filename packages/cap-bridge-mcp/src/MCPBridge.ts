import { CAPClient } from "@cap/core";

// Minimal JSON-RPC handler to act as an MCP tool.
// Plug this into your MCP server framework's tool registration.
export class MCPBridge {
  constructor(private cap: CAPClient) {}

  // JSON-RPC: cap.create_session
  async create_session(params: { user_id?: string }) {
    const s = this.cap.createSession(params.user_id);
    return { session_id: s.id, status: "created" };
  }

  // JSON-RPC: cap.store
  async store(params: { session_id: string; content: string; meta?: any }) {
    await this.cap.store(params.session_id, params.content, params.meta);
    return { status: "stored" };
  }

  // JSON-RPC: cap.retrieve
  async retrieve(params: { session_id: string; query: string; top_k?: number }) {
    const res = await this.cap.retrieve(params.session_id, params.query);
    return { context: res.items, source: res.source };
  }

  // JSON-RPC: cap.orchestrate
  async orchestrate(params: { session_id: string; query: string }) {
    const out = await this.cap.orchestrate(params.session_id, params.query);
    return {
      answer: out.answer,
      context_used: out.contextUsed.items,
      metadata: out.metadata
    };
  }
}


