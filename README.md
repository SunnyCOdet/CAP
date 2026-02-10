## CAP (Context‑Aware Protocol)

### What is CAP?
CAP is a modular context layer for AI agents and applications. It accepts input from MCP tools or direct APIs, gathers and fuses relevant context (session memory, vector RAG, caches, and external data), applies governance (security, redaction, compliance), and delivers a clean, ranked, policy‑compliant “context package” to the downstream LLM.

### Why CAP matters (benefits & advantages)
- **Richer context, better answers**: Combines short‑term conversation history, long‑term vector memory, and external sources for higher quality responses.
- **Lower latency and cost**: Hot cache (Redis/memory) and relevance ranking reduce embedding/LLM calls and tokens.
- **Policy & governance built‑in**: Redaction hooks prevent sensitive data leakage; auditability improves trust and compliance.
- **Pluggable everywhere**: Works with MCP, REST, or as a library in your app; adapters for OpenAI, Redis, Pinecone, etc.
- **Separation of concerns**: Keep context assembly out of your business logic and prompt code.
- **Future‑proof**: Swap vector DBs/LLMs/embedders without changing client code via interfaces.

## Monorepo Structure
- `packages/cap-core` — Core types and orchestration: `CAPClient`, `ContextManager`, `Retriever`, `Orchestrator`, `Policy`.
- `packages/cap-adapters` — Adapters for cache (Memory/Redis), vector (In‑Memory, Pinecone stub), LLM (OpenAI), embeddings (OpenAI).
- `packages/cap-bridge-mcp` — Minimal MCP bridge exposing CAP as MCP tools.
- `packages/cap-server` — Fastify HTTP server exposing CAP as REST.
- `packages/examples` — Standalone usage and MCP bridge example.

## Architecture (high‑level)
- **Input Layer**: MCP or REST receives `session_id`, query, metadata.
- **Context Manager**: Session memory, cache, vector store connectors.
- **Reasoning Layer**: Fetch, rank, and fuse context (RAG + history + external).
- **Policy & Governance**: Redaction, access control, audit/logging hooks.
- **Output Layer**: Returns a structured JSON context package or a final LLM answer.

## Quickstart
### Install & Build
```bash
npm i
npm run build
```

### Environment
- On PowerShell (current session):
```powershell
$env:OPENAI_API_KEY = "<your_key>"
```
- On macOS/Linux:
```bash
export OPENAI_API_KEY="<your_key>"
```
If you skip the API key, the server and examples fall back to local hash embeddings and a simple echo LLM so you can still run the workflow end-to-end.

### Run the standalone example
```bash
npm run start:standalone
```

### Run the HTTP server (no MCP required)
```bash
npm run start:server
# Endpoints:
# POST http://localhost:3000/cap/create_session
# POST http://localhost:3000/cap/store
# POST http://localhost:3000/cap/retrieve
# POST http://localhost:3000/cap/orchestrate
```

### Docker
Build and run with Docker:
```bash
docker build -t cap-server .
docker run --rm -p 3000:3000 -e OPENAI_API_KEY=$OPENAI_API_KEY cap-server
```

Run with Redis via docker-compose:
```bash
OPENAI_API_KEY=$OPENAI_API_KEY docker compose up --build
# Server: http://localhost:3000
# Redis:  localhost:6379
```

Notes:
- The image uses Node 18 Alpine, builds the monorepo in a multi‑stage Dockerfile, and starts the Fastify server.
- Configure via environment variables (see Configuration below). `APP_PORT=3000` by default.

## Configuration (dotenv)
CAP Server reads configuration from environment variables (see `packages/cap-server/src/config.ts`). Create a `.env` at the repo root or set env vars in your runtime.

