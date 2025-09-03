export declare class Policy {
    private piiPatterns;
    constructor(piiPatterns?: RegExp[]);
    redact(text: string): string;
}
