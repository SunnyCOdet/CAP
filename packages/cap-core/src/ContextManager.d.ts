import { Session, StoredItem, UUID } from "./types";
export declare class ContextManager {
    private sessions;
    private itemsBySession;
    createSession(userId?: string, labels?: Record<string, string>): Session;
    getOrCreateSession(sessionId?: UUID, userId?: string): Session;
    touch(sessionId: UUID): void;
    store(sessionId: UUID, content: string, meta?: Record<string, any>): StoredItem;
    history(sessionId: UUID, limit?: number): StoredItem[];
    allSessions(): Session[];
}
