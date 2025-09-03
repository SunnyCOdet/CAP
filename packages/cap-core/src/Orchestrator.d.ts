import { LLMAdapter, OrchestrateInput, OrchestrateOutput } from "./types";
import { Retriever } from "./Retriever";
import { ContextManager } from "./ContextManager";
export declare class Orchestrator {
    private retriever;
    private llm;
    private ctx;
    constructor(retriever: Retriever, llm: LLMAdapter, ctx: ContextManager);
    private buildPrompt;
    run(input: OrchestrateInput): Promise<OrchestrateOutput>;
}
