import { Brand, make } from "ts-brand";

export type LLMQuestion = Brand<string, "LLMQuestion">;
export const LLMQuestion = make<LLMQuestion>();
