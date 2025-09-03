import { Session, StoredItem, UUID } from "./types";
import { uuid, now } from "./utils";

export class ContextManager {
  private sessions = new Map<UUID, Session>();
  private itemsBySession = new Map<UUID, StoredItem[]>();

  createSession(userId?: string, labels?: Record<string, string>): Session {
    const s: Session = { id: uuid(), userId, createdAt: now(), updatedAt: now(), labels };
    this.sessions.set(s.id, s);
    this.itemsBySession.set(s.id, []);
    return s;
  }

  getOrCreateSession(sessionId?: UUID, userId?: string): Session {
    if (sessionId && this.sessions.has(sessionId)) return this.sessions.get(sessionId)!;
    return this.createSession(userId);
  }

  touch(sessionId: UUID) {
    const s = this.sessions.get(sessionId);
    if (s) { s.updatedAt = now(); this.sessions.set(sessionId, s); }
  }

  store(sessionId: UUID, content: string, meta?: Record<string, any>): StoredItem {
    const arr = this.itemsBySession.get(sessionId);
    if (!arr) throw new Error("Session not found");
    const item: StoredItem = { id: uuid(), sessionId, content, meta, createdAt: now() };
    arr.push(item);
    this.itemsBySession.set(sessionId, arr);
    this.touch(sessionId);
    return item;
    }

  history(sessionId: UUID, limit = 50): StoredItem[] {
    const arr = this.itemsBySession.get(sessionId) ?? [];
    return arr.slice(-limit);
  }

  allSessions(): Session[] { return Array.from(this.sessions.values()); }
}


