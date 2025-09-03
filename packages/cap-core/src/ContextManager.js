"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const utils_1 = require("./utils");
class ContextManager {
    sessions = new Map();
    itemsBySession = new Map();
    createSession(userId, labels) {
        const s = { id: (0, utils_1.uuid)(), userId, createdAt: (0, utils_1.now)(), updatedAt: (0, utils_1.now)(), labels };
        this.sessions.set(s.id, s);
        this.itemsBySession.set(s.id, []);
        return s;
    }
    getOrCreateSession(sessionId, userId) {
        if (sessionId && this.sessions.has(sessionId))
            return this.sessions.get(sessionId);
        return this.createSession(userId);
    }
    touch(sessionId) {
        const s = this.sessions.get(sessionId);
        if (s) {
            s.updatedAt = (0, utils_1.now)();
            this.sessions.set(sessionId, s);
        }
    }
    store(sessionId, content, meta) {
        const arr = this.itemsBySession.get(sessionId);
        if (!arr)
            throw new Error("Session not found");
        const item = { id: (0, utils_1.uuid)(), sessionId, content, meta, createdAt: (0, utils_1.now)() };
        arr.push(item);
        this.itemsBySession.set(sessionId, arr);
        this.touch(sessionId);
        return item;
    }
    history(sessionId, limit = 50) {
        const arr = this.itemsBySession.get(sessionId) ?? [];
        return arr.slice(-limit);
    }
    allSessions() { return Array.from(this.sessions.values()); }
}
exports.ContextManager = ContextManager;
