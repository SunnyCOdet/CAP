import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  app: {
    env: process.env.APP_ENV || "development",
    port: Number(process.env.APP_PORT) || 3000,
    logLevel: process.env.APP_LOG_LEVEL || "info",
    instanceId: process.env.CAP_INSTANCE_ID || "cap-core-01",
    sessionTTL: Number(process.env.CAP_DEFAULT_SESSION_TTL) || 3600,
  },
  mcp: {
    enabled: process.env.MCP_ENABLED === "true",
    endpoint: process.env.MCP_ENDPOINT || "",
    apiKey: process.env.MCP_API_KEY || "",
  },
  vector: {
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: process.env.PINECONE_ENVIRONMENT || "",
      index: process.env.PINECONE_INDEX || "cap-context-index",
    },
    weaviate: {
      url: process.env.WEAVIATE_URL || "",
      apiKey: process.env.WEAVIATE_API_KEY || "",
    },
  },
  cache: {
    redis: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || "",
      db: Number(process.env.REDIS_DB) || 0,
    },
    memcached: {
      host: process.env.MEMCACHED_HOST || "127.0.0.1",
      port: Number(process.env.MEMCACHED_PORT) || 11211,
    },
  },
  db: {
    postgres: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "cap_user",
      password: process.env.DB_PASSWORD || "cap_password",
      name: process.env.DB_NAME || "cap_db",
    },
    mongo: {
      uri: process.env.MONGO_URI || "",
    },
  },
  llm: {
    openai: process.env.OPENAI_API_KEY || "",
    anthropic: process.env.ANTHROPIC_API_KEY || "",
    gemini: process.env.GEMINI_API_KEY || "",
  },
  policy: {
    redaction: process.env.CAP_ENABLE_REDACTION === "true",
    logSensitive: process.env.CAP_LOG_SENSITIVE === "true",
    allowedTools: (process.env.CAP_ALLOWED_TOOLS || "").split(",").filter(Boolean),
    blockedKeywords: (process.env.CAP_BLOCKED_KEYWORDS || "").split(",").filter(Boolean),
  },
  audit: {
    logPath: process.env.AUDIT_LOG_PATH || "./logs/cap_audit.log",
    logLevel: process.env.AUDIT_LOG_LEVEL || "info",
  },
  telemetry: {
    prometheus: {
      enabled: process.env.PROMETHEUS_ENABLED === "true",
      port: Number(process.env.PROMETHEUS_PORT) || 9090,
    },
    tracing: {
      exporter: process.env.OTEL_EXPORTER || "jaeger",
      endpoint: process.env.OTEL_ENDPOINT || "",
    },
  },
};


