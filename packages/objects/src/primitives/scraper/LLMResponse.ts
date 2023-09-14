import { Brand, make } from "ts-brand";

export type LLMResponse = Brand<string, "LLMResponse">;
export const LLMResponse = make<LLMResponse>();
