"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policy = void 0;
class Policy {
    piiPatterns;
    constructor(piiPatterns = []) {
        this.piiPatterns = piiPatterns;
    }
    redact(text) {
        return this.piiPatterns.reduce((acc, re) => acc.replace(re, "[REDACTED]"), text);
    }
}
exports.Policy = Policy;
