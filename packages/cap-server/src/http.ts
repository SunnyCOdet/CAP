import Fastify from "fastify";
import { config } from "./config";
import { CAPClient } from "@contextawareprotocol/core";
import { InMemoryVectorStore, MemoryCache, OpenAIAdapter, OpenAIEmbedder } from "@contextawareprotocol/adapters";

const server = Fastify({ logger: true });

const cap = new CAPClient({
  vector: new InMemoryVectorStore(),
  cache: new MemoryCache(),
  embedder: new OpenAIEmbedder(),         // requires OPENAI_API_KEY
  llm: new OpenAIAdapter()                // requires OPENAI_API_KEY
});

// Standalone CAP endpoints (no MCP required)
server.post("/cap/create_session", async (req, reply) => {
  const body = (req.body as any) || {};
  const s = cap.createSession(body.userId, body.labels);
  return reply.send({ sessionId: s.id, createdAt: s.createdAt });
});

server.post("/cap/store", async (req, reply) => {
  const { sessionId, content, meta } = (req.body as any);
  const item = await cap.store(sessionId, content, meta);
  return reply.send({ id: item.id, createdAt: item.createdAt });
});

server.post("/cap/retrieve", async (req, reply) => {
  const { sessionId, query } = (req.body as any);
  const ctx = await cap.retrieve(sessionId, query);
  return reply.send(ctx);
});

server.post("/cap/orchestrate", async (req, reply) => {
  const { sessionId, query } = (req.body as any);
  const out = await cap.orchestrate(sessionId, query);
  return reply.send(out);
});

server.listen({ port: config.app.port, host: process.env.APP_HOST || "0.0.0.0" })
  .then(addr => server.log.info(`CAP server listening on ${addr}`))
  .catch(err => { server.log.error(err); process.exit(1); });