- **App**: `APP_ENV`, `APP_PORT`, `APP_LOG_LEVEL`, `CAP_INSTANCE_ID`, `CAP_DEFAULT_SESSION_TTL`
- **MCP**: `MCP_ENABLED`, `MCP_ENDPOINT`, `MCP_API_KEY`
- **Vector**: `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, `PINECONE_INDEX`, `WEAVIATE_URL`, `WEAVIATE_API_KEY`
- **Cache**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `MEMCACHED_HOST`, `MEMCACHED_PORT`
- **DB**: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `MONGO_URI`
- **LLM**: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
- **Policy**: `CAP_ENABLE_REDACTION`, `CAP_LOG_SENSITIVE`, `CAP_ALLOWED_TOOLS`, `CAP_BLOCKED_KEYWORDS`
- **Telemetry**: `PROMETHEUS_ENABLED`, `PROMETHEUS_PORT`, `OTEL_EXPORTER`, `OTEL_ENDPOINT`

Defaults and parsing (numbers/booleans/string lists) are handled in the config loader.

### Docker environment examples
```bash
# Minimal
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  cap-server

# With Redis via compose (recommended)
OPENAI_API_KEY=$OPENAI_API_KEY docker compose up --build
```

## HTTP API
- **POST** `/cap/create_session`
  - body: `{ userId?: string, labels?: Record<string,string> }`
  - returns: `{ sessionId, createdAt }`
- **POST** `/cap/store`
  - body: `{ sessionId: string, content: string, meta?: any }`
  - returns: `{ id, createdAt }`
- **POST** `/cap/retrieve`
  - body: `{ sessionId: string, query: string }`
  - returns: `{ items: [...], source }`
- **POST** `/cap/orchestrate`
  - body: `{ sessionId: string, query: string }`
  - returns: `{ answer, contextUsed, metadata }`

## Using CAP as a Library
```ts
import { CAPClient } from "@contextawareprotocol/core";
import { InMemoryVectorStore, MemoryCache, OpenAIAdapter, OpenAIEmbedder } from "@contextawareprotocol/adapters";

const cap = new CAPClient({
  vector: new InMemoryVectorStore(),
  cache: new MemoryCache(),
  embedder: new OpenAIEmbedder(),
  llm: new OpenAIAdapter()
});

const s = cap.createSession("user-123");
await cap.store(s.id, "Company refund policy allows 30-day returns with receipt.");
const out = await cap.orchestrate(s.id, "What is the refund policy?");
console.log(out.answer);
```

## MCP Integration (Bridge)
Wire the MCP bridge methods into your MCP server tooling:
- `cap.create_session`, `cap.store`, `cap.retrieve`, `cap.orchestrate`.
See `packages/cap-bridge-mcp` and `packages/examples/with-mcp.ts` for a minimal mock.

## Extensibility
- **Vector stores**: Implement `VectorAdapter` to support Pinecone/Weaviate/FAISS.
- **Caches**: Implement `CacheAdapter` (Redis provided).
- **LLMs/Embeddings**: Implement `LLMAdapter`/`Embedder` to use your providers.
- **Policies**: Add redaction rules/guards in `Policy` or intercept requests in the server.

## Performance & Cost Savings
- **Cache‑first retrieval**: Avoids repeat embedding queries and DB scans.
- **Relevance ranking**: Minimizes tokens sent to the LLM by trimming to the most relevant snippets.
- **Session memory**: Reduces prompt size while preserving important context.
- **Swappable backends**: Choose infra that matches your latency and cost profile.

## Security, Privacy, Compliance
- **Redaction hooks**: Remove PII/secrets before they reach the model.
- **Access control**: Add guards prior to retrieval or tool execution.
- **Auditability**: Centralized orchestration provides a single place to log and reason about data flows.

## Notes
- The default vector and cache implementations are in‑memory for zero‑dependency prototyping. For production, plug in Redis and a managed vector DB.
- Requires Node.js 18+.

## Roadmap (suggested)
- Pluggable external data fetchers (GraphQL/SQL/HTTP) for structured context.
- Built‑in policy packs (PII, secrets, regulatory patterns).
- First‑class session stores (Redis/Postgres) beyond process memory.

## License
MIT

