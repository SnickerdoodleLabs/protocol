import { Brand, make } from "ts-brand";

export type LLMAnswerStructure = Brand<string, "LLMAnswerStructure">;
export const LLMAnswerStructure = make<LLMAnswerStructure>();
