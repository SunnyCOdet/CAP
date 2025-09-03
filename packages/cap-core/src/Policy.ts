export class Policy {
  constructor(private piiPatterns: RegExp[] = []) {}
  redact(text: string): string {
    return this.piiPatterns.reduce((acc, re) => acc.replace(re, "[REDACTED]"), text);
  }
}


